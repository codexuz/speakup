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
        <!-- Header Section -->
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-lg="10" size-xl="8">
            <div class="speaking-intro">
              <div class="hero-section">
                <div class="hero-icon">
                  <ion-icon :icon="micOutline"></ion-icon>
                </div>
                <h1 class="hero-title">Full Speaking Tests</h1>
                <p class="hero-description">
                  Practice your speaking skills with our comprehensive test collection.
                  Each test simulates real IELTS exam conditions with professional feedback.
                </p>
              </div>
            </div>
          </ion-col>
        </ion-row>

        <!-- Tab Navigation -->
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="8" size-lg="6">
            <ion-segment v-model="activeTab" mode="ios" class="custom-segment">
              <ion-segment-button value="all" class="custom-segment-button">
                <ion-icon :icon="libraryOutline" slot="start"></ion-icon>
                <ion-label>All Tests</ion-label>
              </ion-segment-button>
              <ion-segment-button value="purchased" class="custom-segment-button">
                <ion-icon :icon="checkmarkCircleOutline" slot="start"></ion-icon>
                <ion-label>My Tests</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-col>
        </ion-row>

        <!-- All Tests Tab -->
        <ion-row v-if="activeTab === 'all'" class="ion-justify-content-center">
          <ion-col size="12" size-lg="10" size-xl="12">
            <div v-if="allTests.length > 0" class="tests-grid">
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
                        color="warning"
                        class="action-button"
                        @click="openPaymentInstructions(test.id)"
                        v-if="isLocked(test.id)"
                      >
                        <ion-icon :icon="lockOpenOutline" slot="start"></ion-icon>
                        Unlock
                      </ion-button>
                      <ion-button
                        size="medium"
                        color="primary"
                        class="action-button"
                        @click="purchaseTest(test.id)"
                        v-else-if="!isPurchased(test.id)"
                      >
                        <ion-icon :icon="cardOutline" slot="start"></ion-icon>
                        Purchase
                      </ion-button>
                      <ion-button
                        size="medium"
                        color="success"
                        class="action-button"
                        :router-link="`/speaking-mock/full-test/${test.id}`"
                        v-else-if="isPurchased(test.id) && !isCompleted(test.id)"
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
                        <ion-icon :icon="checkmarkOutline" slot="start"></ion-icon>
                        Completed
                      </ion-button>
                    </div>
                  </ion-card-content>
                </ion-card>
              </div>
            </div>

            <div v-else class="empty-state">
              <ion-spinner v-if="loading" name="crescent" class="loading-spinner"></ion-spinner>
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

        <!-- Purchased Tests Tab -->
        <ion-row v-else-if="activeTab === 'purchased'" class="ion-justify-content-center">
          <ion-col size="12" size-lg="10" size-xl="12">
            <div v-if="userPurchases.length > 0" class="tests-grid">
              <div 
                v-for="purchase in userPurchases"
                :key="purchase.id"
                class="test-grid-item"
              >
                <ion-card class="test-card owned-card">
                  <div class="owned-badge">
                    <ion-icon :icon="checkmarkCircle"></ion-icon>
                    <span>Owned</span>
                  </div>
                  <ion-card-header class="card-header">
                    <ion-card-title class="test-title">
                      {{ purchase.title }}
                    </ion-card-title>
                    <div class="test-level">{{ purchase.level || "All Levels" }}</div>
                  </ion-card-header>

                  <ion-card-content class="card-content">
                    <p class="test-description">{{ purchase.description }}</p>
                    
                    <div class="test-status">
                      <div class="status-indicator" :class="purchase.status === 'new' ? 'status-ready' : 'status-completed'">
                        <ion-icon :icon="purchase.status === 'new' ? playCircle : checkmarkCircle"></ion-icon>
                        <span>{{ purchase.status === 'new' ? 'Ready to start' : 'Completed' }}</span>
                      </div>
                    </div>

                    <div class="test-actions single-action">
                      <ion-button
                        expand="block"
                        color="success"
                        class="start-button"
                        :router-link="`/speaking-mock/full-test/abe2b4b2-baab-4b3e-a440-a8d178166f61`"
                        v-if="purchase.status === 'new'"
                      >
                        <ion-icon :icon="playOutline" slot="start"></ion-icon>
                        Start Test 
                      </ion-button>
                      <ion-button
                        expand="block"
                        color="medium"
                        class="completed-button"
                        disabled
                        v-else
                      >
                        <ion-icon :icon="checkmarkOutline" slot="start"></ion-icon>
                        Completed
                      </ion-button>
                    </div>
                  </ion-card-content>
                </ion-card>
              </div>
            </div>

            <div v-else class="empty-state">
              <ion-spinner v-if="loading" name="crescent" class="loading-spinner"></ion-spinner>
              <div v-else class="empty-content">
                <div class="empty-icon">
                  <ion-icon :icon="bagOutline"></ion-icon>
                </div>
                <h3 class="empty-title">No purchased tests</h3>
                <p class="empty-description">Purchase tests from the "All Tests" tab to start practicing</p>
                <ion-button 
                  color="primary" 
                  fill="outline"
                  @click="activeTab = 'all'"
                  class="browse-button"
                >
                  <ion-icon :icon="storefrontOutline" slot="start"></ion-icon>
                  Browse Tests
                </ion-button>
              </div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

    <!-- Premium Payment Instructions Modal -->
    <ion-modal
      :is-open="showBottomSheet"
      @didDismiss="showBottomSheet = false"
      :initial-breakpoint="0.75"
      :breakpoints="[0, 0.25, 0.5, 0.75]"
      handle-behavior="cycle"
      class="payment-modal"
    >
      <ion-content class="modal-content ion-padding">
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="12" size-md="10" size-lg="8">
              <div class="modal-header mt-4">
                <div class="modal-icon">
                  <ion-icon :icon="diamondOutline"></ion-icon>
                </div>
                <h2 class="modal-title">Unlock Premium Test</h2>
                <p class="modal-subtitle">Get access to professional IELTS speaking practice</p>
              </div>

              <div class="payment-steps p-3">
                <h4 class="steps-title">How to Purchase</h4>
                <div class="steps-container">
                  <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                      <h5>Contact Admin</h5>
                      <p>Reach out to our admin via Telegram for assistance</p>
                    </div>
                  </div>
                  <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                      <h5>Payment Instructions</h5>
                      <p>Admin will provide secure payment methods</p>
                    </div>
                  </div>
                  <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                      <h5>Instant Access</h5>
                      <p>Test unlocked immediately after confirmation</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-actions ion-padding">
                <ion-button 
                  expand="block" 
                  color="primary" 
                  class="primary-action"
                  @click="openTelegram"
                >
                  <ion-icon :icon="paperPlane" slot="start"></ion-icon>
                  Contact US via Telegram
                </ion-button>

                <ion-button
                  expand="block"
                  fill="outline"
                  color="medium"
                  class="secondary-action"
                  @click="showBottomSheet = false"
                >
                  <ion-icon :icon="closeOutline" slot="start"></ion-icon>
                  Close
                </ion-button>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import endpoints from "@/utils/apiEndpoints";
import { useUser } from "@/composables/useUser";
import { 
  playOutline, 
  closeOutline,
  micOutline,
  libraryOutline,
  checkmarkCircleOutline,
  trophyOutline,
  timeOutline,
  peopleOutline,
  diamondOutline,
  lockOpenOutline,
  cardOutline,
  checkmarkOutline,
  documentTextOutline,
  checkmarkCircle,
  bagOutline,
  storefrontOutline,
  paperPlane,
  playCircle
} from "ionicons/icons";
const router = useRouter();
const { user } = useUser();
const tests = ref([]);
const userPurchases = ref([]);
const loading = ref(true);
const activeTab = ref("all");
const showAlert = ref(false);
const alertMessage = ref("");
const showBottomSheet = ref(false);
const selectedTestId = ref(null);

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

// Check if a test is locked and requires admin approval
const isLocked = (testId) => {
  const test = tests.value.find((t) => t.id === testId);
  return test && test.requiresApproval && !isPurchased(testId);
};

// Function to open bottom sheet for payment instructions
const openPaymentInstructions = (testId) => {
  selectedTestId.value = testId;
  showBottomSheet.value = true;
};

// Function to open Telegram
const openTelegram = () => {
  showBottomSheet.value = false;
  window.location.href = "https://t.me/javlon_developer";
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

// Purchase a test (now opens payment instructions)
const purchaseTest = (testId) => {
  // Find the test to get its info
  const test = tests.value.find((t) => t.id === testId);

  if (!test) {
    alertMessage.value = "Test not found.";
    showAlert.value = true;
    return;
  }

  if (!user.value) {
    alertMessage.value = "Please login to purchase tests.";
    showAlert.value = true;
    return;
  }

  // Open bottom sheet with payment instructions
  openPaymentInstructions(testId);
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
  background: linear-gradient(135deg, oklch(0.7 0.15 250) 0%, oklch(0.8 0.1 200) 100%);
  border-radius: 24px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
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
  background: linear-gradient(90deg, oklch(0.7 0.15 250) 0%, oklch(0.8 0.1 200) 100%);
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
  background: linear-gradient(135deg, oklch(0.95 0.05 250) 0%, oklch(0.97 0.03 200) 100%);
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

.start-button, .completed-button {
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

/* Modal Styles */
.payment-modal {
  --border-radius: 24px 24px 0 0;
}

.modal-content {
  --padding-start: 0;
  --padding-end: 0;
  padding: 2rem 1rem;
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.modal-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, oklch(0.95 0.05 250) 0%, oklch(0.97 0.03 200) 100%);
  border-radius: 50%;
  margin-bottom: 1.5rem;
  border: 1px solid oklch(0.9 0.05 250);
}

.modal-icon ion-icon {
  font-size: 2.5rem;
  color: oklch(0.5 0.15 250);
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem;
}

.modal-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.payment-steps {
  margin-bottom: 2rem;
}

.steps-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1.5rem;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, oklch(0.7 0.15 250) 0%, oklch(0.8 0.1 200) 100%);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.step-content h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.25rem;
}

.step-content p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.primary-action {
  --border-radius: 12px;
  font-weight: 600;
}

.secondary-action {
  --border-radius: 12px;
  font-weight: 600;
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
