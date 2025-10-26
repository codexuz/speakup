<template>
  <ion-page>
    <ion-header>
      <ion-toolbar mode="ios">
        <ion-title> Reports </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" scroll-y="true">
      <ion-refresher
        mode="ios"
        slot="fixed"
        @ionRefresh="refreshPage($event, true)"
      >
        <ion-refresher-content
          refreshing-spinner="lines"
        ></ion-refresher-content>
      </ion-refresher>

      <template v-if="speakingResponses && speakingResponses.length > 0">
        <ion-grid>
          <ion-row>
            <ion-col size="12" size-md="8" size-lg="8" class="mx-auto">
              <!-- Reports Cards Grid -->
              <div class="reports-grid">
                <div 
                  v-for="(response, index) in speakingResponses" 
                  :key="response.id"
                  class="report-card-item"
                  @click="navigateToReport(response.id)"
                >
                  <ion-card class="report-card shadow-none h-full cursor-pointer">
                    <ion-card-content class="p-4">
                      <div class="flex items-start justify-between mb-3">
                        <div class="report-badge">
                          <span class="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {{ response.response?.assessment?.aiAssessment?.cefr_level || "N/A" }}
                          </span>
                        </div>
                        <div class="report-actions">
                          <button 
                            @click.stop="deleteResponse(response.id)"
                            class="text-red-500 hover:text-red-700 p-1"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <h3 class="text-base font-medium text-gray-900 mb-2 line-clamp-3">
                        {{ response.SpeakingTest?.title || "Untitled Test" }}
                      </h3>
                      
                      <p class="text-sm text-gray-500 mb-3 line-clamp-2">
                        {{ response.SpeakingTest?.description || "No description available" }}
                      </p>
                      
                      <div class="flex items-center justify-between text-sm text-gray-500">
                        <span class="flex items-center">
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {{ formatDateFromISOString(response.created_at) }}
                        </span>
                        <span class="text-blue-600 font-medium">
                          {{ response.response?.assessment?.aiAssessment?.cefr_score || 0 }}/100 →
                        </span>
                      </div>
                    </ion-card-content>
                  </ion-card>
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </template>
      <template v-else>
        <div class="flex flex-col items-center justify-center h-full p-4">
          <ion-icon
            :icon="documentTextOutline"
            class="text-6xl text-gray-400 mb-4"
          ></ion-icon>
          <div class="text-center text-xl font-medium">{{ emptyMessage }}</div>
          <p class="text-center text-sm text-gray-500 mt-2">
            Your speaking test responses <br/>will appear here
          </p>
        </div>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { loadingController, toastController } from "@ionic/vue";
import { useRouter } from "vue-router";
import { useUser } from "@/composables/useUser";
import { endpoints } from "@/utils/apiEndpoints";
import { trash, documentTextOutline, timeOutline, eyeOutline } from "ionicons/icons";

const router = useRouter();
const { user, loadUser } = useUser();

const speakingResponses = ref([]);
const emptyMessage = ref("Loading...");

onMounted(async () => {
  await loadUser();
  await fetchSpeakingResponses();
});


async function refreshPage(event) {
  setTimeout(async () => {
    await fetchSpeakingResponses();
    event.target.complete();
  }, 2000);
}


async function fetchSpeakingResponses() {
  const loading = await loadingController.create({
    message: "Loading...",
    cssClass: "loader",
    mode: "ios",
  });

  try {
    await loading.present();

    if (!user.value || !user.value.id) {
      emptyMessage.value = "No results found";
      return;
    }

    // Fetch all speaking responses for the current user
    const response = await endpoints.speaking.getAllResponses(user.value.id);

    if (!response || response.length < 1) {
      emptyMessage.value = "No results found";
      speakingResponses.value = [];
    } else {
      speakingResponses.value = response;
      // Store response data in localStorage for the detail page to access
      localStorage.setItem("speaking-responses", JSON.stringify(response.data));
    }
  } catch (error) {
    console.error("Failed to fetch speaking responses:", error);
    emptyMessage.value = "Error occurred while fetching";
  } finally {
    loading.dismiss();
  }
}

async function deleteResponse(responseId) {
  const loading = await loadingController.create({
    message: "Deleting...",
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
      message: "Successfully deleted",
      duration: 2000,
      position: "bottom",
      color: "success",
    });
    await toast.present();

    // Update empty message if necessary
    if (speakingResponses.value.length === 0) {
      emptyMessage.value = "No results found";
    }
  } catch (error) {
    console.error("Failed to delete speaking response:", error);

    // Show error toast
    const toast = await toastController.create({
      message: "Error occurred while deleting",
      duration: 2000,
      position: "bottom",
      color: "danger",
    });
    await toast.present();
  } finally {
    loading.dismiss();
  }
}

function navigateToReport(responseId) {
  router.push(`/reports/${responseId}`);
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
/* Responsive Reports Grid - Same as part-1.1 style */
.reports-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr; /* 1 column on small screens */
}

/* Medium screens: 3 columns */
@media (min-width: 768px) {
  .reports-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large screens: 4 columns */
@media (min-width: 1024px) {
  .reports-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.report-card-item {
  height: 100%;
}

.report-card {
  --background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin: 0;
}

.report-card:hover {
  transform: translateY(-4px);
  border-color: #3b82f6;
}

.report-card ion-card-content {
  padding: 1rem;
}

.cursor-pointer {
  cursor: pointer;
}

.h-full {
  height: 100%;
}

.shadow-none {
  box-shadow: none;
}

/* Text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Flexbox utilities */
.flex {
  display: flex;
}

.items-start {
  align-items: flex-start;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

/* Spacing utilities */
.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mr-1 {
  margin-right: 0.25rem;
}

.mt-8 {
  margin-top: 2rem;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.p-1 {
  padding: 0.25rem;
}

.p-4 {
  padding: 1rem;
}

/* Typography */
.text-sm {
  font-size: 0.875rem;
}

.text-base {
  font-size: 1rem;
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

/* Colors */
.text-blue-600 {
  color: #2563eb;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-900 {
  color: #111827;
}

.text-red-500 {
  color: #ef4444;
}

.bg-blue-100 {
  background-color: #dbeafe;
}

/* Hover states */
.hover\:text-red-700:hover {
  color: #b91c1c;
}

/* Border radius */
.rounded-full {
  border-radius: 9999px;
}

/* Width/Height */
.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}

.w-5 {
  width: 1.25rem;
}

.h-5 {
  height: 1.25rem;
}

/* Auto margin for centering */
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

/* Empty State - existing styles */
.flex-col {
  flex-direction: column;
}

.justify-center {
  justify-content: center;
}

.text-6xl {
  font-size: 3.75rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-center {
  text-align: center;
}

.mt-2 {
  margin-top: 0.5rem;
}

/* Loading spinner */
ion-spinner {
  --spinner-color: #1c6dff;
}

ion-item {
  --background: transparent;
}
</style>
