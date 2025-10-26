<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-back-button default-href="/speaking-practice"></ion-back-button>
        </ion-buttons>
        <ion-title>Speaking Part 3</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="speaking-intro">
        <h2 class="text-xl font-bold mb-2">IELTS Speaking Part 3</h2>
        <p class="text-gray-700 mb-4">
          Discussion questions related to the Part 2 topic. This section tests
          your ability to discuss more abstract ideas and give opinions on
          various issues.
        </p>
      </div>

      <!-- Questions Grid -->
      <div v-if="tests.length > 0" class="questions-grid mt-6">
        <ion-card
          v-for="(question, index) in tests"
          :key="question.id || index"
          class="question-card shadow-none cursor-pointer h-full question-card-item"
          @click="router.push(`/speaking-practice/part-3/${question.id}`)"
        >
          <ion-card-content>
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-sm font-semibold">
                <MessageSquare class="w-4 h-4 mr-1" />
                D{{ index + 1 }}
              </div>
              <ion-chip color="medium" class="text-xs">
                ~2 min
              </ion-chip>
            </div>
            
            <h3 class="font-semibold text-base text-gray-900 mb-2 line-clamp-3">
              {{
                question.question
                  ? question.question.includes("FOR")
                    ? question.question.split("FOR")[0]
                    : question.question
                  : `Discussion Question ${index + 1}`
              }}
            </h3>
            
            <div class="flex items-center text-gray-500 text-sm">
              <Clock class="w-4 h-4 mr-1" />
              Discussion
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Loading/Empty State -->
      <div v-else class="flex flex-col items-center justify-center mt-10">
        <ion-spinner v-if="loading" name="crescent"></ion-spinner>
        <div v-else class="text-center">
          <p class="text-lg">No questions available</p>
          <p class="text-sm text-gray-500 mt-2">
            Check back later for new questions
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { MessageSquare, Clock } from "lucide-vue-next";
import endpoints from "@/utils/apiEndpoints";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const tests = ref([]);
const loading = ref(true);



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
/* Responsive Questions Grid */
.questions-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr; /* 1 column on small screens */
}

/* Medium screens: 3 columns */
@media (min-width: 768px) {
  .questions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large screens: 4 columns */
@media (min-width: 1024px) {
  .questions-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.question-card-item {
  height: 100%;
}

.question-card {
  --background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin: 0;
}

.question-card:hover {
  transform: translateY(-4px);
  border-color: #9333ea;
}

.question-card ion-card-content {
  padding: 1rem;
}

.cursor-pointer {
  cursor: pointer;
}

.h-full {
  height: 100%;
}

/* Text truncation */
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

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
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

/* Colors - Part 3 Purple Theme */
.text-purple-600 {
  color: #9333ea;
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

.bg-purple-100 {
  background-color: #ede9fe;
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

ion-chip {
  height: 24px;
  font-size: 12px;
}

</style>
