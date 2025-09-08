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
      <div class="speaking-intro">
        <h2 class="text-xl font-bold mb-2">Full Speaking Tests</h2>
        <p class="text-gray-300 mb-4">
          Practice your speaking skills with our comprehensive test collection.
          Each test simulates real exam conditions.
        </p>
      </div>

      <ion-segment v-model="activeTab" mode="ios" class="mb-4">
        <ion-segment-button value="all">
          <ion-label>All Tests</ion-label>
        </ion-segment-button>
        <ion-segment-button value="purchased">
          <ion-label>Purchased Tests</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- All Tests Tab -->
      <div v-if="activeTab === 'all'">
        <div v-if="allTests.length > 0" class="speaking-cards">
          <ion-card
            v-for="test in allTests"
            :key="test.id"
            class="test-card mb-4 rounded-xl"
          >
            <ion-card-header>
              <ion-card-title class="text-lg font-medium">
                {{ test.title }}
              </ion-card-title>
              <ion-card-subtitle>
                {{ test.level || "All Levels" }}
              </ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              <p class="mb-2">{{ test.description }}</p>
              <div class="flex items-center justify-between mt-4">
                <div class="text-lg font-bold text-yellow-400">
                  {{ test.price || 0 }} coin
                </div>
                <ion-button
                  size="medium"
                  color="warning"
                  @click="openPaymentInstructions(test.id)"
                  v-if="isLocked(test.id)"
                >
                  Unlock Test
                </ion-button>
                <ion-button
                  size="medium"
                  color="primary"
                  @click="purchaseTest(test.id)"
                  v-else-if="!isPurchased(test.id)"
                >
                  Buy Test
                </ion-button>
                <ion-button
                  size="medium"
                  color="success"
                  :router-link="`/speaking/full-test/${test.id}`"
                  v-else-if="isPurchased(test.id) && !isCompleted(test.id)"
                >
                  Start Test
                </ion-button>
                <ion-button size="medium" color="medium" disabled v-else>
                  Completed
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <div v-else class="flex flex-col items-center justify-center mt-10">
          <ion-spinner v-if="loading" name="crescent"></ion-spinner>
          <div v-else class="text-center">
            <p class="text-lg">No speaking tests available</p>
            <p class="text-sm text-gray-400 mt-2">
              Check back later for new tests
            </p>
          </div>
        </div>
      </div>

      <!-- Purchased Tests Tab -->
      <div v-else-if="activeTab === 'purchased'">
        <div v-if="userPurchases.length > 0" class="speaking-cards">
          <ion-card
            v-for="purchase in userPurchases"
            :key="purchase.id"
            class="test-card mb-4 rounded-xl"
          >
            <ion-card-header>
              <ion-card-title class="text-lg font-medium">
                {{ purchase.title }}
              </ion-card-title>
              <ion-card-subtitle>
                {{ purchase.level || "All Levels" }}
              </ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              <p class="mb-2">{{ purchase.description }}</p>
              <div class="mt-4">
                <ion-button
                  size="medium"
                  expand="block"
                  color="success"
                  :router-link="`/speaking/full-test/abe2b4b2-baab-4b3e-a440-a8d178166f61`"
                  v-if="purchase.status === 'new'"
                >
                  Start Test 
                </ion-button>
                <ion-button
                  size="medium"
                  expand="block"
                  color="medium"
                  disabled
                  v-else
                >
                  Completed
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <div v-else class="flex flex-col items-center justify-center mt-10">
          <ion-spinner v-if="loading" name="crescent"></ion-spinner>
          <div v-else class="text-center">
            <p class="text-lg">No purchased tests</p>
            <p class="text-sm text-gray-400 mt-2">
              Purchase tests to start practicing
            </p>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- Bottom Sheet for payment instructions -->
    <ion-modal
      :is-open="showBottomSheet"
      @didDismiss="showBottomSheet = false"
      :initial-breakpoint="0.75"
      :breakpoints="[0, 0.25, 0.5, 0.75]"
      handle-behavior="cycle"
    >
      <div class="ion-padding">
        <h3 class="text-xl font-bold mb-4">How to Purchase Tests</h3>
        <p class="mb-4">
          We currently don't have an online payment system. To purchase this
          test, please follow these steps:
        </p>

        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <ol class="list-decimal pl-5 space-y-2">
            <li>Contact our admin via Telegram</li>
            <li>Admin will provide payment instructions</li>
            <li>
              Once payment is confirmed, the test will be unlocked for you
            </li>
          </ol>
        </div>

        <div class="flex flex-col space-y-3">
          <ion-button expand="block" color="primary" @click="openTelegram">
            <ion-icon name="paper-plane" slot="start"></ion-icon>
            See Tariff Plans
          </ion-button>

          <ion-button
            expand="block"
            color="light"
            @click="showBottomSheet = false"
          >
            Close
          </ion-button>
        </div>
      </div>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import endpoints from "@/utils/apiEndpoints";
import { useUser } from "@/composables/useUser";

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
  router.push('/payment')
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
.test-card {
  --background: rgba(7, 1, 13, 0.25);
  backdrop-filter: blur(7.5px);
  -webkit-backdrop-filter: blur(7.5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease;
}

.test-card:hover {
  transform: translateY(-3px);
}

ion-toolbar {
  --background: #070404;
}

ion-segment {
  --background: rgba(7, 1, 13, 0.25);
  border-radius: 8px;
  margin-bottom: 16px;
}

ion-segment-button {
  --color: #a0a0a0;
  --color-checked: #ffffff;
  --indicator-color: #3880ff;
}

.text-yellow-400 {
  color: #facc15;
}
</style>
