<template>
  <ion-app>
    <ion-router-outlet></ion-router-outlet>

    <!-- Update Available Alert -->
    <ion-alert
      :is-open="showUpdateAlert"
      header="Update Available"
      :message="`A new version (${availableVersion}) is available. Current version: ${currentVersion}`"
      :buttons="updateAlertButtons"
      @didDismiss="showUpdateAlert = false"
    ></ion-alert>
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { IonApp, IonRouterOutlet, IonAlert } from "@ionic/vue";
import { useAppUpdate } from "@/composables/useAppUpdate";

const {
  updateAvailable,
  currentVersion,
  availableVersion,
  checkForUpdate,
  openAppStore,
  performImmediateUpdate,
} = useAppUpdate();

const showUpdateAlert = ref(false);

const updateAlertButtons = [
  {
    text: "Later",
    role: "cancel",
  },
  {
    text: "Update Now",
    handler: async () => {
      // Try immediate update first (Android)
      const updated = await performImmediateUpdate();
      if (!updated) {
        // Fallback to opening app store
        await openAppStore();
      }
    },
  },
];

onMounted(async () => {
  // Check for updates on app start
  const hasUpdate = await checkForUpdate();
  if (hasUpdate) {
    showUpdateAlert.value = true;
  }
});
</script>
