import { ref, type Ref } from "vue";
import { Capacitor } from "@capacitor/core";
import {
  AppUpdate,
  AppUpdateAvailability,
} from "@capawesome/capacitor-app-update";

const updateAvailable: Ref<boolean> = ref(false);
const currentVersion: Ref<string> = ref("");
const availableVersion: Ref<string> = ref("");

export function useAppUpdate() {
  const getCurrentAppVersion = async (): Promise<string | number | null> => {
    try {
      const result = await AppUpdate.getAppUpdateInfo();
      if (Capacitor.getPlatform() === "android") {
        currentVersion.value = result.currentVersionCode ?? "";
        return result.currentVersionCode ?? null;
      } else {
        currentVersion.value = result.currentVersionName ?? "";
        return result.currentVersionName ?? null;
      }
    } catch (error) {
      console.error("Error getting current app version:", error);
      return null;
    }
  };

  const getAvailableAppVersion = async (): Promise<string | number | null> => {
    try {
      const result = await AppUpdate.getAppUpdateInfo();
      if (Capacitor.getPlatform() === "android") {
        availableVersion.value = result.availableVersionCode ?? "";
        return result.availableVersionCode ?? null;
      } else {
        availableVersion.value = result.availableVersionName ?? "";
        return result.availableVersionName ?? null;
      }
    } catch (error) {
      console.error("Error getting available app version:", error);
      return null;
    }
  };

  const checkForUpdate = async (): Promise<boolean> => {
    try {
      // Only check on mobile platforms
      if (Capacitor.getPlatform() === "web") {
        return false;
      }

      const result = await AppUpdate.getAppUpdateInfo();
      updateAvailable.value =
        result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE;

      await getCurrentAppVersion();
      await getAvailableAppVersion();

      return updateAvailable.value;
    } catch (error) {
      console.error("Error checking for update:", error);
      return false;
    }
  };

  const openAppStore = async (): Promise<void> => {
    try {
      await AppUpdate.openAppStore();
    } catch (error) {
      console.error("Error opening app store:", error);
    }
  };

  const performImmediateUpdate = async (): Promise<boolean> => {
    try {
      const result = await AppUpdate.getAppUpdateInfo();
      if (
        result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE
      ) {
        return false;
      }
      if (result.immediateUpdateAllowed) {
        await AppUpdate.performImmediateUpdate();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error performing immediate update:", error);
      return false;
    }
  };

  const startFlexibleUpdate = async (): Promise<boolean> => {
    try {
      const result = await AppUpdate.getAppUpdateInfo();
      if (
        result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE
      ) {
        return false;
      }
      if (result.flexibleUpdateAllowed) {
        await AppUpdate.startFlexibleUpdate();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error starting flexible update:", error);
      return false;
    }
  };

  const completeFlexibleUpdate = async (): Promise<void> => {
    try {
      await AppUpdate.completeFlexibleUpdate();
    } catch (error) {
      console.error("Error completing flexible update:", error);
    }
  };

  return {
    updateAvailable,
    currentVersion,
    availableVersion,
    getCurrentAppVersion,
    getAvailableAppVersion,
    checkForUpdate,
    openAppStore,
    performImmediateUpdate,
    startFlexibleUpdate,
    completeFlexibleUpdate,
  };
}
