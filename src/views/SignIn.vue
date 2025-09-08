<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <ion-title>SpeakUp</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" scroll-y="true">
      <img src="@/assets/bg.svg" class="w-[250px] sm:w-[300px] mx-auto" />

      <ion-list class="bg-transparent ion-margin-bottom">
        <ion-text color="light" class="ion-text-left ion-margin-bottom">
          <h1>Kirish</h1>
        </ion-text>
        <ion-text
          color="light"
          class="ion-text-left text-gray-300 ion-margin-bottom"
        >
          <p>Tizimga kirish uchun kodni kiriting.</p>
        </ion-text>
      </ion-list>

      <div class="mx-auto flex items-center space-x-2 justify-center">
        <ion-input-otp
          v-model="otp"
          @ionComplete="handleOnComplete"
          @ionChange="handleOnChange"
          length="6"
          shape="round"
          fill="solid"
        >
        </ion-input-otp>
      </div>

      <ion-button
        @click="verifyOTP"
        class="ion-margin-top mb-5"
        mode="ios"
        expand="block"
        color="primary"
        shape="round"
        :disabled="apiLoading || loading"
      >
        <svg
          v-if="apiLoading || loading"
          class="h-6 w-6 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24"
        >
          <path
            fill="currentColor"
            d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8s3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10"
          />
        </svg>
        <span v-if="!(apiLoading || loading)">Kodni tasdiqlash</span>
      </ion-button>

      <div class="ion-text-center ion-margin-top">
        <a
          href="https://t.me/speakmultiappBot"
          target="_blank"
          class="telegram-link"
        >
          KIRISH KODINI OLISH
        </a>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { toastController } from "@ionic/vue";
import { useRouter } from "vue-router";
import { App } from "@capacitor/app";
import { StatusBar } from "@capacitor/status-bar";
import endpoints, { apiLoading } from "@/utils/apiEndpoints";
import { useUser } from "@/composables/useUser";

const router = useRouter();
const { setUser, loadUser, isAuthenticated } = useUser();
const loading = ref(false);
const otp = ref("");

const appInfo = ref({
  name: "Speak Up",
  version: "1.0.7",
});

const handleOnComplete = (value) => {
  console.log("OTP completed: ", value);
};

const handleOnChange = (value) => {
  console.log("OTP changed: ", value);
};

const checkAppVersion = async () => {
  const { name, version } = await App.getInfo();
  appInfo.value.name = name;
  appInfo.value.version = version;
};

onMounted(async () => {
  StatusBar.setBackgroundColor({
    color: "#121212",
  });
  checkAppVersion();

  // Load user data from composable
  await loadUser();

  // Check if user is already authenticated
  if (isAuthenticated.value) {
    router.replace("/home", "forward");
  }
});

async function verifyOTP() {
  if (otp.value.length !== 6) {
    showToast("Please enter a complete 6-digit OTP");
    return;
  }

  loading.value = true;
  try {
    // Use our API utility to verify OTP
    const response = await endpoints.auth.login({ otp_code: otp.value });
    console.log("Login response:", response);

    // Validate response structure
    if (!response || (!response.user && !response.id)) {
      throw new Error("Invalid response from server");
    }

    // Update user with the complete server response
    await setUser(response);

    console.log("User authentication successful, navigating to home...");
    // Navigate based on whether the user has completed their profile
    router.push("/home");
  } catch (error) {
    console.error("Login error:", error);
    showToast(
      error.message || "Login failed. Please check your OTP and try again."
    );
  } finally {
    loading.value = false;
  }
}

async function showToast(message) {
  const toast = await toastController.create({
    message,
    duration: 5000,
    position: "top",
    mode: "ios",
    class: "custom-toast",
  });
  await toast.present();
}

function handleInput(event) {
  otp.value = event.target.value.slice(0, 6);
}
</script>

<style scoped>
ion-toolbar {
  --background: #121212;
}

ion-item {
  --background: #121212;
}

.telegram-link {
  color: #1e90ff;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.telegram-link:hover {
  text-decoration: underline;
}
</style>
