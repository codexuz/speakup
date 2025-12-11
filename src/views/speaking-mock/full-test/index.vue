<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Speaking Tests</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid class="speaking-container">

        <!-- Tests Section -->
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-lg="10" size-xl="12">
            <div v-if="allTests.length > 0" class="tests-grid ion-padding-vertical">
              <div
                v-for="test in allTests"
                :key="test.id"
                class="test-grid-item"
              >
                <ion-card class="test-card premium-card">
                  <div class="card-glow"></div>
                  <ion-card-header class="card-header">
                    <div class="test-badge">
                      <ion-icon :icon="trophyOutline"></ion-icon>
                      <span>{{ test.level || "All Levels" }}</span>
                    </div>
                    <ion-card-title class="test-title">
                      {{ test.title }}
                    </ion-card-title>
                  </ion-card-header>

                  <ion-card-content class="card-content">
                    <p class="test-description">{{ test.description }}</p>

                    <div class="test-stats">
                      <div class="stat-item">
                        <ion-icon :icon="timeOutline"></ion-icon>
                        <span>15-20 min</span>
                      </div>
                      <div class="stat-item">
                        <ion-icon :icon="peopleOutline"></ion-icon>
                        <span>Real conditions</span>
                      </div>
                    </div>

                    <div class="test-actions">
                      <div class="price-tag">
                        <ion-icon :icon="diamondOutline"></ion-icon>
                        <span>{{ test.price || "10,000" }} UZS</span>
                      </div>

                      <ion-button
                        size="medium"
                        color="primary"
                        class="action-button"
                        @click="purchaseTest(test.id)"
                        v-if="!isPurchased(test.id)"
                      >
                        <ion-icon :icon="cardOutline" slot="start"></ion-icon>
                        Purchase
                      </ion-button>
                      <ion-button
                        size="medium"
                        color="success"
                        class="action-button"
                        :router-link="`/speaking-mock/full-test/${test.id}`"
                        v-else-if="
                          isPurchased(test.id) && !isCompleted(test.id)
                        "
                      >
                        <ion-icon :icon="playOutline" slot="start"></ion-icon>
                        Start Test
                      </ion-button>
                      <ion-button
                        size="medium"
                        color="medium"
                        class="action-button"
                        disabled
                        v-else
                      >
                        <ion-icon
                          :icon="checkmarkOutline"
                          slot="start"
                        ></ion-icon>
                        Completed
                      </ion-button>
                    </div>
                  </ion-card-content>
                </ion-card>
              </div>
            </div>

            <div v-else class="empty-state">
              <ion-spinner
                v-if="loading"
                name="crescent"
                class="loading-spinner"
              ></ion-spinner>
              <div v-else class="empty-content">
                <div class="empty-icon">
                  <ion-icon :icon="documentTextOutline"></ion-icon>
                </div>
                <h3 class="empty-title">No speaking tests available</h3>
                <p class="empty-description">Check back later for new tests</p>
              </div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { toastController, alertController } from "@ionic/vue";
import endpoints from "@/utils/apiEndpoints";
import { useUser } from "@/composables/useUser";
import {
  playOutline,
  micOutline,
  trophyOutline,
  timeOutline,
  peopleOutline,
  diamondOutline,
  cardOutline,
  checkmarkOutline,
  documentTextOutline,
} from "ionicons/icons";
const router = useRouter();
const { user, updateUser } = useUser();
const tests = ref([]);
const userPurchases = ref([]);
const loading = ref(true);

// Computed properties for filtered tests
const allTests = computed(() => tests.value);

// Check if a test is purchased
const isPurchased = (testId) => {
  return userPurchases.value.some((purchase) => purchase.test_id === testId);
};

// Check if a test is completed
const isCompleted = (testId) => {
  const purchase = userPurchases.value.find((p) => p.test_id === testId);
  return purchase && purchase.status === "completed";
};

// Load tests and user purchases
const loadData = async () => {
  try {
    loading.value = true;

    // Load all tests
    const testsResponse = await endpoints.speaking.getAll();
    tests.value = testsResponse;

    // Load user purchases if user is logged in
    if (user.value) {
      const purchasesResponse = await endpoints.speaking.getPurchasedTests();
      userPurchases.value = purchasesResponse || [];

      // Apply test information to purchased tests
      userPurchases.value = userPurchases.value.map((purchase) => {
        // Find the corresponding test
        const testInfo = tests.value.find((t) => t.id === purchase.test_id);
        // Merge test info with purchase data
        return {
          ...purchase,
          title: testInfo?.title || "Unknown Test",
          description: testInfo?.description || "",
          level: testInfo?.level || "All Levels",
        };
      });
    }
  } catch (error) {
    console.error("Failed to load data:", error);
  } finally {
    loading.value = false;
  }
};

// Purchase a test with balance checking
const purchaseTest = async (testId) => {
  // Find the test to get its info
  const test = tests.value.find((t) => t.id === testId);

  if (!test) {
    const toast = await toastController.create({
      message: "Test not found.",
      duration: 3000,
      color: "danger",
      position: "bottom",
    });
    await toast.present();
    return;
  }

  if (!user.value) {
    const toast = await toastController.create({
      message: "Please login to purchase tests.",
      duration: 3000,
      color: "warning",
      position: "bottom",
    });
    await toast.present();
    return;
  }

  const testCost = 10000; // All tests cost 10,000 UZS

  // Check if user has enough balance
  if (!user.value.balance || user.value.balance < testCost) {
    const toast = await toastController.create({
      message: `Insufficient balance. You need ${testCost} UZS to purchase this test.`,
      duration: 4000,
      color: "danger",
      position: "bottom",
    });
    await toast.present();
    return;
  }

  // Show confirmation alert
  const alert = await alertController.create({
    header: "Confirm Purchase",
    message: `Do you want to purchase "${test.title}" for ${testCost} UZS?`,
    buttons: [
      {
        text: "Cancel",
        role: "cancel",
        cssClass: "secondary",
      },
      {
        text: "Purchase",
        role: "confirm",
        handler: async () => {
          await processPurchase(testId, testCost);
        },
      },
    ],
  });

  await alert.present();
};

// Process the actual purchase
const processPurchase = async (testId, testCost) => {
  try {
    loading.value = true;

    // Make purchase API call
    await endpoints.speaking.purchaseTests({
      user_id: user.value.id,
      status: "new",
      test_id: testId,
      cost: testCost,
    });

    // Update user balance locally after successful purchase
    if (user.value.balance >= testCost) {
      const updatedBalance = user.value.balance - testCost;
      await updateUser({ balance: updatedBalance });
    }

    // Show success message
    const toast = await toastController.create({
      message: "Test purchased successfully! You can now start the test.",
      duration: 3000,
      color: "success",
      position: "bottom",
    });
    await toast.present();

    // Reload data to update UI
    await loadData();
  } catch (error) {
    console.error("Failed to purchase test:", error);
    const toast = await toastController.create({
      message: "No sufficient balance. Please top up your balance.",
      duration: 3000,
      color: "danger",
      position: "bottom",
    });
    await toast.present();
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* Container and Layout */
.speaking-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 2rem 0 3rem;
  background: linear-gradient(
    135deg,
    oklch(0.7 0.15 250) 0%,
    oklch(0.8 0.1 200) 100%
  );
  border-radius: 24px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
  pointer-events: none;
}

.hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
}

.hero-icon ion-icon {
  font-size: 2.5rem;
  color: white;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
}

.hero-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Custom Segment */
.custom-segment {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 6px;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-segment-button {
  --color: rgba(0, 0, 0, 0.7);
  --color-checked: white;
  --indicator-color: oklch(0.7 0.15 250);
  border-radius: 12px;
  margin: 0;
  min-height: 48px;
  font-weight: 600;
}

/* Tests Grid */
.tests-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .tests-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .tests-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Test Cards */
.test-card {
  --background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(20px);
}

.test-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.premium-card {
  background: linear-gradient(135deg, white 0%, #f8fafc 100%);
}

.owned-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    oklch(0.7 0.15 250) 0%,
    oklch(0.8 0.1 200) 100%
  );
}

/* Card Header */
.card-header {
  padding: 1.5rem 1.5rem 1rem;
  position: relative;
}

.test-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(
    135deg,
    oklch(0.95 0.05 250) 0%,
    oklch(0.97 0.03 200) 100%
  );
  color: oklch(0.5 0.15 250);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border: 1px solid oklch(0.9 0.05 250);
}

.owned-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.test-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.3;
}

.test-level {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Card Content */
.card-content {
  padding: 0 1.5rem 1.5rem;
}

.test-description {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.test-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.stat-item ion-icon {
  color: oklch(0.6 0.15 250);
}

.test-status {
  margin-bottom: 1.5rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-ready {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
  border: 1px solid rgba(29, 78, 216, 0.2);
}

.status-completed {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #059669;
  border: 1px solid rgba(5, 150, 105, 0.2);
}

/* Actions */
.test-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.single-action {
  justify-content: stretch;
}

.price-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
  color: #92400e;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  border: 1px solid rgba(146, 64, 14, 0.2);
}

.action-button {
  --border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: normal;
}

.start-button,
.completed-button {
  --border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: normal;
  margin-top: 0;
}

/* Empty State */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 2rem;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 50%;
  margin-bottom: 1.5rem;
}

.empty-icon ion-icon {
  font-size: 2.5rem;
  color: #9ca3af;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 1rem;
}

.empty-description {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.browse-button {
  --border-radius: 12px;
  font-weight: 600;
}

.loading-spinner {
  --color: oklch(0.6 0.15 250);
  transform: scale(1.5);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .test-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .price-tag {
    justify-content: center;
  }
}
</style>
