<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-button @click="showExitConfirmation">
            <ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon>
            Back
          </ion-button>
        </ion-buttons>
        <ion-title>{{ testData?.title || "Speaking Test" }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Loading Spinner -->
      <div v-if="isLoading" class="flex items-center justify-center h-full">
        <ion-spinner name="crescent"></ion-spinner>
        <p class="ml-2 text-lg">Loading test...</p>
      </div>

      <!-- Test Introduction Screen -->
      <div
        v-else-if="initialState"
        class="flex flex-col w-full items-center justify-center mx-auto"
      >
      
        <div class="important-notes mt-4 mb-6">
          <ion-icon :icon="alertCircleOutline" size="large"></ion-icon>
          <p>
            Find a quiet place and speak clearly. Your responses will be
            recorded for assessment.
          </p>
        </div>

        <ion-card class="rounded-xl w-full text-center">
          <ion-card-header>
            <ion-card-title class="text-xl"
              >Speaking Test Structure</ion-card-title
            >
          </ion-card-header>
          <ion-card-content
            class="w-full flex items-center justify-center flex-col"
          >
            <ion-list lines="none" inset="true" class="w-full mx-auto p-1">
              <ion-item>
                <ion-icon slot="start" :icon="chatbubbleOutline"></ion-icon>
                <ion-label>
                  <h2>Part 1.1: Short Questions</h2>
                  <p>3 questions about familiar topics (30 sec each)</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-icon slot="start" :icon="imageOutline"></ion-icon>
                <ion-label>
                  <h2>Part 1.2: Picture Description</h2>
                  <p>Describe images (45 sec each)</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-icon slot="start" :icon="documentTextOutline"></ion-icon>
                <ion-label>
                  <h2>Part 2: Long Turn</h2>
                  <p>Speak for 2 minutes (1 min prep time)</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-icon slot="start" :icon="bulbOutline"></ion-icon>
                <ion-label>
                  <h2>Part 3: Discussion</h2>
                  <p>Answer detailed questions (2 min with 1 min prep)</p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-button expand="block" @click="initializeExam" class="start-button">
          Start Test
          <ion-icon slot="end" :icon="playOutline"></ion-icon>
        </ion-button>
      </div>

      <!-- Test In Progress -->
      <div v-else-if="!examFinished" class="test-in-progress">
        <!-- Progress Indicators -->
        <div class="progress-section">
          <div class="part-indicators">
            <ion-segment v-model="currentPart" disabled>
              <ion-segment-button
                value="1.1"
                :class="{ 'active-part': currentPart === '1.1' }"
              >
                <ion-label>Part 1.1</ion-label>
              </ion-segment-button>
              <ion-segment-button
                value="1.2"
                :class="{ 'active-part': currentPart === '1.2' }"
              >
                <ion-label>Part 1.2</ion-label>
              </ion-segment-button>
              <ion-segment-button
                value="2"
                :class="{ 'active-part': currentPart === '2' }"
              >
                <ion-label>Part 2</ion-label>
              </ion-segment-button>
              <ion-segment-button
                value="3"
                :class="{ 'active-part': currentPart === '3' }"
              >
                <ion-label>Part 3</ion-label>
              </ion-segment-button>
            </ion-segment>
          </div>

          <!-- Question number indicators for Part 1.1 and 1.2 -->
          <div
            v-if="currentPart === '1.1' || currentPart === '1.2'"
            class="question-progress mt-2"
          >
            <div
              v-for="(_, index) in currentPart === '1.1'
                ? part1_1Questions
                : part1_2Questions"
              :key="index"
              class="question-dot"
              :class="{ 'active-dot': index === currentQuestionIndex }"
            ></div>
          </div>
        </div>

        <!-- Question Content -->
        <ion-card class="question-card">
          <ion-card-content>
            <div class="question-header">
              <div class="question-status">
                <span v-if="isPrepTime" class="prep-time-tag">Prep Time</span>
                <span v-else-if="isRecording" class="recording-tag"
                  >Recording</span
                >
              </div>
              <ion-buttons>
                <ion-button fill="clear" @click="decreaseFontSize">
                  <ion-icon :icon="removeOutline"></ion-icon>
                </ion-button>
                <ion-button fill="clear" @click="increaseFontSize">
                  <ion-icon :icon="addOutline"></ion-icon>
                </ion-button>
              </ion-buttons>
            </div>

            <div
              class="question-content"
              :style="{ fontSize: fontSize + 'px' }"
              v-html="currentQuestion?.question"
            ></div>

            <!-- Image for Part 1.2 -->
            <div
              v-if="currentQuestion?.image_url"
              class="question-image-container"
            >
              <img :src="currentQuestion.image_url" class="question-image" />
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Test Finished -->
      <div v-if="examFinished" class="test-finished-overlay">
        <ion-card class="completion-card">
          <ion-card-header>
            <ion-card-title>Test Completed</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div v-if="isUploading" class="uploading-indicator">
              <ion-spinner name="crescent"></ion-spinner>
              <p>Uploading your recording...</p>
            </div>
            <div v-else class="completion-message">
              <ion-icon :icon="checkmarkCircleOutline" size="large"></ion-icon>
              <p>Your test has been successfully submitted!</p>
              <ion-button expand="block" @click="() => router.replace('/speaking/full-test')" class="mt-4">
                Return to Speaking Tests
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Timer Badge -->
      <div class="timer-badge" v-if="!initialState && !examFinished">
        <ion-badge color="primary">
          {{ formattedTime }}
        </ion-badge>
        <div v-if="isRecording" class="recording-indicator"></div>
      </div>

      <!-- Next Button for iOS -->
      <div
        v-if="
          platform === 'ios' &&
          !initialState &&
          !examFinished &&
          !isRecording &&
          !isPrepTime
        "
        class="next-button-container"
      >
        <ion-button @click="handleNextButtonClick" class="next-button">
          Next
          <ion-icon slot="end" :icon="chevronForwardOutline"></ion-icon>
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-toolbar {
  --background: #070404;
}

.balance-chip {
  margin-right: 8px;
  --background: rgba(250, 183, 0, 0.2);
  --color: #fab700;
}

.test-info-card {
  margin-bottom: 20px;
}

.important-notes {
  display: flex;
  align-items: center;
  background-color: rgba(255, 193, 7, 0.1);
  border-radius: 8px;
  padding: 12px;
}

.important-notes ion-icon {
  color: #ffc107;
  margin-right: 12px;
}

.start-button {
  margin-top: 20px;
  height: 48px;
  --border-radius: 24px;
}

.progress-section {
  margin-bottom: 16px;
}

.active-part {
  --color: #fff;
  --color-checked: #fff;
  font-weight: bold;
}

.question-progress {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.question-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
}

.active-dot {
  background-color: var(--ion-color-primary);
}

.question-card {
  margin-bottom: 16px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.question-status {
  display: flex;
  align-items: center;
}

.prep-time-tag {
  background-color: #ffc107;
  color: #000;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
}

.recording-tag {
  background-color: #f44336;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.question-content {
  margin-bottom: 16px;
  line-height: 1.6;
}

.question-image-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.question-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}

.timer-badge {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
}

.timer-badge ion-badge {
  font-size: 18px;
  padding: 12px 24px;
  border-radius: 20px;
}

.recording-indicator {
  width: 12px;
  height: 12px;
  background-color: #f44336;
  border-radius: 50%;
  margin-top: 8px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.next-button-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.next-button {
  --border-radius: 20px;
}

.test-finished-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.completion-card {
  width: 90%;
  max-width: 400px;
}

.uploading-indicator,
.completion-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px;
}

.completion-message ion-icon {
  color: var(--ion-color-success);
  font-size: 48px;
  margin-bottom: 16px;
}

/* Add responsive styles for tables in question content */
:deep(.question-content table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  display: block;
  overflow-x: auto;
  max-width: 100%;
}

:deep(.question-content th),
:deep(.question-content td) {
  border: 1px solid #444;
  padding: 8px;
  text-align: left;
}

:deep(.question-content th) {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUser } from "@/composables/useUser";
import { Device } from "@capacitor/device";
import endpoints from "@/utils/apiEndpoints";
import { useBackButton } from "@ionic/vue";
import { App } from "@capacitor/app";

import {
  startRecording,
  pauseRecording,
  resumeRecording,
  stopRecording,
} from "@/lib/microphone.js";
import beepSound from "@/assets/beep.m4a";
import {
  chatbubbleOutline,
  imageOutline,
  documentTextOutline,
  bulbOutline,
  alertCircleOutline,
  playOutline,
  checkmarkCircleOutline,
  removeOutline,
  addOutline,
  wallet,
  chevronForwardOutline,
  chevronBackOutline,
} from "ionicons/icons";

const { user, loadUser } = useUser();
const route = useRoute();
const router = useRouter();
const id = route.params.id;

// UI State
const isLoading = ref(true);
const initialState = ref(true);
const examFinished = ref(false);
const isUploading = ref(false);
const fontSize = ref(16);
const platform = ref("web");

// Test Data
const testData = ref(null);
const allQuestions = ref([]);
const part1_1Questions = ref([]);
const part1_2Questions = ref([]);
const part2Questions = ref([]);
const part3Questions = ref([]);

// Current Question State
const currentPart = ref("1.1");
const currentQuestionIndex = ref(0);
const currentQuestion = ref(null);

// Timer State
const timerCount = ref(0);
const timerInterval = ref(null);
const isPrepTime = ref(false);
const isRecording = ref(false);

// Format time as MM:SS
const formattedTime = computed(() => {
  const minutes = Math.floor(timerCount.value / 60);
  const seconds = timerCount.value % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
});

// Get current question based on part and index
const getCurrentQuestion = () => {
  if (currentPart.value === "1.1") {
    return part1_1Questions.value[currentQuestionIndex.value];
  } else if (currentPart.value === "1.2") {
    return part1_2Questions.value[currentQuestionIndex.value];
  } else if (currentPart.value === "2") {
    return part2Questions.value[0];
  } else if (currentPart.value === "3") {
    return part3Questions.value[0];
  }
  return null;
};

// Text size controls
const increaseFontSize = () => {
  if (fontSize.value < 24) {
    fontSize.value += 1;
  }
};

const decreaseFontSize = () => {
  if (fontSize.value > 12) {
    fontSize.value -= 1;
  }
};

// Play audio with callback
const playAudio = (audioUrl, callback) => {
  if (!audioUrl) {
    if (callback) callback();
    return;
  }

  const audio = new Audio(audioUrl);
  audio.play();
  audio.onended = callback;
};

// Play beep sound
const playBeep = () => {
  const audio = new Audio(beepSound);
  audio.play();
};

// Initialize the exam
const initializeExam = async () => {
  try {
    // First, make sure any previous recordings are stopped
    try {
      await stopRecording();
    } catch (e) {
      console.log("No active recording to stop:", e);
    }
    
    // Start a fresh recording
    await startRecording();
    
    // Update UI state
    initialState.value = false;
    currentPart.value = "1.1";
    currentQuestionIndex.value = 0;
    currentQuestion.value = getCurrentQuestion();
    
    // Start with prep time for Part 1.1
    startPrepTimer(5, () => {
      // After prep time, start recording and timer
      startRecordingTimer(30, nextQuestion);
    });
  } catch (error) {
    console.error("Error initializing exam:", error);
    alert("Could not initialize microphone. Please check permissions and try again.");
  }
};

// Handle next question button click
const handleNextButtonClick = () => {
  if (currentPart.value === "1.1") {
    if (currentQuestionIndex.value < part1_1Questions.value.length - 1) {
      nextQuestion();
    } else {
      transitionToPart1_2();
    }
  } else if (currentPart.value === "1.2") {
    if (currentQuestionIndex.value < part1_2Questions.value.length - 1) {
      nextQuestion();
    } else {
      transitionToPart2();
    }
  } else if (currentPart.value === "2") {
    transitionToPart3();
  } else if (currentPart.value === "3") {
    finishExam();
  }
};

// Move to next question
const nextQuestion = () => {
  clearInterval(timerInterval.value);
  pauseRecording();

  // If there are more questions in the current part
  if (
    currentPart.value === "1.1" &&
    currentQuestionIndex.value < part1_1Questions.value.length - 1
  ) {
    currentQuestionIndex.value++;
    currentQuestion.value = getCurrentQuestion();

    // Start with prep time
    startPrepTimer(5, () => {
      // After prep time, start recording and timer
      startRecordingTimer(30, nextQuestion);
    });
  } else if (
    currentPart.value === "1.2" &&
    currentQuestionIndex.value < part1_2Questions.value.length - 1
  ) {
    currentQuestionIndex.value++;
    currentQuestion.value = getCurrentQuestion();

    // Start with prep time
    startPrepTimer(10, () => {
      // After prep time, start recording and timer
      startRecordingTimer(45, nextQuestion);
    });
  } else {
    // Move to next part if we're at the end of questions
    if (currentPart.value === "1.1") {
      transitionToPart1_2();
    } else if (currentPart.value === "1.2") {
      transitionToPart2();
    } else if (currentPart.value === "2") {
      transitionToPart3();
    } else {
      finishExam();
    }
  }
};

// Transition to Part 1.2
const transitionToPart1_2 = () => {
  currentPart.value = "1.2";
  currentQuestionIndex.value = 0;
  currentQuestion.value = getCurrentQuestion();

  // Start with prep time for Part 1.2
  startPrepTimer(10, () => {
    // After prep time, start recording and timer
    startRecordingTimer(45, nextQuestion);
  });
};

// Transition to Part 2
const transitionToPart2 = () => {
  currentPart.value = "2";
  currentQuestionIndex.value = 0;
  currentQuestion.value = getCurrentQuestion();

  // Start with prep time for Part 2 (1 minute)
  startPrepTimer(60, () => {
    // After prep time, start recording and timer (2 minutes)
    startRecordingTimer(120, nextQuestion);
  });
};

// Transition to Part 3
const transitionToPart3 = () => {
  currentPart.value = "3";
  currentQuestionIndex.value = 0;
  currentQuestion.value = getCurrentQuestion();

  // Start with prep time for Part 3 (1 minute)
  startPrepTimer(60, () => {
    // After prep time, start recording and timer (2 minutes)
    startRecordingTimer(120, nextQuestion);
  });
};

// Start preparation timer
const startPrepTimer = (seconds, callback) => {
  clearInterval(timerInterval.value);
  isPrepTime.value = true;
  isRecording.value = false;
  pauseRecording();

  timerCount.value = seconds;
  timerInterval.value = setInterval(() => {
    timerCount.value--;
    if (timerCount.value <= 0) {
      clearInterval(timerInterval.value);
      playBeep(); // Play beep sound when prep time finishes
      if (callback) callback();
    }
  }, 1000);
};

// Start recording timer
const startRecordingTimer = (seconds, callback) => {
  clearInterval(timerInterval.value);
  isPrepTime.value = false;
  isRecording.value = true;
  resumeRecording();

  timerCount.value = seconds;
  timerInterval.value = setInterval(() => {
    timerCount.value--;
    if (timerCount.value <= 0) {
      clearInterval(timerInterval.value);
      // No beep sound when recording time finishes
      if (callback) callback();
    }
  }, 1000);
};

// Finish the exam
const finishExam = async () => {
  clearInterval(timerInterval.value);
  pauseRecording(); // Make sure to pause first
  examFinished.value = true;
  isUploading.value = true;

  try {
    // Stop recording and get the audio blob
    const audioBlob = await stopRecording();
    console.log("Recording stopped, blob size:", audioBlob.size);
    
    // Check if we have a valid blob
    if (!audioBlob || audioBlob.size === 0) {
      throw new Error("Recording is empty");
    }

    // Save the recording
    await saveRecording(audioBlob);

    // Wait a short delay to show completion
    setTimeout(() => {
      isUploading.value = false;
    }, 2000);
  } catch (error) {
    console.error("Error finishing exam:", error);
    isUploading.value = false;
    
    // Show error to user
    const { alertController } = await import("@ionic/vue");
    const alert = await alertController.create({
      header: "Recording Error",
      message: "There was a problem with your recording. Please try again.",
      buttons: ["OK"]
    });
    await alert.present();
  }
};

// Save recording to server
const saveRecording = async (audioBlob) => {
  try {
    console.log("Saving audio blob of size:", audioBlob.size);
    
    // First upload the audio file
    const formData = new FormData();
    formData.append("file", audioBlob, "speaking_test.m4a");
    
    // Log form data for debugging
    for (let [key, value] of formData.entries()) { 
      console.log(`${key}: ${value instanceof Blob ? 'Blob of size ' + value.size : value}`);
    }

    const uploadResponse = await endpoints.speaking.saveRecording(formData);
    console.log("Upload response:", uploadResponse);

    if (uploadResponse) {
      // Check which property contains the URL
      const fileUrl = uploadResponse.file_url || uploadResponse.url || uploadResponse.audio_url;
      
      if (!fileUrl) {
        console.error("No file URL in response:", uploadResponse);
        throw new Error("No file URL in response");
      }
      
      // Then save the response data
      const responseData = {
        test_id: id,
        audio_url: fileUrl,
        user_id: user.value?.id,
      };
      
      console.log("Saving response data:", responseData);
      const saveResponse = await endpoints.speaking.uploadResponse(responseData);
      console.log("Response saved successfully:", saveResponse);
    } else {
      throw new Error("No upload response received");
    }
  } catch (error) {
    console.error("Error saving recording:", error);
    throw error; // Re-throw for handling in the calling function
  }
};

// Load test data
const loadTestData = async () => {
  try {
    isLoading.value = true;
    const response = await endpoints.speaking.getById(id);

    if (response) {
      testData.value = response;

      // Organize questions by part
      if (response.SpeakingParts && response.SpeakingParts.length > 0) {
        allQuestions.value = response.SpeakingParts;

        // Sort questions by part
        part1_1Questions.value = allQuestions.value.filter(
          (q) => q.part === "1.1"
        );
        part1_2Questions.value = allQuestions.value.filter(
          (q) => q.part === "1.2"
        );
        part2Questions.value = allQuestions.value.filter((q) => q.part === "2");
        part3Questions.value = allQuestions.value.filter((q) => q.part === "3");
      }
    }
  } catch (error) {
    console.error("Error loading test data:", error);
  } finally {
    isLoading.value = false;
  }
};

// Function to show exit confirmation dialog
const showExitConfirmation = async () => {
  // Import the alertController from Ionic
  const { alertController } = await import("@ionic/vue");

  // Create the alert
  const alert = await alertController.create({
    header: "Exit Test?",
    message:
      "Are you sure you want to exit the test? Your progress will be lost.",
    buttons: [
      {
        text: "Cancel",
        role: "cancel",
      },
      {
        text: "Exit Test",
        handler: () => {
          // Exit the test and go back
          resetExam();
          router.back();
        },
      },
    ],
  });

  // Present the alert
  await alert.present();
};

// Reset exam state
const resetExam = () => {
  clearInterval(timerInterval.value);
  initialState.value = true;
  examFinished.value = false;
  isPrepTime.value = false;
  isRecording.value = false;
  currentQuestionIndex.value = 0;
  currentPart.value = "1.1";
  timerCount.value = 0;
};

// Get device platform
const getDevicePlatform = async () => {
  try {
    const info = await Device.getInfo();
    platform.value = info.platform;
  } catch (error) {
    console.error("Error getting device platform:", error);
    platform.value = "web"; // Default to web
  }
};

// Watch for changes to current part and question index
watch([currentPart, currentQuestionIndex], () => {
  currentQuestion.value = getCurrentQuestion();
});

 // Set up back button handling
  App.addListener("backButton", async () => {
    await showExitConfirmation();
  });


onMounted(async () => {
  await loadUser();
  await loadTestData();
  await getDevicePlatform();

  // Check microphone permissions but don't start recording yet
  try {
    const permission = await VoiceRecorder.requestAudioRecordingPermission();
    if (!permission.value) {
      const { alertController } = await import("@ionic/vue");
      const alert = await alertController.create({
        header: "Microphone Access Required",
        message: "Please allow microphone access to take the speaking test.",
        buttons: ["OK"]
      });
      await alert.present();
    }
  } catch (error) {
    console.error("Error checking microphone permissions:", error);
  }
});

onBeforeUnmount(() => {
  clearInterval(timerInterval.value);
  // Ensure recording is stopped
  try {
    stopRecording();
  } catch (error) {
    console.error("Error stopping recording:", error);
  }

  // Remove back button handler
});
</script>
