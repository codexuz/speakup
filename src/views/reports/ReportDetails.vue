<template>
  <ion-page>
    <!-- Header -->
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/reports"></ion-back-button>
        </ion-buttons>
        <ion-title>Speaking Assessment</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row
          class="ion-margin-top items-center justify-center mx-auto gap-x-4 gap-y-2"
        >
          <ion-col size="12" size-md="6" size-lg="6" size-sm="12">
            <!-- Error State -->
            <div
              v-if="!loading && error"
              class="flex flex-col items-center justify-center min-h-[60vh] px-4"
            >
              <ion-icon
                :icon="alertCircleOutline"
                class="text-red-500 text-6xl mb-4"
              ></ion-icon>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">
                Oops! Something went wrong
              </h2>
              <p class="text-gray-600 text-center mb-6">{{ error }}</p>
              <ion-button @click="loadResponseData" color="primary">
                <ion-icon slot="start" :icon="refreshOutline"></ion-icon>
                Try Again
              </ion-button>
              <ion-button
                @click="$router.push('/reports')"
                fill="clear"
                color="medium"
                class="mt-2"
              >
                Back to Reports
              </ion-button>
            </div>

            <!-- No Data State -->
            <div
              v-if="!loading && !error && !response"
              class="flex flex-col items-center justify-center min-h-[60vh] px-4"
            >
              <ion-icon
                :icon="documentOutline"
                class="text-gray-400 text-6xl mb-4"
              ></ion-icon>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">
                No Data Available
              </h2>
              <p class="text-gray-600 text-center mb-6">
                We couldn't find any assessment data for this report.
              </p>
              <ion-button @click="$router.push('/reports')" color="primary">
                Back to Reports
              </ion-button>
            </div>

            <!-- Loading State -->
            <section v-if="loading" class="mt-6">
              <ion-skeleton-text
                :animated="true"
                class="mb-4 rounded-xl w-48 h-8"
              ></ion-skeleton-text>
              <ion-skeleton-text
                :animated="true"
                class="mb-6 rounded-xl w-full h-[200px]"
              ></ion-skeleton-text>
              <ion-skeleton-text
                :animated="true"
                class="mb-6 rounded-xl w-full h-[200px]"
              ></ion-skeleton-text>
              <ion-skeleton-text
                :animated="true"
                class="mb-6 rounded-xl w-full h-[200px]"
              ></ion-skeleton-text>
              <ion-skeleton-text
                :animated="true"
                class="mb-6 rounded-xl w-full h-[200px]"
              ></ion-skeleton-text>
            </section>

            <!-- Main Content -->
            <section v-if="!loading && !error && response" class="mt-6">
              <div class="mx-4 flex items-center gap-x-6">
                <span
                  ><b>Spoken Words: {{ totalWords }}</b></span
                >
              </div>

              <div class="mt-4">
                <LevelGauge :score="score.toString()" :level="currentLevel" />
              </div>

              <ion-skeleton-text
                v-if="loading"
                :animated="true"
                class="mb-6 rounded-xl w-full h-[200px]"
              ></ion-skeleton-text>
              <ion-skeleton-text
                v-if="loading"
                :animated="true"
                class="mb-6 rounded-xl w-full h-[200px]"
              ></ion-skeleton-text>

              <ion-card mode="md" class="rounded-xl">
                <ion-card-content>
                  <ion-card-subtitle>
                    <span class="text-slate-900 poppins-bold text-lg block"
                      >Feedback</span
                    >
                    <span v-if="earnedLevelDescript">{{
                      earnedLevelDescript
                    }}</span>
                    <span v-else class="text-gray-500 italic"
                      >No feedback available yet</span
                    >
                  </ion-card-subtitle>
                </ion-card-content>
              </ion-card>

              <ion-card class="rounded-xl">
                <ion-card-content class="p-5">
                  <ion-list>
                    <ion-card-title class="text-lg"
                      >Speaking Rate (Words Per Minute)</ion-card-title
                    >
                    <ion-item lines="none">
                      <button class="flex items-center gap-x-3">
                        <svg
                          class="bg-blue-600 p-1 rounded-full text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M10.45 15.5q.6.6 1.55.588t1.4-.688L19 7l-8.4 5.6q-.675.45-.712 1.375t.562 1.525M12 4q1.475 0 2.838.412T17.4 5.65l-1.9 1.2q-.825-.425-1.712-.637T12 6Q8.675 6 6.337 8.338T4 14q0 1.05.288 2.075T5.1 18h13.8q.575-.95.838-1.975T20 13.9q0-.9-.213-1.75t-.637-1.65l1.2-1.9q.75 1.175 1.188 2.5T22 13.85t-.325 2.725t-1.025 2.475q-.275.45-.75.7t-1 .25H5.1q-.525 0-1-.25t-.75-.7q-.65-1.125-1-2.387T2 14q0-2.075.788-3.887t2.15-3.175t3.187-2.15T12 4m.175 7.825"
                          />
                        </svg>
                        My speech rate:
                      </button>

                      <ion-label>
                        <span class="px-3 text-3xl"
                          >{{ transcriptionDetails?.speaking_rate || 0 }}
                        </span>
                      </ion-label>
                    </ion-item>
                  </ion-list>
                  <div class="flex items-center gap-x-3 px-5 pt-4">
                    <p>
                      Common speaking rate for native speakers in the US
                      <span class="text-3xl font-medium text-gray-700 px-1"
                        >90-150</span
                      >
                    </p>
                  </div>

                  <RangeSlider
                    :level="Number(transcriptionDetails?.speaking_rate || 0)"
                  />
                </ion-card-content>
              </ion-card>

              <ion-list
                lines="none"
                class="p-5 mb-8 mx-3 rounded-xl"
                v-if="hasVocabularyData"
              >
                <ion-list-header>
                  <ion-label class="p-3">Vocabulary By Level</ion-label>
                </ion-list-header>
                <ion-item>
                  <ion-badge class="p-2" color="danger"
                    >{{ levelA1 }}%</ion-badge
                  >
                  <ion-label class="mx-3">- Beginner (A1)</ion-label>
                </ion-item>
                <ion-item>
                  <ion-badge class="p-2" color="warning"
                    >{{ levelA2 }}%</ion-badge
                  >
                  <ion-label class="mx-3">- Elementary (A2)</ion-label>
                </ion-item>
                <ion-item>
                  <ion-badge class="p-2" color="light"
                    >{{ levelB1 }}%</ion-badge
                  >
                  <ion-label class="mx-3">- Intermediate (B1)</ion-label>
                </ion-item>
                <ion-item>
                  <ion-badge class="p-2" color="success"
                    >{{ levelB2 }}%</ion-badge
                  >
                  <ion-label class="mx-3">- Upper-intermediate (B2)</ion-label>
                </ion-item>
                <ion-item>
                  <ion-badge class="p-2" color="secondary"
                    >{{ levelC1 }}%</ion-badge
                  >
                  <ion-label class="mx-3">- Advanced (C1)</ion-label>
                </ion-item>
                <ion-item>
                  <ion-badge class="p-2" color="dark">{{ levelC2 }}%</ion-badge>
                  <ion-label class="mx-3">- Proficiency (C2)</ion-label>
                </ion-item>
              </ion-list>

              <!-- No Vocabulary Data Message -->
              <ion-card class="rounded-xl" v-if="!hasVocabularyData">
                <ion-card-content class="text-center py-8">
                  <ion-icon
                    :icon="libraryOutline"
                    class="text-gray-400 text-5xl mb-3"
                  ></ion-icon>
                  <p class="text-gray-600">
                    Vocabulary analysis is not available for this assessment
                    yet.
                  </p>
                </ion-card-content>
              </ion-card>

              <!-- Transcription Details -->
              <ion-card class="rounded-xl" v-if="transcriptionDetails">
                <ion-card-content>
                  <ion-card-title class="text-gray-800 mb-3"
                    >Fluency Details</ion-card-title
                  >
                  <ion-list>
                    <ion-item>
                      <ion-icon
                        :icon="timeOutline"
                        slot="start"
                        class="text-blue-600"
                      ></ion-icon>
                      <ion-label slot="start">Total Duration</ion-label>
                      <ion-label slot="end">{{
                        formatDuration(transcriptionDetails.total_duration)
                      }}</ion-label>
                    </ion-item>
                    <ion-item>
                      <ion-icon
                        :icon="textSharp"
                        slot="start"
                        class="text-green-600 mr-1"
                      ></ion-icon>
                      <ion-label slot="start">Word Count</ion-label>
                      <ion-label slot="end">{{
                        transcriptionDetails.word_count
                      }}</ion-label>
                    </ion-item>
                    <ion-item>
                      <ion-icon
                        :icon="speedometerOutline"
                        slot="start"
                        class="text-purple-600 mr-1"
                      ></ion-icon>
                      <ion-label slot="start">Speaking Rate</ion-label>
                      <ion-label slot="end"
                        >{{ transcriptionDetails.speaking_rate }} WPM</ion-label
                      >
                    </ion-item>
                    <ion-item>
                      <ion-icon
                        :icon="flashOutline"
                        slot="start"
                        class="text-orange-600"
                      ></ion-icon>
                      <ion-label slot="start">Filler Words</ion-label>
                      <ion-label slot="end">{{
                        transcriptionDetails.filler_word_count
                      }}</ion-label>
                    </ion-item>
                    <ion-item v-if="pauseAnalysis && pauseAnalysis.pause_count">
                      <ion-icon
                        :icon="pauseCircleOutline"
                        slot="start"
                        class="text-red-600"
                      ></ion-icon>
                      <ion-label slot="start">Pauses</ion-label>
                      <ion-label slot="end">{{
                        pauseAnalysis.pause_count || 0
                      }}</ion-label>
                    </ion-item>
                    <ion-item
                      v-if="
                        pauseAnalysis && pauseAnalysis.average_pause_duration
                      "
                    >
                      <ion-icon
                        :icon="timerOutline"
                        slot="start"
                        class="text-yellow-600"
                      ></ion-icon>
                      <ion-label slot="start">Average Pause</ion-label>
                      <ion-label slot="end"
                        >{{
                          (pauseAnalysis.average_pause_duration || 0).toFixed(
                            2
                          )
                        }}s</ion-label
                      >
                    </ion-item>
                    <ion-item
                      v-if="pauseAnalysis && pauseAnalysis.longest_pause"
                    >
                      <ion-icon
                        :icon="hourglass"
                        slot="start"
                        class="text-pink-600"
                      ></ion-icon>
                      <ion-label slot="start">Longest Pause</ion-label>
                      <ion-label slot="end"
                        >{{
                          (pauseAnalysis.longest_pause || 0).toFixed(2)
                        }}s</ion-label
                      >
                    </ion-item>
                    <ion-item>
                      <ion-icon
                        :icon="checkmarkCircleOutline"
                        slot="start"
                        class="text-teal-600"
                      ></ion-icon>
                      <ion-label slot="start">Confidence</ion-label>
                      <ion-label slot="end"
                        >{{
                          (
                            (transcriptionDetails.confidence_score || 0) * 100
                          ).toFixed(1)
                        }}%</ion-label
                      >
                    </ion-item>
                  </ion-list>
                </ion-card-content>
              </ion-card>

              <!-- Audio Recording -->
              <div
                style="max-width: 100%"
                class="bg-white py-2 px-3 rounded-xl overflow-hidden"
                v-if="audioUrl && isAudioValid"
              >
                <audio
                  :src="audioUrl"
                  controls
                  class="w-full"
                  crossorigin="anonymous"
                ></audio>
              </div>

              <!-- Audio Error Message -->
              <ion-card
                class="rounded-xl"
                v-if="audioUrl && !isAudioValid && audioLoadError"
              >
                <ion-card-content class="text-center py-8">
                  <ion-icon
                    :icon="alertCircleOutline"
                    class="text-red-500 text-5xl mb-3"
                  ></ion-icon>
                  <h3 class="text-lg font-semibold text-gray-800 mb-2">
                    Audio Unavailable
                  </h3>
                  <p class="text-gray-600">{{ audioLoadError }}</p>
                  <p class="text-sm text-gray-500 mt-2">
                    The audio file may be corrupted or no longer available.
                  </p>
                </ion-card-content>
              </ion-card>

              <!-- Transcript -->
              <ion-card class="rounded-xl" v-if="transcript">
                <ion-card-content>
                  <ion-card-title
                    class="text-gray-800 flex items-center gap-1 mb-3"
                  >
                    <ion-icon :icon="documentTextOutline"></ion-icon>
                    Your Response
                  </ion-card-title>
                  <p class="text-slate-800 leading-relaxed whitespace-pre-line">
                    {{ transcript }}
                  </p>
                </ion-card-content>
              </ion-card>

              <!-- Questions Asked -->
              <ion-card
                class="rounded-xl"
                v-if="testQuestions && Object.keys(testQuestions).length > 0"
              >
                <ion-card-content>
                  <ion-card-title
                    class="text-gray-800 flex items-center mb-3 gap-2"
                  >
                    Questions Asked
                  </ion-card-title>
                  <div
                    v-for="(questions, part) in testQuestions"
                    :key="part"
                    class="mb-4"
                  >
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">
                      Part {{ part }}
                    </h3>
                    <ul class="list-disc pl-5 space-y-2">
                      <li
                        v-for="(question, index) in questions"
                        :key="index"
                        class="text-gray-700"
                      >
                        {{ question }}
                      </li>
                    </ul>
                  </div>
                </ion-card-content>
              </ion-card>
            </section>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  ref,
  useTemplateRef,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
} from "vue";
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
  refreshOutline,
  documentTextOutline,
  statsChartOutline,
  chatbubbleEllipsesOutline,
  playOutline,
  pauseOutline,
  documentOutline,
  informationOutline,
  chatbubblesOutline,
  speedometerOutline,
  libraryOutline,
  helpCircleOutline,
  analyticsOutline,
  timeOutline,
  textSharp,
  flashOutline,
  pauseCircleOutline,
  timerOutline,
  hourglass,
  checkmarkCircleOutline,
} from "ionicons/icons";
import { endpoints } from "@/utils/apiEndpoints";
import LevelGauge from "@/components/LevelGauge.vue";
import RangeSlider from "@/components/RangeSlider.vue";

const route = useRoute();
const responseId = ref(route.params.id);
const response = ref(null);
const loading = ref(true);
const error = ref(null);
const isAudioValid = ref(false);
const audioLoadError = ref(null);

async function loadResponseData() {
  loading.value = true;
  error.value = null;

  try {
    // Use the actual API endpoint to get the response by ID
    const result = await endpoints.speaking.getResponseById(responseId.value);

    if (result) {
      response.value = result;

      // Check if audio URL is valid and playable
      if (audioUrl.value) {
        await checkAudioValidity();
      }
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

async function checkAudioValidity() {
  isAudioValid.value = false;
  audioLoadError.value = null;

  try {
    const url = audioUrl.value;

    // First check if URL is a valid format
    if (!url || typeof url !== "string") {
      audioLoadError.value = "Invalid audio URL";
      return;
    }

    // Create a test audio element to check if the file is playable
    const audio = new Audio();

    // Set crossOrigin to handle CORS
    audio.crossOrigin = "anonymous";

    // Set up promise to handle load/error events
    const checkPlayable = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Audio load timeout"));
      }, 10000); // 10 second timeout

      audio.addEventListener(
        "canplaythrough",
        () => {
          clearTimeout(timeout);
          resolve(true);
        },
        { once: true }
      );

      audio.addEventListener(
        "error",
        (e) => {
          clearTimeout(timeout);
          reject(
            new Error(
              `Audio load error: ${audio.error?.message || "Unknown error"}`
            )
          );
        },
        { once: true }
      );

      audio.addEventListener(
        "loadedmetadata",
        () => {
          // If we have metadata, it's likely valid
          if (audio.duration > 0) {
            clearTimeout(timeout);
            resolve(true);
          }
        },
        { once: true }
      );
    });

    // Set the audio source
    audio.src = url;
    audio.load();

    // Wait for the audio to be ready
    await checkPlayable;

    isAudioValid.value = true;
    console.log("Audio URL is valid and playable");
  } catch (err) {
    console.error("Audio validation failed:", err);
    audioLoadError.value = err.message || "Failed to load audio file";
    isAudioValid.value = false;
  }
}

function formatDateFromISOString(isoString) {
  if (!isoString) return "Unknown date";

  const date = new Date(isoString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
}

function getCefrColor(level) {
  const colors = {
    A1: "danger",
    A2: "warning",
    B1: "success",
    B2: "primary",
    C1: "secondary",
    C2: "tertiary",
  };
  return colors[level] || "medium";
}

function formatDuration(seconds) {
  if (!seconds) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Computed property for skills data
const skillsData = computed(() => {
  const assessment = response.value?.response?.assessment?.aiAssessment;
  if (!assessment) return [];

  return [
    {
      name: "Fluency & Coherence",
      score: assessment.fluency || 0,
      color: "primary",
      icon: chatbubblesOutline,
      feedback:
        assessment.fluencyFeedback ||
        "Your speech flow and logical organization of ideas.",
    },
    {
      name: "Pronunciation",
      score: assessment.pronunciation || 0,
      color: "success",
      icon: volumeHighOutline,
      feedback:
        assessment.pronunciationFeedback ||
        "Clarity and accuracy of sound production.",
    },
    {
      name: "Lexical Resource",
      score: assessment.vocabulary || 0,
      color: "tertiary",
      icon: libraryOutline,
      feedback:
        assessment.vocabularyFeedback ||
        "Range and accuracy of vocabulary usage.",
    },
    {
      name: "Grammar",
      score: assessment.grammar || 0,
      color: "warning",
      icon: textOutline,
      feedback:
        assessment.grammarFeedback ||
        "Grammatical range and accuracy in your responses.",
    },
  ];
});

async function showCefrInfo() {
  const alert = await alertController.create({
    header: "CEFR Levels Explained",
    subHeader: "Common European Framework of Reference for Languages",
    message: `
      <strong>A1 - Beginner:</strong> Can understand and use familiar everyday expressions<br><br>
      <strong>A2 - Elementary:</strong> Can communicate in simple and routine tasks<br><br>
      <strong>B1 - Intermediate:</strong> Can deal with most situations while travelling<br><br>
      <strong>B2 - Upper Intermediate:</strong> Can interact with native speakers with fluency<br><br>
      <strong>C1 - Advanced:</strong> Can use language flexibly and effectively<br><br>
      <strong>C2 - Proficient:</strong> Can understand virtually everything heard or read
    `,
    buttons: ["Close"],
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

// Computed properties for the new API response structure
const reportData = computed(() => ({
  title: response.value?.SpeakingTest?.title || "Speaking Test",
  sent_time: response.value?.created_at || new Date().toISOString(),
}));

const totalWords = computed(() => {
  return response.value?.response?.transcription_details?.word_count || 0;
});

const score = computed(() => {
  return response.value?.response?.assessment?.aiAssessment?.cefr_score || 0;
});

const currentLevel = computed(() => {
  return response.value?.response?.assessment?.aiAssessment?.cefr_level || "A1";
});

const earnedIELTS = computed(() => {
  const cefrLevel = currentLevel.value;
  const cefrToIELTS = {
    A1: "2.0-3.0",
    A2: "3.5-4.0",
    B1: "4.5-5.0",
    B2: "5.5-6.5",
    C1: "7.0-8.0",
    C2: "8.5-9.0",
  };
  return cefrToIELTS[cefrLevel] || "2.0-3.0";
});

const earnedLevelDescript = computed(() => {
  return response.value?.response?.assessment?.aiAssessment?.feedback || "";
});

const grammarDetailsFeed = computed(() => {
  const grammarFeedback =
    response.value?.response?.assessment?.aiAssessment?.grammarFeedback || "";
  return {
    detailedFeedback: grammarFeedback,
    sentenceTypes: {
      simple: 0,
      compound: 0,
      complex: 0,
      compoundComplex: 0,
    },
  };
});

const suggestions = computed(() => {
  const feedback =
    response.value?.response?.assessment?.aiAssessment?.feedback || "";
  const fluencyFb =
    response.value?.response?.assessment?.aiAssessment?.fluencyFeedback || "";
  const grammarFb =
    response.value?.response?.assessment?.aiAssessment?.grammarFeedback || "";
  const vocabFb =
    response.value?.response?.assessment?.aiAssessment?.vocabularyFeedback ||
    "";
  const pronFb =
    response.value?.response?.assessment?.aiAssessment?.pronunciationFeedback ||
    "";

  return `${feedback}\n\nKey areas to focus on:\n- Fluency: ${fluencyFb}\n- Grammar: ${grammarFb}\n- Vocabulary: ${vocabFb}\n- Pronunciation: ${pronFb}`;
});

const wordsLevel = computed(() => {
  return (
    response.value?.response?.assessment?.wpm ||
    response.value?.response?.transcription_details?.speaking_rate ||
    0
  );
});

const rareWord = computed(() => {
  const levels =
    response.value?.response?.assessment?.vocabularyLevel?.meta?.levels;
  if (!levels || !levels.C2) return 0;
  return (100 - levels.C2).toFixed(1);
});

const freqWords = computed(() => {
  const levels =
    response.value?.response?.assessment?.vocabularyLevel?.meta?.levels;
  if (!levels || !levels.A2) return 0;
  return levels.A2.toFixed(1);
});

const levelA1 = computed(() => {
  const level =
    response.value?.response?.assessment?.vocabularyLevel?.meta?.levels?.A1;
  return level ? level.toFixed(1) : 0;
});

const levelA2 = computed(() => {
  const level =
    response.value?.response?.assessment?.vocabularyLevel?.meta?.levels?.A2;
  return level ? level.toFixed(1) : 0;
});

const levelB1 = computed(() => {
  const level =
    response.value?.response?.assessment?.vocabularyLevel?.meta?.levels?.B1;
  return level ? level.toFixed(1) : 0;
});

const levelB2 = computed(() => {
  const level =
    response.value?.response?.assessment?.vocabularyLevel?.meta?.levels?.B2;
  return level ? level.toFixed(1) : 0;
});

const levelC1 = computed(() => {
  const level =
    response.value?.response?.assessment?.vocabularyLevel?.meta?.levels?.C1;
  return level ? level.toFixed(1) : 0;
});

const levelC2 = computed(() => {
  const level =
    response.value?.response?.assessment?.vocabularyLevel?.meta?.levels?.C2;
  return level ? level.toFixed(1) : 0;
});

// Additional computed properties for new sections
const audioUrl = computed(() => {
  const url = response.value?.audio_url;
  if (!url) return null;

  // In development, use proxy to avoid CORS issues
  // In production, use the absolute URL
  if (import.meta.env.DEV && url.startsWith("https://speak.impulselc.uz")) {
    return url.replace("https://speak.impulselc.uz", "");
  }

  return url;
});

const transcript = computed(() => {
  return (
    response.value?.transcript ||
    response.value?.response?.assessment?.transcript ||
    ""
  );
});

const transcriptionDetails = computed(() => {
  return response.value?.response?.transcription_details || null;
});

const pauseAnalysis = computed(() => {
  return response.value?.response?.transcription_details?.pause_analysis || {};
});

const testQuestions = computed(() => {
  return response.value?.response?.assessment?.questions || {};
});

// Check if vocabulary data is available
const hasVocabularyData = computed(() => {
  return !!response.value?.response?.assessment?.vocabularyLevel?.meta?.levels;
});

// Feedback form handling
const message = ref("");
const buttonLoading = ref(false);

async function sendFeedTelegram() {
  if (!message.value.trim()) {
    const toast = await toastController.create({
      message: "Iltimos, fikringizni yozing",
      duration: 2000,
      color: "warning",
    });
    await toast.present();
    return;
  }

  buttonLoading.value = true;
  try {
    // Send feedback to Telegram or backend
    const feedbackData = {
      user: response.value?.User?.username || "Unknown",
      testTitle: reportData.value.title,
      message: message.value,
      responseId: responseId.value,
    };

    console.log("Sending feedback:", feedbackData);

    const toast = await toastController.create({
      message: "Fikringiz yuborildi! Rahmat!",
      duration: 2000,
      color: "success",
    });
    await toast.present();
    message.value = "";
  } catch (error) {
    console.error("Failed to send feedback:", error);
    const toast = await toastController.create({
      message: "Xatolik yuz berdi. Qaytadan urinib ko'ring",
      duration: 2000,
      color: "danger",
    });
    await toast.present();
  } finally {
    buttonLoading.value = false;
  }
}

// Lifecycle hooks - must be after all computed properties are defined
onMounted(async () => {
  await loadResponseData();
});

// Cleanup on unmount
onBeforeUnmount(() => {
  // Cleanup handled by Vue3WaveAudioPlayer component
});
</script>

<style scoped>
ion-card {
  box-shadow: none;
  padding: 0;
  margin-top: 10px;
  margin-bottom: 16px;
}
</style>
