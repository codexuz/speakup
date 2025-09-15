<template>
  <ion-page>
    <ion-header>
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-back-button default-href="/report"></ion-back-button>
        </ion-buttons>
        <ion-title>Test Response</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div v-if="loading" class="flex justify-center items-center h-full">
        <ion-spinner name="circular"></ion-spinner>
      </div>

      <div v-else-if="error" class="p-4 text-center">
        <ion-icon
          :icon="alertCircleOutline"
          class="text-5xl text-red-500"
        ></ion-icon>
        <p class="text-lg font-medium mt-2">{{ error }}</p>
        <ion-button class="mt-4" @click="loadResponseData"
          >Try Again</ion-button
        >
      </div>

      <div v-else-if="response" class="p-4">
        <!-- Test Info Card -->
        <ion-card class="mb-4">
          <ion-card-header>
            <ion-card-subtitle>Test Information</ion-card-subtitle>
            <ion-card-title>{{
              response.SpeakingTest?.title || "Untitled Test"
            }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>
              {{
                response.SpeakingTest?.description || "No description available"
              }}
            </p>
            <div class="flex justify-between mt-3">
              <p class="text-sm text-gray-500">
                Completed on: {{ formatDateFromISOString(response.created_at) }}
              </p>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Assessment Card -->
        <ion-card class="mb-4">
          <ion-card-header>
            <ion-card-subtitle>AI Assessment</ion-card-subtitle>
            <div class="flex items-center justify-between">
              <ion-card-title class="flex items-center">
                <span
                  >Score:
                  {{
                    response.response?.assessment?.aiAssessment?.cefr_score ||
                    0
                  }}/100</span
                >
              </ion-card-title>
              <div class="flex items-center">
                <ion-badge color="primary" class="text-lg px-3 py-1">
                  {{
                    response.response?.assessment?.aiAssessment?.cefr_level ||
                    "N/A"
                  }}
                </ion-badge>
                <ion-icon
                  :icon="informationCircleOutline"
                  class="ml-1 text-gray-500"
                  @click="showCefrInfo"
                ></ion-icon>
              </div>
            </div>
          </ion-card-header>
          <ion-card-content>
            <!-- Score Breakdown -->
            <div class="mb-6">
              <h3 class="font-medium mb-3 text-lg">Score Breakdown</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="score-item">
                  <div class="flex justify-between mb-1">
                    <span class="font-medium">Fluency</span>
                    <span
                      >{{
                        response.response?.assessment?.aiAssessment?.fluency ||
                        0
                      }}/100</span
                    >
                  </div>
                  <ion-progress-bar
                    :value="
                      (response.response?.assessment?.aiAssessment?.fluency ||
                        0) / 100
                    "
                    color="success"
                  ></ion-progress-bar>
                </div>
                <div class="score-item">
                  <div class="flex justify-between mb-1">
                    <span class="font-medium">Grammar</span>
                    <span
                      >{{
                        response.response?.assessment?.aiAssessment?.grammar ||
                        0
                      }}/100</span
                    >
                  </div>
                  <ion-progress-bar
                    :value="
                      (response.response?.assessment?.aiAssessment?.grammar ||
                        0) / 100
                    "
                    color="tertiary"
                  ></ion-progress-bar>
                </div>
                <div class="score-item">
                  <div class="flex justify-between mb-1">
                    <span class="font-medium">Vocabulary</span>
                    <span
                      >{{
                        response.response?.assessment?.aiAssessment
                          ?.vocabulary || 0
                      }}/100</span
                    >
                  </div>
                  <ion-progress-bar
                    :value="
                      (response.response?.assessment?.aiAssessment
                        ?.vocabulary || 0) / 100
                    "
                    color="warning"
                  ></ion-progress-bar>
                </div>
                <div class="score-item">
                  <div class="flex justify-between mb-1">
                    <span class="font-medium">Pronunciation</span>
                    <span
                      >{{
                        response.response?.assessment?.aiAssessment
                          ?.pronunciation || 0
                      }}/100</span
                    >
                  </div>
                  <ion-progress-bar
                    :value="
                      (response.response?.assessment?.aiAssessment
                        ?.pronunciation || 0) / 100
                    "
                    color="primary"
                  ></ion-progress-bar>
                </div>
              </div>
            </div>

            <!-- Feedback Section -->
            <div class="mb-6">
              <h3 class="font-medium mb-3 text-lg">General Feedback</h3>
              <div class="bg-blue-600 p-4 rounded-lg shadow-inner">
                <p class="text-gray-50 leading-relaxed">
                  {{
                    response.response?.assessment?.aiAssessment?.feedback ||
                    "No feedback available"
                  }}
                </p>
              </div>
            </div>

            <!-- Detailed Feedback -->
            <div class="mb-4">
              <h3 class="font-medium mb-3 text-lg">Detailed Feedback</h3>
              <ion-list lines="full" class="rounded-lg shadow-sm">
                <ion-item>
                  <ion-icon
                    :icon="micOutline"
                    slot="start"
                    color="success"
                  ></ion-icon>
                  <ion-label>
                    <h2 class="font-medium">Fluency</h2>
                    <p class="text-sm">
                      {{
                        response.response?.assessment?.aiAssessment
                          ?.fluencyFeedback || "No feedback available"
                      }}
                    </p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-icon
                    :icon="bookOutline"
                    slot="start"
                    color="tertiary"
                  ></ion-icon>
                  <ion-label>
                    <h2 class="font-medium">Grammar</h2>
                    <p class="text-sm">
                      {{
                        response.response?.assessment?.aiAssessment
                          ?.grammarFeedback || "No feedback available"
                      }}
                    </p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-icon
                    :icon="textOutline"
                    slot="start"
                    color="warning"
                  ></ion-icon>
                  <ion-label>
                    <h2 class="font-medium">Vocabulary</h2>
                    <p class="text-sm">
                      {{
                        response.response?.assessment?.aiAssessment
                          ?.vocabularyFeedback || "No feedback available"
                      }}
                    </p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-icon
                    :icon="volumeHighOutline"
                    slot="start"
                    color="primary"
                  ></ion-icon>
                  <ion-label>
                    <h2 class="font-medium">Pronunciation</h2>
                    <p class="text-sm">
                      {{
                        response.response?.assessment?.aiAssessment
                          ?.pronunciationFeedback || "No feedback available"
                      }}
                    </p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Transcript Card -->
        <ion-card class="mb-4">
          <ion-card-header>
            <ion-card-subtitle>Your Response</ion-card-subtitle>
            <ion-card-title>Transcript</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div v-if="response.audio_url" class="mb-4">
              <h3 class="font-medium mb-2 text-lg">Audio Recording</h3>
              <div>
                <audio controls class="w-full">
                  <source :src="response.audio_url" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>

            <h3 class="font-medium mb-2 text-lg">Transcript Text</h3>
            <div
              class="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto"
            >
              <p class="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {{ response.transcript || "No transcript available" }}
              </p>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Vocabulary Analysis -->
        <ion-card v-if="response.response?.assessment?.vocabularyLevel">
          <ion-card-header>
            <ion-card-subtitle>Vocabulary Analysis</ion-card-subtitle>
            <ion-card-title class="flex items-center">
              Level:
              {{
                response.response?.assessment?.vocabularyLevel?.meta?.grade ||
                "N/A"
              }}
              <ion-badge
                class="ml-2"
                :color="
                  getColorForCefrLevel(
                    response.response?.assessment?.vocabularyLevel?.meta?.grade
                  )
                "
              >
                {{
                  response.response?.assessment?.vocabularyLevel?.meta?.words ||
                  0
                }}
                Words Used
              </ion-badge>
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="mb-6">
              <h3 class="font-medium mb-3 text-lg">CEFR Level Distribution</h3>
              <div
                v-if="
                  response.response?.assessment?.vocabularyLevel?.meta?.levels
                "
              >
                <div
                  v-for="(value, level) in response.response?.assessment
                    ?.vocabularyLevel?.meta?.levels"
                  :key="level"
                  class="mb-3"
                >
                  <div class="flex justify-between mb-1">
                    <span class="font-medium">{{ level }}</span>
                    <span>{{ Math.round(value) }}%</span>
                  </div>
                  <ion-progress-bar
                    :value="value / 100"
                    :color="getColorForLevel(level)"
                  ></ion-progress-bar>
                </div>
              </div>
            </div>

            <!-- Top Words -->
            <div>
              <h3 class="font-medium mb-3 text-lg">Most Used Words</h3>
              <div class="flex flex-wrap gap-2">
                <ion-chip
                  v-for="(word, index) in getTopWords(15)"
                  :key="index"
                  color="tertiary"
                >
                  {{ word[0] }}
                  <ion-badge color="light">{{ word[1] }}</ion-badge>
                </ion-chip>
              </div>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  loadingController,
  toastController,
  alertController,
} from "@ionic/vue";
import {
  alertCircleOutline,
  informationCircleOutline,
  micOutline,
  bookOutline,
  textOutline,
  volumeHighOutline,
} from "ionicons/icons";
import { endpoints } from "@/utils/apiEndpoints";
import { changeStatusBar } from "@/lib/utils";

const route = useRoute();
const responseId = ref(route.params.id);
const response = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(() => {
  changeStatusBar("primary");
  loadResponseData();
});

async function loadResponseData() {
  loading.value = true;
  error.value = null;

  try {
    // Use the actual API endpoint to get the response by ID
    const result = await endpoints.speaking.getResponseById(responseId.value);

    if (result) {
      response.value = result;
    } else {
      error.value = "Could not find the response";
    }
  } catch (err) {
    console.error("Failed to load response details:", err);
    error.value = "Failed to load response details";
  } finally {
    loading.value = false;
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

function getColorForLevel(level) {
  const colors = {
    A1: "danger",
    A2: "warning",
    B1: "success",
    B2: "primary",
    C1: "tertiary",
    C2: "dark",
  };

  return colors[level] || "medium";
}

function getColorForCefrLevel(grade) {
  const colors = {
    A1: "danger",
    A2: "warning",
    B1: "success",
    B2: "primary",
    C1: "tertiary",
    C2: "dark",
  };

  return colors[grade] || "medium";
}

async function showCefrInfo() {
  const alert = await alertController.create({
    header: "CEFR Levels",
    subHeader: "Common European Framework of Reference",
    message:
      "A1-A2: Basic user\n" +
      "Independent>B1-B2: Independent user\n" +
      "C1-C2: Proficient user\n" +
      "Your score indicates your current level of English proficiency according to international standards.",
    buttons: ["OK"],
  });

  await alert.present();
}



function getTopWords(count) {
  if (!response.value?.response?.assessment?.vocabularyLevel?.words) {
    return [];
  }

  return response.value.response.assessment.vocabularyLevel.words.slice(
    0,
    count
  );
}
</script>

<style scoped>
ion-spinner {
  --spinner-color: #1c6dff;
}

ion-toolbar {
  --background: #070404;
  --color: white;
}

.score-item {
  margin-bottom: 1rem;
}

audio {
  border-radius: 8px;
  width: 100%;
  height: 40px;
}

ion-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

ion-card-header {
  padding-bottom: 8px;
}

ion-card-content {
  padding-top: 0;
}

ion-progress-bar {
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

ion-chip {
  --background: #f3f4f6;
  font-weight: 500;
}

.shadow-inner {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
</style>
