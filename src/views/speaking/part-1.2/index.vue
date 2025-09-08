<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Speaking Part 1.2</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="speaking-intro">
        <h2 class="text-xl font-bold mb-2">IELTS Speaking Part 1.2</h2>
        <p class="text-gray-300 mb-4">
          Image description questions.
        </p>
      </div>

      <!-- Questions List -->
       <ion-list v-if="tests.length > 0" class="mt-6">
        <ion-item
          v-for="(question, index) in tests"
          :key="question.id || index"
          :router-link="`/speaking/part-1.2/${question.id}`"
        >
            <ion-label class="text-lg font-medium">
              {{ question.question || `Question ${index + 1}` }}
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

// Fetch part 1.2 questions
onMounted(async () => {
  try {
    loading.value = true;
    const response = await endpoints.speaking.getPart2();
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
</style>
