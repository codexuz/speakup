<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-back-button default-href="/speaking-practice"></ion-back-button>
        </ion-buttons>
        <ion-title>Speaking Part 2</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="speaking-intro">
        <h2 class="text-xl font-bold mb-2">IELTS Speaking Part 2</h2>
        <p class="text-gray-700 mb-4">
          Long turn speaking tasks. You'll receive a topic card and have 1
          minute to prepare before speaking for 1-2 minutes on the topic.
        </p>
      </div>

      <ion-grid v-if="tests.length > 0">
        <ion-row>
          <ion-col size="12" size-md="8" size-lg="8" class="mx-auto">
            <!-- Questions Cards Grid -->
            <div class="questions-grid mt-8">
              <div 
                v-for="(question, index) in tests" 
                :key="question.id || index"
                class="question-card-item"
                @click="router.push(`/speaking-practice/part-2/${question.id}`)"
              >
                <ion-card class="question-card shadow-none h-full cursor-pointer">
                  <ion-card-content class="p-4">
                    <div class="flex items-start justify-between mb-3">
                      <div class="question-number">
                        <span class="text-sm font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                          T{{ index + 1 }}
                        </span>
                      </div>
                      <div class="question-icon">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <h3 class="text-base font-medium text-gray-900 mb-2 line-clamp-3">
                      {{ question.question
                        ? question.question.includes("2")
                          ? question.question.split("2")[0]
                          : question.question
                        : `Topic ${index + 1}`
                      }}
                    </h3>
                    
                    <div class="flex items-center justify-between text-sm text-gray-500">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        1-2 min
                      </span>
                      <span class="text-orange-600 font-medium">Speak →</span>
                    </div>
                  </ion-card-content>
                </ion-card>
              </div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>

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
import endpoints from "@/utils/apiEndpoints";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const tests = ref([]);
const loading = ref(true);



// Fetch part 2 questions
onMounted(async () => {
  try {
    loading.value = true;
    const response = await endpoints.speaking.getPart3();
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
  border-color: #ea580c;
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

/* Colors - Part 2 Orange Theme */
.text-orange-600 {
  color: #ea580c;
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

.bg-orange-100 {
  background-color: #fed7aa;
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
