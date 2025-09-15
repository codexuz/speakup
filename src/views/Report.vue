<template>
  <ion-page>
    <ion-header>
      <ion-toolbar mode="ios">
        <ion-title> Natijam </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <template v-if="speakingResponses && speakingResponses.length > 0">
        <ion-list>
          <ion-item-sliding
            v-for="response in speakingResponses"
            :key="response.id"
          >
            <ion-item
              :router-link="`/response-detail/${response.id}`"
              router-direction="forward"
              detail
            >
              <ion-label>
                <h2 class="font-medium text-lg">
                  {{ response.SpeakingTest?.title || "Untitled Test" }}
                </h2>
                <p class="text-sm text-gray-500">
                  {{ response.SpeakingTest?.description || "No description" }}
                </p>
                <p class="text-xs mt-1">
                  {{ formatDateFromISOString(response.created_at) }}
                </p>
              </ion-label>
              <div slot="end" class="flex flex-col items-center">
                <ion-badge color="primary" class="mb-1">{{
                  response.response?.assessment?.aiAssessment?.cefr_level ||
                  "N/A"
                }}</ion-badge>
              </div>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option
                color="danger"
                @click="deleteResponse(response.id)"
              >
                <ion-icon :icon="trash" slot="icon-only"></ion-icon>
                Delete
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-list>
      </template>
      <template v-else>
        <div class="flex flex-col items-center justify-center h-full p-4">
          <ion-icon
            :icon="documentTextOutline"
            class="text-6xl text-gray-400 mb-4"
          ></ion-icon>
          <div class="text-center text-xl font-medium">{{ emptyMessage }}</div>
          <p class="text-center text-gray-500 mt-2">
            Your speaking test responses will appear here
          </p>
        </div>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { loadingController, toastController } from "@ionic/vue";
import { useUser } from "@/composables/useUser";
import { endpoints } from "@/utils/apiEndpoints";
import { trash, documentTextOutline } from "ionicons/icons";

const { user, loadUser } = useUser();
import { changeStatusBar } from "@/lib/utils";

const speakingResponses = ref([]);
const emptyMessage = ref("Loading...");

onMounted(async () => {
  changeStatusBar("primary");
  await loadUser();
  await fetchSpeakingResponses();
});

async function fetchSpeakingResponses() {
  const loading = await loadingController.create({
    message: "Yuklamoqda ...",
    cssClass: "loader",
    mode: "ios",
  });

  try {
    await loading.present();

    if (!user.value || !user.value.id) {
      emptyMessage.value = "Foydalanuvchi topilmadi";
      return;
    }

    // Fetch all speaking responses for the current user
    const response = await endpoints.speaking.getAllResponses(user.value.id);

    if (!response || response.length < 1) {
      emptyMessage.value = "Natijalar yo'q";
      speakingResponses.value = [];
    } else {
      speakingResponses.value = response;
      // Store response data in localStorage for the detail page to access
      localStorage.setItem("speaking-responses", JSON.stringify(response.data));
    }
  } catch (error) {
    console.error("Failed to fetch speaking responses:", error);
    emptyMessage.value = "Xatolik yuz berdi";
  } finally {
    loading.dismiss();
  }
}

async function deleteResponse(responseId) {
  const loading = await loadingController.create({
    message: "O'chirilmoqda...",
    cssClass: "loader",
    mode: "ios",
  });

  try {
    await loading.present();

    // Delete the response
    await endpoints.speaking.deleteResponse(responseId);

    // Remove from local list
    speakingResponses.value = speakingResponses.value.filter(
      (response) => response.id !== responseId
    );

    // Show success toast
    const toast = await toastController.create({
      message: "Muvaffaqiyatli o'chirildi",
      duration: 2000,
      position: "bottom",
      color: "success",
    });
    await toast.present();

    // Update empty message if necessary
    if (speakingResponses.value.length === 0) {
      emptyMessage.value = "Natijalar yo'q";
    }
  } catch (error) {
    console.error("Failed to delete speaking response:", error);

    // Show error toast
    const toast = await toastController.create({
      message: "Xatolik yuz berdi",
      duration: 2000,
      position: "bottom",
      color: "danger",
    });
    await toast.present();
  } finally {
    loading.dismiss();
  }
}

function formatDateFromISOString(isoString) {
  if (!isoString) return "Unknown date";

  const date = new Date(isoString);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  const day = date.getDate();
  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentyabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];
  const month = months[date.getMonth()];

  return `${hours}:${minutes}, ${day}-${month}`;
}
</script>

<style scoped>
ion-spinner {
  --spinner-color: #1c6dff;
}

ion-toolbar {
  --background: #070404;
}

ion-item {
  --background: transparent;
}
</style>
