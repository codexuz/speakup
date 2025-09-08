<template>
  <ion-page>
    <ion-header>
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-back-button default-href="/settings" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Profilni tahrirlash</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="profile-container pt-10">
        <!-- Form Section -->
        <div class="form-section mt-10">
          <form @submit.prevent="updateUserInfo" class="profile-form">
            <div class="form-group">
              <label class="form-label">Ism</label>
              <div class="input-container">
                <ion-icon :icon="person" class="input-icon"></ion-icon>
                <ion-input
                  v-model="userRef.firstName"
                  placeholder="Ismingizni kiriting"
                  class="custom-input"
                  required
                ></ion-input>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Username</label>
              <div class="input-container">
                <ion-icon :icon="atOutline" class="input-icon"></ion-icon>
                <ion-input
                  v-model="userRef.username"
                  placeholder="Username kiriting"
                  class="custom-input"
                  required
                ></ion-input>
              </div>
            </div>

            <ion-button
              type="submit"
              expand="block"
              color="primary"
              :disabled="isLoading"
            >
              <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
              <span v-else>Yangilash</span>
            </ion-button>
          </form>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { person, call, atOutline } from "ionicons/icons";
import { useUser } from "@/composables/useUser";
import { toastController } from "@ionic/vue";
import endpoints from "@/utils/apiEndpoints";

const { user, loadUser, updateUser } = useUser();
const isLoading = ref(false);

const userRef = ref({
  firstName: "",
  username: "",
});

async function showToast(message, color = "success") {
  const toast = await toastController.create({
    message,
    duration: 2500,
    position: "top",
    color,
  });
  await toast.present();
}

async function updateUserInfo() {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    const updateData = {
      first_name: userRef.value.firstName,
      username: userRef.value.username,
    };

    await updateUser(updateData);
    await endpoints.users.updateProfile(user.value.id, updateData);
    await showToast("Profil muvaffaqiyatli yangilandi!");
  } catch (error) {
    console.error("Error updating profile:", error);
    await showToast("Yangilashda xatolik yuz berdi", "danger");
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await loadUser();
  userRef.value.firstName = user.value?.first_name || "";
  userRef.value.username = user.value?.username || "";
  userRef.value.phone = user.value?.phone || "";
});
</script>

<style scoped>
.profile-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 20px;
  background: linear-gradient(135deg, #475569 0%, #334155 100%);
  border-radius: 20px;
  color: white;
  box-shadow: 0 8px 32px rgba(71, 85, 105, 0.15);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.profile-name {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 10px;
  color: white;
}

.account-status {
  margin-top: 15px;
}

.status-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin: 0;
}

.upgrade-link {
  color: #38bdf8;
  font-weight: 600;
  text-decoration: none;
}

.upgrade-link:hover {
  text-decoration: underline;
}

.form-section {
  background: var(--ion-color-step-50);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-medium);
  margin-bottom: 4px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--ion-color-step-100);
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.input-container:focus-within {
  border-color: var(--ion-color-primary);
  box-shadow: 0 0 0 3px rgba(var(--ion-color-primary-rgb), 0.1);
}

.input-icon {
  padding: 0 16px;
  color: var(--ion-color-medium);
  font-size: 20px;
}

.custom-input {
  --background: transparent;
  --color: var(--ion-color-step-850);
  --padding-start: 0;
  --padding-end: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  --border-radius: 12px;
  flex: 1;
}

.custom-input ion-input {
  --placeholder-color: var(--ion-color-medium);
}

.update-button {
  --background: linear-gradient(135deg, #475569 0%, #334155 100%);
  --color: white;
  --border-radius: 12px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  --box-shadow: 0 4px 16px rgba(71, 85, 105, 0.3);
  font-weight: 600;
  font-size: 16px;
  margin-top: 8px;
  transition: all 0.3s ease;
}

.update-button:hover:not([disabled]) {
  --box-shadow: 0 6px 20px rgba(71, 85, 105, 0.4);
  transform: translateY(-2px);
}

.update-button[disabled] {
  opacity: 0.6;
}

/* Dark theme adjustments */
@media (prefers-color-scheme: dark) {
  .form-section {
    background: var(--ion-color-step-100);
  }

  .input-container {
    background: var(--ion-color-step-150);
  }

  .custom-input {
    --color: var(--ion-color-step-50);
  }
}

/* Mobile responsiveness */
@media (max-width: 576px) {
  .profile-container {
    padding: 16px;
  }

  .profile-header {
    padding: 24px 16px;
    margin-bottom: 24px;
  }

  .form-section {
    padding: 20px;
  }

  .profile-name {
    font-size: 20px;
  }
}
</style>
