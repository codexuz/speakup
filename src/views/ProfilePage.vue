<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="bg-white border-b border-gray-200">
        <ion-title class="text-xl font-semibold text-text-primary">
          My Profile
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row
          class="ion-margin-top items-center justify-center mx-auto gap-x-4 gap-y-2"
        >
          <ion-col size="12" size-md="6" size-lg="6" size-sm="12">
            <ion-card
              class="rounded-2xl mx-auto shadow-none border border-gray-200 mt-4"
            >
              <ion-card-content>
                <div class="flex items-center gap-x-3">
                  <Avatar
                    :firstName="user?.first_name || user?.last_name || 'User'"
                    backgroundColor="dodgerblue"
                  />
                  <ion-card-title class="poppins-bold text-xl sm:text-3xl">
                    {{ user?.first_name || user?.last_name || "User" }}

                    <p class="poppins-regular text-sm text-gray-600">
                      {{ user?.username ? "@" + user.username : "no username" }}
                    </p>
                  </ion-card-title>
                </div>
                <div class="border-b border-gray-300 pt-5"></div>

                <ion-list>
                  <ion-item id="tariff-modal" :button="true">
                    <NotebookText class="w-5 h-5 mr-3" slot="start" />
                    <ion-label>Tariffs</ion-label>
                  </ion-item>
                  <ion-item :button="true">
                    <Wallet class="w-5 h-5 mr-3" slot="start" />
                    <ion-label>Balance</ion-label>
                    <ion-label slot="end">{{
                      user?.balance ? user.balance + " UZS" : 0 + " UZS"
                    }}</ion-label>
                  </ion-item>
                  <ion-item
                    :button="true"
                    @click="handleCheckUpdate"
                    v-if="!isWeb"
                  >
                    <RefreshCw class="w-5 h-5 mr-3" slot="start" />
                    <ion-label>Check for Updates</ion-label>
                    <ion-label
                      v-if="appCurrentVersion"
                      slot="end"
                      class="text-gray-500"
                      >v{{ appCurrentVersion }}</ion-label
                    >
                  </ion-item>
                  <ion-item
                    href="https://t.me/javlon_developer"
                    target="_blank"
                    :button="true"
                  >
                    <Send class="w-5 h-5 mr-3" slot="start" />
                    <ion-label>Contact Us</ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
        <ion-row class="ion-margin-top px-2 items-center justify-center">
          <ion-col size="12" size-md="6" size-lg="6" size-sm="12">
            <ion-button
              id="open-modal"
              class="mx-auto"
              expand="block"
              color="danger"
            >
              <LogOut class="w-5 h-5 mr-2" />
              Logout
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

    <!-- Logout Confirmation Modal -->
    <ion-modal
      ref="modal"
      trigger="open-modal"
      :initial-breakpoint="0.4"
      :breakpoints="[0, 0.4]"
    >
      <ion-content class="modal-content">
        <div class="logout-modal">
          <div class="modal-header mt-4">
            <h2>Logout</h2>
            <p>Are you sure you want to log out?</p>
          </div>

          <div class="modal-actions">
            <ion-button
              @click="handleLogout"
              color="primary"
              expand="block"
              class="logout-btn text-white"
            >
              Yes, logout
            </ion-button>

            <ion-button
              @click="dismiss"
              fill="outline"
              color="dark"
              expand="block"
              class="mb-6"
            >
              Cancel
            </ion-button>
          </div>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Tariff Modal -->
    <ion-modal
      ref="tariffModal"
      trigger="tariff-modal"
      :initial-breakpoint="0.8"
      :breakpoints="[0, 0.8, 1]"
    >
      <ion-content class="modal-content">
        <div class="tariff-modal">
          <div class="modal-header mt-4 mb-6">
            <h2>Choose Your Plan</h2>
            <p>Select the perfect package for your speaking practice</p>
          </div>

          <div class="tariff-options">
            <!-- Single Mock Test -->
            <div class="tariff-card">
              <div class="tariff-header">
                <h3>Single Test</h3>
                <div class="price">10,000 <span>UZS</span></div>
                <p class="tests-count">1 Mock Test</p>
              </div>
              <ul class="features">
                <li>✓ Complete IELTS Speaking simulation</li>
                <li>✓ AI-powered feedback</li>
              </ul>
              <ion-button
                @click="selectTariff('single')"
                expand="block"
                fill="outline"
                color="primary"
              >
                Choose Plan
              </ion-button>
            </div>

            <!-- 6 Mock Tests -->
            <div class="tariff-card popular">
              <div class="popular-badge">Most Popular</div>
              <div class="tariff-header">
                <h3>Standard Package</h3>
                <div class="price">50,000 <span>UZS</span></div>
                <p class="tests-count">6 Mock Tests</p>
                <p class="savings">Save 16% vs single tests</p>
              </div>
              <ul class="features">
                <li>✓ 6 complete IELTS Speaking simulations</li>
                <li>✓ Advanced AI feedback</li>
              </ul>
              <ion-button
                @click="selectTariff('standard')"
                expand="block"
                color="primary"
              >
                Choose Plan
              </ion-button>
            </div>

            <!-- 20 Mock Tests -->
            <div class="tariff-card">
              <div class="tariff-header">
                <h3>Premium Package</h3>
                <div class="price">100,000 <span>UZS</span></div>
                <p class="tests-count">20 Mock Tests</p>
                <p class="savings">Save 50% vs single tests</p>
              </div>
              <ul class="features">
                <li>✓ 20 complete IELTS Speaking simulations</li>
                <li>✓ Advanced AI feedback</li>
              </ul>
              <ion-button
                @click="selectTariff('premium')"
                expand="block"
                fill="outline"
                color="primary"
              >
                Choose Plan
              </ion-button>
            </div>
          </div>

          <div class="modal-actions mt-4">
            <ion-button
              @click="dismissTariff"
              fill="clear"
              color="medium"
              expand="block"
            >
              Cancel
            </ion-button>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import { Wallet, Send, NotebookText, LogOut, RefreshCw } from "lucide-vue-next";
import { ref, onMounted, computed } from "vue";
import { toastController, alertController } from "@ionic/vue";
import { useRouter } from "vue-router";
import { useUser } from "@/composables/useUser";
import Avatar from "@/components/Avatar.vue";
import { Capacitor } from "@capacitor/core";
import { useAppUpdate } from "@/composables/useAppUpdate";

const modal = ref(null);
const tariffModal = ref(null);
const router = useRouter();
const { user, loadUser, logout } = useUser();
const loading = ref(true);

// App update
const {
  currentVersion,
  availableVersion,
  updateAvailable,
  checkForUpdate,
  openAppStore,
  performImmediateUpdate,
} = useAppUpdate();

const isWeb = computed(() => Capacitor.getPlatform() === "web");
const appCurrentVersion = ref("");

// Get current version on mount
onMounted(async () => {
  await loadUser();
  loading.value = false;

  if (!isWeb.value) {
    appCurrentVersion.value = currentVersion.value;
  }
});

const dismiss = () => {
  modal.value?.$el.dismiss();
};

const dismissTariff = () => {
  tariffModal.value?.$el.dismiss();
};

const selectTariff = async (tariffType) => {
  try {
    // Handle tariff selection logic here
    let amount, tests;

    switch (tariffType) {
      case "single":
        amount = 10000;
        tests = 1;
        break;
      case "standard":
        amount = 50000;
        tests = 6;
        break;
      case "premium":
        amount = 100000;
        tests = 20;
        break;
    }

    // You can add payment processing logic here
    console.log(
      `Selected tariff: ${tariffType}, Amount: ${amount} UZS, Tests: ${tests}`
    );

    const toast = await toastController.create({
      message: `Selected ${tests} test${
        tests > 1 ? "s" : ""
      } for ${amount.toLocaleString()} UZS`,
      duration: 2500,
      position: "top",
      color: "success",
    });

    await toast.present();
    dismissTariff();
  } catch (error) {
    const toast = await toastController.create({
      message: "Error selecting tariff",
      duration: 2500,
      position: "top",
      color: "danger",
    });
    await toast.present();
  }
};

const handleLogout = async () => {
  try {
    await logout();
    dismiss();
    router.replace("/login");
  } catch (error) {
    const toast = await toastController.create({
      message: "Chiqishda xatolik yuz berdi",
      duration: 2500,
      position: "top",
      color: "danger",
    });
    await toast.present();
  }
};

const handleCheckUpdate = async () => {
  const toast = await toastController.create({
    message: "Checking for updates...",
    duration: 1500,
    position: "top",
  });
  await toast.present();

  try {
    const hasUpdate = await checkForUpdate();

    if (hasUpdate) {
      const alert = await alertController.create({
        header: "Update Available",
        message: `A new version (${availableVersion.value}) is available. Current version: ${currentVersion.value}`,
        buttons: [
          {
            text: "Later",
            role: "cancel",
          },
          {
            text: "Update Now",
            handler: async () => {
              const updated = await performImmediateUpdate();
              if (!updated) {
                await openAppStore();
              }
            },
          },
        ],
      });
      await alert.present();
    } else {
      const successToast = await toastController.create({
        message: "You're running the latest version!",
        duration: 2500,
        position: "top",
        color: "success",
      });
      await successToast.present();
    }
  } catch (error) {
    const errorToast = await toastController.create({
      message: "Failed to check for updates",
      duration: 2500,
      position: "top",
      color: "danger",
    });
    await errorToast.present();
  }
};
</script>

<style scoped>
.modal-content {
  --background: #ffffff;
}

.logout-modal {
  padding: 2rem;
  text-align: center;
}

.tariff-modal {
  padding: 1.5rem;
}

.modal-header {
  margin-bottom: 2rem;
  text-align: center;
}

.modal-icon {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000000;
  margin: 0 0 0.5rem 0;
}

.modal-header p {
  color: #3d3d3d;
  margin: 0;
  font-size: 0.9rem;
}

.tariff-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tariff-card {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.2s ease;
}

.tariff-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.tariff-card.popular {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
}

.popular-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.tariff-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.tariff-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin: 0.5rem 0;
}

.price span {
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
}

.tests-count {
  font-size: 1rem;
  color: #374151;
  margin: 0.25rem 0;
  font-weight: 500;
}

.savings {
  font-size: 0.85rem;
  color: #059669;
  margin: 0.25rem 0;
  font-weight: 500;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.features li {
  padding: 0.5rem 0;
  color: #374151;
  font-size: 0.9rem;
  border-bottom: 1px solid #f3f4f6;
}

.features li:last-child {
  border-bottom: none;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.logout-btn {
  --background: #ef4444;
  --background-hover: #dc2626;
}

/* Responsive design */
@media (min-width: 768px) {
  .tariff-options {
    flex-direction: row;
    align-items: stretch;
  }

  .tariff-card {
    flex: 1;
  }

  .tariff-modal {
    padding: 2rem;
  }
}
</style>
