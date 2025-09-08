<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-back-button default-href="/speaking/part-1.2"></ion-back-button>
        </ion-buttons>
        <ion-title>Speaking Practice</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">
      <div v-if="loading" class="flex items-center justify-center h-full">
        <ion-spinner name="crescent"></ion-spinner>
      </div>

      <div v-else-if="question" class="question-container">
        <!-- Segment at the top -->
        <ion-segment v-model="activeTab" mode="ios" class="mb-4">
          <ion-segment-button value="practice">
            <ion-label>Practice</ion-label>
            <ion-icon :icon="micOutline"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="recordings">
            <ion-label>My Recordings</ion-label>
            <ion-icon :icon="headsetOutline"></ion-icon>
          </ion-segment-button>
        </ion-segment>

        <div v-if="activeTab === 'practice'">
          <h1 class="text-xl font-bold mb-2">{{ question.title }}</h1>

          <div
            class="question-content mb-5"
            v-html="question.content || question.question"
          ></div>

          <ion-accordion-group>
            <ion-accordion value="sample-answer">
              <ion-item slot="header" color="light">
                <ion-label>Sample Answer</ion-label>
              </ion-item>
              <div slot="content" class="ion-padding">
                <div
                  v-if="question.sample_answer"
                  v-html="question.sample_answer"
                ></div>
                <div v-else class="text-gray-400">
                  No sample answer available for this question.
                </div>
              </div>
            </ion-accordion>

            <ion-accordion value="tips">
              <ion-item slot="header" color="light">
                <ion-label>Speaking Tips</ion-label>
              </ion-item>
              <div slot="content" class="ion-padding">
                <div v-if="question.tips" v-html="question.tips"></div>
                <div v-else>
                  <h3 class="font-medium mb-2">General Speaking Tips:</h3>
                  <ul class="list-disc pl-5 space-y-2">
                    <li>Speak clearly and at a natural pace</li>
                    <li>Use a variety of vocabulary and sentence structures</li>
                    <li>Include specific examples to support your ideas</li>
                    <li>Use appropriate linking words to connect your ideas</li>
                    <li>Express your opinions and explain your reasoning</li>
                  </ul>
                </div>
              </div>
            </ion-accordion>
          </ion-accordion-group>
        </div>
        <!-- Closing div for v-if="activeTab === 'practice'" -->

        <!-- Recordings list directly in content -->
        <div
          v-else-if="activeTab === 'recordings'"
          class="recordings-container"
        >
          <div
            v-if="recordings.length === 0"
            class="flex flex-col items-center justify-center py-8"
          >
            <ion-icon
              name="mic-off-outline"
              size="large"
              class="mb-4"
            ></ion-icon>
            <p class="text-center">
              You haven't made any recordings for this question yet.
            </p>
          </div>

          <ion-list v-else>
            <ion-item v-for="(recording, index) in recordings" :key="index">
              <ion-label>
                <h2>Recording {{ index + 1 }}</h2>
                <p>{{ formatDate(recording.date) }}</p>
              </ion-label>
              <ion-button
                slot="end"
                fill="clear"
                @click="playRecording(recording.path)"
              >
                <ion-icon :icon="playCircleOutline"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>
        </div>
      </div>
      <!-- Closing div for v-else-if="question" -->

      <div v-else class="flex flex-col items-center justify-center h-full">
        <ion-icon
          name="alert-circle-outline"
          size="large"
          class="mb-4"
        ></ion-icon>
        <p class="text-center">Question not found or has been removed.</p>
        <ion-button class="mt-4" router-link="/speaking/part-1.2">
          Back to Questions
        </ion-button>
      </div>
    </ion-content>

    <!-- Recording Floating Button -->
    <div v-if="activeTab === 'practice'" class="recording-btn-container">
      <ion-button
        :color="isRecording ? 'danger' : 'primary'"
        class="recording-btn"
        @click="toggleRecording"
      >
        <ion-icon
          :icon="isRecording ? stopCircleOutline : micOutline"
          size="large"
        ></ion-icon>
      </ion-button>
      <div v-if="isRecording" class="timer">
        {{ formatTime(recordingDuration) }}
      </div>
    </div>

    <!-- Save Recording Modal -->
    <ion-modal :is-open="showSaveModal" @ionModalDidDismiss="discardRecording">
      <ion-header>
        <ion-toolbar>
          <ion-title>Save Recording</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <p class="mb-4">Would you like to save your recording?</p>

        <ion-button
          expand="block"
          color="primary"
          @click="saveRecording"
          class="mb-3"
          tabindex="0"
        >
          Save Recording
        </ion-button>

        <ion-button
          expand="block"
          color="medium"
          @click="discardRecording"
          class="mb-3"
          tabindex="0"
        >
          Discard
        </ion-button>

        <ion-button
          expand="block"
          fill="outline"
          color="success"
          @click="playTempRecording"
          class="mb-3"
          tabindex="0"
        >
          Play Recording
        </ion-button>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  micOutline,
  stopCircleOutline,
  playCircleOutline,
  headsetOutline,
  alertCircleOutline,
} from "ionicons/icons";
import {
  startRecording,
  stopRecording,
  pauseRecording,
  resumeRecording,
} from "@/lib/microphone";
import endpoints from "@/utils/apiEndpoints";
import { Preferences } from "@capacitor/preferences";
import { Filesystem, Directory } from "@capacitor/filesystem";

const route = useRoute();
const router = useRouter();
const questionId = route.params.id;
const question = ref(null);
const loading = ref(true);
const activeTab = ref("practice");

// Recording state
const isRecording = ref(false);
const recordingDuration = ref(0);
const timerInterval = ref(null);
const showSaveModal = ref(false);
const tempRecordingUrl = ref(null);
const recordings = ref([]);
const audioPlayer = ref(new Audio());

// Load question data
onMounted(async () => {
  try {
    loading.value = true;
    const response = await endpoints.speaking.getPartById(questionId);
    question.value = response;

    // Load saved recordings for this question
    await loadRecordings();
  } catch (error) {
    console.error("Error fetching question:", error);
  } finally {
    loading.value = false;
  }
});

// Format time for recording duration display
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

// Format date for recording list
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// Toggle recording state
const toggleRecording = async () => {
  if (isRecording.value) {
    await stopAndSave();
  } else {
    await startNewRecording();
  }
};

// Start a new recording
const startNewRecording = async () => {
  try {
    await startRecording();
    isRecording.value = true;
    recordingDuration.value = 0;

    // Start timer
    timerInterval.value = setInterval(() => {
      recordingDuration.value++;

      // Auto-stop after 2 minutes (typical for IELTS part 1)
      if (recordingDuration.value >= 120) {
        stopAndSave();
      }
    }, 1000);
  } catch (error) {
    console.error("Failed to start recording:", error);
  }
};

// Stop recording and show save modal
const stopAndSave = async () => {
  try {
    clearInterval(timerInterval.value);
    isRecording.value = false;

    const audioBlob = await stopRecording();
    tempRecordingUrl.value = URL.createObjectURL(audioBlob);

    // Show save modal
    showSaveModal.value = true;
  } catch (error) {
    console.error("Failed to stop recording:", error);
  }
};

// Play temporary recording (before saving)
const playTempRecording = () => {
  if (tempRecordingUrl.value) {
    audioPlayer.value.src = tempRecordingUrl.value;
    audioPlayer.value.play();
  }
};

// Save the recording to file system
const saveRecording = async () => {
  try {
    // Convert blob URL to blob data
    const response = await fetch(tempRecordingUrl.value);
    const blobData = await response.blob();

    // Convert blob to base64
    const reader = new FileReader();
    reader.readAsDataURL(blobData);

    reader.onloadend = async function () {
      const base64Data = reader.result.split(",")[1];
      const fileName = `recording_${questionId}_${Date.now()}.m4a`;

      // Save file to filesystem - use Data directory which is more reliable
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
        recursive: true,
      });

      // Store both uri and fileName for more reliable lookup
      const recording = {
        path: savedFile.uri || fileName, // Use uri if available, otherwise filename
        date: new Date().toISOString(),
        questionId,
        fileName,
      };

      // Add to recordings array
      recordings.value.push(recording);

      // Save to Preferences
      await saveRecordingsToStorage();

      // Close modal
      showSaveModal.value = false;

      // Revoke the temporary URL
      URL.revokeObjectURL(tempRecordingUrl.value);
      tempRecordingUrl.value = null;

      // Also save to server if needed
      // await endpoints.speaking.saveRecording({
      //   questionId,
      //   audioPath: savedFile.uri
      // });
    };
  } catch (error) {
    console.error("Failed to save recording:", error);
  }
};

// Discard the recording
const discardRecording = () => {
  if (tempRecordingUrl.value) {
    URL.revokeObjectURL(tempRecordingUrl.value);
    tempRecordingUrl.value = null;
  }
  showSaveModal.value = false;
};

// Play a saved recording
const playRecording = async (path) => {
  try {
    // Get just the filename if the path is a full URI
    const fileName = path.includes("/") ? path.split("/").pop() : path;

    // Try to read the file from filesystem
    try {
      const file = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Data,
      });

      // Create a blob URL from the file data
      const base64Data = file.data;
      const blob = base64toBlob(base64Data, "audio/m4a");
      const url = URL.createObjectURL(blob);

      // Play the audio
      audioPlayer.value.src = url;
      audioPlayer.value.play();

      // Store the URL to revoke it later
      audioPlayer.value.onended = () => {
        URL.revokeObjectURL(url);
      };
    } catch (fileError) {
      console.error("Error reading file:", fileError);
      // Show a user-friendly error message
      alert(
        "Unable to play this recording. It may have been deleted or moved."
      );
    }
  } catch (error) {
    console.error("Failed to play recording:", error);
  }
};

// Helper function to convert base64 to blob
const base64toBlob = (base64Data, contentType) => {
  contentType = contentType || "";
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
};

// Load recordings from storage
const loadRecordings = async () => {
  try {
    const storageKey = `recordings_${questionId}`;
    const { value } = await Preferences.get({ key: storageKey });

    if (value) {
      recordings.value = JSON.parse(value);

      // Verify that all files still exist
      const validRecordings = [];
      for (const recording of recordings.value) {
        try {
          // Get just the filename if the path is a full URI
          const fileName =
            recording.fileName ||
            (recording.path && recording.path.includes("/")
              ? recording.path.split("/").pop()
              : recording.path);

          if (!fileName) {
            console.warn("Recording without valid path:", recording);
            continue;
          }

          await Filesystem.stat({
            path: fileName,
            directory: Directory.Data,
          });

          // Make sure fileName is always stored
          if (!recording.fileName) {
            recording.fileName = fileName;
          }

          validRecordings.push(recording);
        } catch (err) {
          console.warn(`Recording file not found:`, recording);
        }
      }

      recordings.value = validRecordings;
      await saveRecordingsToStorage();
    }
  } catch (error) {
    console.error("Failed to load recordings:", error);
  }
};

// Save recordings to storage
const saveRecordingsToStorage = async () => {
  try {
    const storageKey = `recordings_${questionId}`;
    await Preferences.set({
      key: storageKey,
      value: JSON.stringify(recordings.value),
    });
  } catch (error) {
    console.error("Failed to save recordings to storage:", error);
  }
};

// Clean up on component unmount
onBeforeUnmount(() => {
  clearInterval(timerInterval.value);
  audioPlayer.value.pause();

  // Revoke object URLs to prevent memory leaks
  if (tempRecordingUrl.value) {
    URL.revokeObjectURL(tempRecordingUrl.value);
  }
});
</script>

<style scoped>
.question-container {
  max-width: 800px;
  margin: 0 auto;
}

.question-content {
  color: #f8f8f8;
  line-height: 1.6;
}

.question-content ul,
.question-content ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.question-content ul {
  list-style-type: disc;
}

.question-content ol {
  list-style-type: decimal;
}

.question-content p {
  margin-bottom: 0.5rem;
}

.question-content strong,
.question-content b {
  font-weight: 600;
}

.question-content em,
.question-content i {
  font-style: italic;
}

ion-toolbar {
  --background: #070404;
}

.recording-btn-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
}

.recording-btn {
  --border-radius: 50%;
  width: 70px;
  height: 70px;
  margin-bottom: 8px;
}

.timer {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
}

.recordings-container {
  margin-top: 1rem;
}
</style>
