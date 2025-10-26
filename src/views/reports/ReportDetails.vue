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

    <!-- Content -->
    <ion-content class="main-content">
      <ion-grid class="assessment-grid">
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-md="11" size-lg="9" size-xl="8">
            
            <!-- Loading State -->
            <div v-if="loading" class="loading-state">
              <div class="loading-card">
                <ion-spinner name="circular" class="loading-spinner"></ion-spinner>
                <p class="loading-text">Loading Assessment Report...</p>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="error-state">
              <div class="error-card">
                <ion-icon :icon="alertCircleOutline" class="error-icon"></ion-icon>
                <h2 class="error-title">Unable to Load Report</h2>
                <p class="error-message">{{ error }}</p>
                <ion-button 
                  fill="solid" 
                  color="primary" 
                  class="retry-btn"
                  @click="loadResponseData"
                >
                  <ion-icon :icon="refreshOutline" slot="start"></ion-icon>
                  Try Again
                </ion-button>
              </div>
            </div>

            <!-- Assessment Report -->
            <div v-else-if="response" class="assessment-report">
              
              <!-- Header Section -->
              <div class="report-header">
                <h1 class="report-title">{{ response.SpeakingTest?.title || "IELTS Speaking Test" }}</h1>
                <p class="report-date">
                  Completed: {{ formatDateFromISOString(response.response?.assessment?.timestamp || response.created_at) }}
                </p>
              </div>

              <!-- Overall Score Card -->
              <ion-card class="score-overview-card">
                <div class="score-header">
                  <div class="score-main">
                    <div class="score-circle">
                      <div class="score-number">{{ response.response?.assessment?.aiAssessment?.cefr_score || 0 }}</div>
                      <div class="score-max">/100</div>
                    </div>
                    <div class="score-info">
                      <h2 class="score-title">Overall Score</h2>
                      <div class="cefr-level">
                        <span class="cefr-label">CEFR Level:</span>
                        <ion-badge 
                          :color="getCefrColor(response.response?.assessment?.aiAssessment?.cefr_level)"
                          class="cefr-badge"
                        >
                          {{ response.response?.assessment?.aiAssessment?.cefr_level || "N/A" }}
                        </ion-badge>
                      </div>
                      <div class="speaking-stats">
                        <div class="stat-item">
                          <span class="stat-label">Speaking Rate:</span>
                          <span class="stat-value">{{ Math.round(response.response?.assessment?.wpm || 0) }} WPM</span>
                        </div>
                        <div class="stat-item">
                          <span class="stat-label">Duration:</span>
                          <span class="stat-value">{{ formatDuration(response.response?.transcription_details?.total_duration) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ion-button 
                    fill="clear" 
                    size="small" 
                    class="info-btn"
                    @click="showCefrInfo"
                  >
                    <ion-icon :icon="informationCircleOutline"></ion-icon>
                  </ion-button>
                </div>
              </ion-card>

              <!-- Skills Breakdown -->
              <ion-card class="skills-card">
                <ion-card-header class="skills-header">
                  <ion-card-title class="card-title">
                    <ion-icon :icon="statsChartOutline" class="title-icon"></ion-icon>
                    Skills Breakdown
                  </ion-card-title>
                </ion-card-header>
                <ion-card-content class="skills-content">
                  <ion-grid>
                    <ion-row>
                      <ion-col size="12" size-md="6" v-for="skill in skillsData" :key="skill.name">
                        <div class="skill-item m-2">
                          <div class="skill-header">
                            <div class="skill-info">
                              <ion-icon :icon="skill.icon" :color="skill.color" class="skill-icon"></ion-icon>
                              <span class="skill-name">{{ skill.name }}</span>
                            </div>
                            <span class="skill-score">{{ skill.score }}/100</span>
                          </div>
                          <div class="skill-progress">
                            <ion-progress-bar 
                              :value="skill.score / 100" 
                              :color="skill.color"
                              class="custom-progress"
                            ></ion-progress-bar>
                          </div>
                          <p class="skill-feedback">{{ skill.feedback }}</p>
                        </div>
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </ion-card-content>
              </ion-card>

              <!-- General Feedback -->
              <ion-card class="feedback-card">
                <ion-card-header class="feedback-header">
                  <ion-card-title class="card-title">
                    <ion-icon :icon="chatbubbleEllipsesOutline" class="title-icon"></ion-icon>
                    AI Assessment Feedback
                  </ion-card-title>
                </ion-card-header>
                <ion-card-content class="feedback-content">
                  <div class="feedback-text">
                    {{ response.response?.assessment?.aiAssessment?.feedback || "No detailed feedback available for this assessment." }}
                  </div>
                </ion-card-content>
              </ion-card>

              <!-- Test Questions -->
              <ion-card v-if="response.response?.assessment?.questions" class="questions-card">
                <ion-card-header class="questions-header">
                  <ion-card-title class="card-title">
                    <ion-icon :icon="helpCircleOutline" class="title-icon"></ion-icon>
                    Test Questions
                  </ion-card-title>
                </ion-card-header>
                <ion-card-content class="questions-content">
                  <div v-for="(questions, part) in response.response.assessment.questions" :key="part" class="question-part">
                    <h3 class="part-title">Part {{ part }}</h3>
                    <div v-for="(question, index) in questions" :key="index" class="question-item">
                      <div class="question-text">{{ question }}</div>
                    </div>
                  </div>
                </ion-card-content>
              </ion-card>

              <!-- Speaking Analysis -->
              <ion-card v-if="response.response?.transcription_details" class="analysis-card">
                <ion-card-header class="analysis-header">
                  <ion-card-title class="card-title">
                    <ion-icon :icon="analyticsOutline" class="title-icon"></ion-icon>
                    Speaking Analysis
                  </ion-card-title>
                </ion-card-header>
                <ion-card-content class="analysis-content">
                  <ion-grid>
                    <ion-row>
                      <ion-col size="12" size-md="6">
                        <div class="analysis-item">
                          <div class="analysis-label">Word Count</div>
                          <div class="analysis-value">{{ response.response.transcription_details.word_count || 0 }}</div>
                        </div>
                      </ion-col>
                      <ion-col size="12" size-md="6">
                        <div class="analysis-item">
                          <div class="analysis-label">Confidence Score</div>
                          <div class="analysis-value">{{ Math.round((response.response.transcription_details.confidence_score || 0) * 100) }}%</div>
                        </div>
                      </ion-col>
                      <ion-col size="12" size-md="6">
                        <div class="analysis-item">
                          <div class="analysis-label">Filler Words</div>
                          <div class="analysis-value">{{ response.response.transcription_details.filler_word_count || 0 }}</div>
                        </div>
                      </ion-col>
                      <ion-col size="12" size-md="6">
                        <div class="analysis-item">
                          <div class="analysis-label">Average Pause</div>
                          <div class="analysis-value">{{ Math.round((response.response.transcription_details.pause_analysis?.average_pause_duration || 0) * 100) / 100 }}s</div>
                        </div>
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </ion-card-content>
              </ion-card>

              <!-- Audio & Transcript -->
              <ion-card class="transcript-card">
                <ion-card-header class="transcript-header">
                  <ion-card-title class="card-title">
                    <ion-icon :icon="micOutline" class="title-icon"></ion-icon>
                    Your Response
                  </ion-card-title>
                </ion-card-header>
                <ion-card-content class="transcript-content">
                  <!-- Audio Player -->
                  <div v-if="response.audio_url" class="audio-section">
                    <div class="audio-header">
                      <ion-icon :icon="playOutline" class="audio-icon"></ion-icon>
                      <span class="audio-label">Audio Recording</span>
                    </div>
                    <div class="audio-player">
                      <audio controls class="custom-audio">
                        <source
                          :src="response.audio_url"
                          type="audio/mpeg"
                        />
                        Your browser does not support audio playback.
                      </audio>
                    </div>
                  </div>

                  <!-- Transcript Text -->
                  <div class="transcript-section">
                    <div class="transcript-header-text">
                      <ion-icon :icon="documentOutline" class="transcript-icon"></ion-icon>
                      <span class="transcript-label">Transcript</span>
                    </div>
                    <div class="transcript-box">
                      {{ response.transcript || response.response?.assessment?.transcript || "No transcript available for this recording." }}
                    </div>
                  </div>
                </ion-card-content>
              </ion-card>

              <!-- Test Information -->
              <ion-card class="info-card">
                <ion-card-header class="info-header">
                  <ion-card-title class="card-title">
                    <ion-icon :icon="informationOutline" class="title-icon"></ion-icon>
                    Test Information
                  </ion-card-title>
                </ion-card-header>
                <ion-card-content class="info-content">
                  <ion-grid>
                    <ion-row>
                      <ion-col size="12" size-md="6" v-if="response.User">
                        <div class="info-section">
                          <h3 class="info-section-title">Test Taker</h3>
                          <div class="participant-info">
                            <div class="participant-avatar" v-if="response.User.avatar_url">
                              <img :src="response.User.avatar_url" :alt="response.User.username" />
                            </div>
                            <div class="participant-details">
                              <p class="participant-name">{{ response.User.first_name || response.User.username }}</p>
                              <p class="participant-username">@{{ response.User.username }}</p>
                            </div>
                          </div>
                        </div>
                      </ion-col>
                      <ion-col size="12" size-md="6">
                        <div class="info-section">
                          <h3 class="info-section-title">Assessment Details</h3>
                          <div class="assessment-meta">
                            <div class="meta-item">
                              <span class="meta-label">Test Type:</span>
                              <span class="meta-value">IELTS Speaking</span>
                            </div>
                            <div class="meta-item" v-if="response.response?.assessment?.id">
                              <span class="meta-label">Assessment ID:</span>
                              <span class="meta-value">{{ response.response.assessment.id.slice(0, 12) }}...</span>
                            </div>
                          </div>
                        </div>
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </ion-card-content>
              </ion-card>

              <!-- Vocabulary Analysis -->
              <ion-card v-if="response.response?.assessment?.vocabularyLevel" class="vocabulary-card">
                <ion-card-header class="vocabulary-header">
                  <ion-card-title class="card-title">
                    <ion-icon :icon="libraryOutline" class="title-icon"></ion-icon>
                    Vocabulary Analysis
                  </ion-card-title>
                  <div class="vocab-summary">
                    <ion-badge 
                      :color="getCefrColor(response.response.assessment.vocabularyLevel.meta?.grade)"
                      class="vocab-level-badge"
                    >
                      {{ response.response.assessment.vocabularyLevel.meta?.grade || "N/A" }} Level
                    </ion-badge>
                    <span class="word-count">{{ response.response.assessment.vocabularyLevel.meta?.words || 0 }} words</span>
                  </div>
                </ion-card-header>
                <ion-card-content class="vocabulary-content">
                  <!-- Top Words Only -->
                  <div class="top-words-section">
                    <h3 class="section-title">Most Used Words</h3>
                    <div class="words-grid">
                      <div
                        v-for="([word, count], index) in getTopWords(8)"
                        :key="index"
                        class="word-item"
                      >
                        <span class="word-text">{{ word }}</span>
                        <span class="word-count">{{ count }}</span>
                      </div>
                    </div>
                  </div>
                </ion-card-content>
              </ion-card>

            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
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
  documentOutline,
  informationOutline,
  chatbubblesOutline,
  speedometerOutline,
  libraryOutline,
  helpCircleOutline,
  analyticsOutline
} from "ionicons/icons";
import { endpoints } from "@/utils/apiEndpoints";

const route = useRoute();
const responseId = ref(route.params.id);
const response = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(() => {
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
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
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
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
      feedback: assessment.fluencyFeedback || "Your speech flow and logical organization of ideas."
    },
    {
      name: "Pronunciation",
      score: assessment.pronunciation || 0,
      color: "success", 
      icon: volumeHighOutline,
      feedback: assessment.pronunciationFeedback || "Clarity and accuracy of sound production."
    },
    {
      name: "Lexical Resource",
      score: assessment.vocabulary || 0,
      color: "tertiary",
      icon: libraryOutline,
      feedback: assessment.vocabularyFeedback || "Range and accuracy of vocabulary usage."
    },
    {
      name: "Grammar",
      score: assessment.grammar || 0,
      color: "warning",
      icon: textOutline,
      feedback: assessment.grammarFeedback || "Grammatical range and accuracy in your responses."
    }
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

  return response.value.response.assessment.vocabularyLevel.words.slice(0, count);
}
</script>

<style scoped>
/* ========== IELTS-Style Modern Assessment Design ========== */

/* Global Variables */
:root {
  --ielts-primary: #0066cc;
  --ielts-secondary: #004499;
  --ielts-accent: #ff6b35;
  --ielts-success: #00c851;
  --ielts-warning: #ffbb33;
  --ielts-danger: #ff4444;
  --ielts-light: #f8f9fa;
  --ielts-dark: #2c3e50;
  --ielts-text: #34495e;
  --ielts-border: #e3e6ea;
  --ielts-shadow: 0 2px 12px rgba(0, 102, 204, 0.08);
  --ielts-shadow-hover: 0 4px 20px rgba(0, 102, 204, 0.12);
}

/* Header Styling */


/* Main Content */
.assessment-grid {
  padding: 20px 16px;
  max-width: 100%;
}

/* Loading State */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.loading-card {
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: var(--ielts-shadow);
  border: 1px solid var(--ielts-border);
}

.loading-spinner {
  --color: var(--ielts-primary);
  margin-bottom: 1rem;
  transform: scale(1.2);
}

.loading-text {
  color: var(--ielts-text);
  font-weight: 500;
  margin: 0;
  font-size: 1.1rem;
}

/* Error State */
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.error-card {
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: var(--ielts-shadow);
  border: 1px solid #ffebee;
  max-width: 400px;
}

.error-icon {
  font-size: 4rem;
  color: var(--ielts-danger);
  margin-bottom: 1.5rem;
}

.error-title {
  color: var(--ielts-dark);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.error-message {
  color: var(--ielts-text);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.retry-btn {
  --border-radius: 12px;
  --padding-start: 2rem;
  --padding-end: 2rem;
  font-weight: 500;
}

/* Assessment Report Container */
.assessment-report {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Report Header */
.report-header {
  text-align: center;
  padding: 10px;
  background: white;
  border-radius: 20px;
  box-shadow: var(--ielts-shadow);
  border: 1px solid var(--ielts-border);
}

.report-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--ielts-primary), var(--ielts-secondary));
  color: white;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.badge-icon {
  font-size: 1.2rem;
}

.report-title {
  color: var(--ielts-dark);
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.report-date {
  color: var(--ielts-text);
  font-size: 1rem;
  margin: 0;
  opacity: 0.8;
}

/* Score Overview Card */
.score-overview-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  box-shadow: var(--ielts-shadow-hover);
  border: none;
  overflow: hidden;
}

.score-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
}

.score-main {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.score-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.score-number {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.score-max {
  font-size: 1rem;
  opacity: 0.8;
  margin-top: -4px;
}

.score-info {
  flex: 1;
}

.score-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.cefr-level {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cefr-label {
  font-size: 1rem;
  opacity: 0.9;
}

.cefr-badge {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 8px;
  --padding-bottom: 8px;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 12px;
}

.speaking-stats {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.stat-value {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}



.info-btn {
  --color: rgba(255, 255, 255, 0.8);
  --background: rgba(255, 255, 255, 0.1);
  --border-radius: 12px;
  backdrop-filter: blur(10px);
}

/* Skills Card */
.skills-card {
  border-radius: 20px;
  box-shadow: var(--ielts-shadow);
  border: 1px solid var(--ielts-border);
  background: white;
}

.skills-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20px 20px 0 0;
  border-bottom: 1px solid var(--ielts-border);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--ielts-dark);
  font-weight: 600;
  font-size: 1.2rem;
}

.title-icon {
  font-size: 1.4rem;
  color: var(--ielts-primary);
}

.skills-content {
  padding: 2rem;
}

.skill-item {
  background: #fafbfc;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #f1f3f4;
  transition: all 0.3s ease;
}

.skill-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.1);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.skill-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.skill-icon {
  font-size: 1.3rem;
}

.skill-name {
  font-weight: 600;
  color: var(--ielts-dark);
  font-size: 1rem;
}

.skill-score {
  font-weight: 700;
  color: var(--ielts-primary);
  font-size: 1.1rem;
}

.skill-progress {
  margin-bottom: 1rem;
}

.custom-progress {
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
}

.skill-feedback {
  color: var(--ielts-text);
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
  opacity: 0.8;
}

/* Feedback Card */
.feedback-card {
  border-radius: 20px;
  box-shadow: var(--ielts-shadow);
  border: 1px solid var(--ielts-border);
  background: white;
}

.feedback-header {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 20px 20px 0 0;
  border-bottom: 1px solid var(--ielts-border);
}

.feedback-content {
  padding: 2rem;
}

.feedback-text {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid var(--ielts-border);
  border-radius: 16px;
  padding: 1.5rem;
  line-height: 1.6;
  color: var(--ielts-text);
  font-size: 1rem;
  margin: 0;
}

/* Questions Card */
.questions-card {
  border-radius: 20px;
  box-shadow: var(--ielts-shadow);
  border: 1px solid var(--ielts-border);
  background: white;
}

.questions-header {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-radius: 20px 20px 0 0;
  border-bottom: 1px solid var(--ielts-border);
}

.questions-content {
  padding: 2rem;
}

.question-part {
  margin-bottom: 2rem;
}

.question-part:last-child {
  margin-bottom: 0;
}

.part-title {
  font-weight: 600;
  color: var(--ielts-primary);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--ielts-border);
}

.question-item {
  background: #fafbfc;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border: 1px solid var(--ielts-border);
}

.question-item:last-child {
  margin-bottom: 0;
}

.question-text {
  color: var(--ielts-text);
  line-height: 1.6;
  white-space: pre-line;
}

/* Analysis Card */
.analysis-card {
  border-radius: 20px;
  box-shadow: var(--ielts-shadow);
  border: 1px solid var(--ielts-border);
  background: white;
}

.analysis-header {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-radius: 20px 20px 0 0;
  border-bottom: 1px solid var(--ielts-border);
}

.analysis-content {
  padding: 2rem;
}

.analysis-item {
  background: #fafbfc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--ielts-border);
  text-align: center;
  transition: all 0.3s ease;
}

.analysis-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.1);
}

.analysis-label {
  font-size: 0.9rem;
  color: var(--ielts-text);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.analysis-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ielts-primary);
}

/* Transcript Card */
.transcript-card {
  border-radius: 20px;
  box-shadow: var(--ielts-shadow);
  border: 1px solid var(--ielts-border);
  background: white;
}

.transcript-header {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-radius: 20px 20px 0 0;
  border-bottom: 1px solid var(--ielts-border);
}

.transcript-content {
  padding: 2rem;
}

.audio-section {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--ielts-border);
}

.audio-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.audio-icon {
  font-size: 1.2rem;
  color: var(--ielts-primary);
}

.audio-label {
  font-weight: 600;
  color: var(--ielts-dark);
}

.custom-audio {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  background: white;
  border: 1px solid var(--ielts-border);
}

.transcript-section {
  background: #fafbfc;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--ielts-border);
}

.transcript-header-text {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.transcript-icon {
  font-size: 1.2rem;
  color: var(--ielts-primary);
}

.transcript-label {
  font-weight: 600;
  color: var(--ielts-dark);
}

.transcript-box {
  background: white;
  border: 1px solid var(--ielts-border);
  border-radius: 12px;
  padding: 1.5rem;
  line-height: 1.7;
  color: var(--ielts-text);
  font-size: 1rem;
  min-height: 120px;
}

/* Info Card */
.info-card {
  border-radius: 20px;
  box-shadow: var(--ielts-shadow);
  border: 1px solid var(--ielts-border);
  background: white;
}

.info-header {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-radius: 20px 20px 0 0;
  border-bottom: 1px solid var(--ielts-border);
}

.info-content {
  padding: 2rem;
}

.info-section {
  background: #fafbfc;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--ielts-border);
}

.info-section-title {
  color: var(--ielts-dark);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.participant-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.participant-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--ielts-primary);
}

.participant-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.participant-name {
  font-weight: 600;
  color: var(--ielts-dark);
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.participant-username {
  color: var(--ielts-text);
  margin: 0;
  opacity: 0.7;
}

.assessment-meta {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-label {
  color: var(--ielts-text);
  font-weight: 500;
}

.meta-value {
  color: var(--ielts-dark);
  font-weight: 600;
}

/* Vocabulary Analysis Card */
.vocabulary-card {
  border-radius: 20px;
  box-shadow: var(--ielts-shadow);
  border: 1px solid var(--ielts-border);
  background: white;
}

.vocabulary-header {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 20px 20px 0 0;
  border-bottom: 1px solid var(--ielts-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vocab-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.vocab-level-badge {
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 6px;
  --padding-bottom: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 8px;
}

.word-count {
  color: var(--ielts-text);
  font-size: 0.9rem;
  font-weight: 500;
}

.vocabulary-content {
  padding: 2rem;
}

.vocab-distribution {
  margin-bottom: 2rem;
}

.distribution-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.distribution-item {
  background: #fafbfc;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid var(--ielts-border);
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.level-name {
  font-weight: 600;
  color: var(--ielts-dark);
}

.level-percentage {
  font-weight: 600;
  color: var(--ielts-primary);
  font-size: 0.9rem;
}

.level-progress {
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.top-words-section {
  margin-top: 2rem;
}

.words-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.word-item {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid var(--ielts-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.word-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 102, 204, 0.1);
}

.word-text {
  font-weight: 500;
  color: var(--ielts-dark);
  font-size: 0.9rem;
}

.word-count {
  background: var(--ielts-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .assessment-grid {
    padding: 16px 12px;
  }
  
  .report-header {
    padding: 10px;
  }
  
  .report-title {
    font-size: 1.5rem;
  }
  
  .score-main {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .score-circle {
    width: 100px;
    height: 100px;
  }
  
  .score-number {
    font-size: 2rem;
  }
  
  .skills-content,
  .feedback-content,
  .transcript-content,
  .info-content {
    padding: 1.5rem;
  }
  
  .skill-item,
  .audio-section,
  .transcript-section,
  .info-section {
    padding: 1rem;
  }
  
  .participant-info {
    flex-direction: column;
    text-align: center;
  }
  
  .vocab-summary {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .words-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .speaking-stats {
    gap: 0.75rem;
  }
  
  .stat-item {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .card-title {
    font-size: 1.1rem;
  }
  
  .skill-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .meta-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}

/* Animation and Transitions */
ion-card {
  transition: all 0.3s ease;
}

ion-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--ielts-shadow-hover);
}

.score-circle {
  animation: scoreAppear 1s ease-out;
}

@keyframes scoreAppear {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.skill-item {
  animation: skillSlideIn 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.skill-item:nth-child(1) { animation-delay: 0.1s; }
.skill-item:nth-child(2) { animation-delay: 0.2s; }
.skill-item:nth-child(3) { animation-delay: 0.3s; }
.skill-item:nth-child(4) { animation-delay: 0.4s; }

@keyframes skillSlideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
