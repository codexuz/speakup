<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Speaking Part 3</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="speaking-intro">
        <h2 class="text-xl font-bold mb-2">IELTS Speaking Part 3</h2>
        <p class="text-gray-300 mb-4">
          Discussion questions related to the Part 2 topic. This section tests
          your ability to discuss more abstract ideas and give opinions on
          various issues.
        </p>
      </div>

      <!-- Questions List -->
      <ion-list v-if="tests.length > 0" class="mt-6">
        <ion-item
          v-for="(question, index) in tests"
          :key="question.id || index"
          :router-link="`/speaking/part-3/${question.id}`"
        >
          <ion-label class="text-lg font-medium">
            {{
              question.question
                ? question.question.includes("FOR")
                  ? question.question.split("FOR")[0]
                  : question.question
                : `Question ${index + 1}`
            }}
          </ion-label>
        </ion-item>
      </ion-list>

      <!-- Loading/Empty State -->
      <div v-else class="flex flex-col items-center justify-center mt-10">
        <ion-spinner v-if="loading" name="crescent"></ion-spinner>
        <div v-else class="text-center">
          <p class="text-lg">No questions available</p>
          <p class="text-sm text-gray-400 mt-2">
            Check back later for new questions
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import endpoints from "@/utils/apiEndpoints";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const tests = ref([]);
const loading = ref(true);

// Get appropriate color based on difficulty level
const getDifficultyColor = (difficulty) => {
  if (!difficulty) return "medium";

  const level = difficulty.toLowerCase();
  if (level.includes("easy")) return "success";
  if (level.includes("medium")) return "warning";
  if (level.includes("hard")) return "danger";
  return "medium";
};

// Fetch part 3 questions
onMounted(async () => {
  try {
    loading.value = true;
    const response = await endpoints.speaking.getPart4();
    tests.value = response;
  } catch (error) {
    console.error("Error fetching questions:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.question-card {
  --background: rgba(7, 1, 13, 0.25);
  backdrop-filter: blur(7.5px);
  -webkit-backdrop-filter: blur(7.5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease;
  overflow-x: auto;
}

.question-card:hover {
  transform: translateY(-3px);
}

ion-toolbar {
  --background: #070404;
}

ion-chip {
  height: 24px;
  font-size: 12px;
}

.question-content {
  color: #f8f8f8;
  white-space: pre-wrap;
  line-height: 1.5;
  font-size: 0.95rem; /* mimic text-sm */
  margin-bottom: 1.25rem; /* mimic mb-5 */
}

.question-content ul,
.question-content ol {
  margin: 0.5rem 0 0.5rem 1.1rem;
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
</style>
