<template>
  <ion-page>
    <ion-header>
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Speaking Test Packages</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <div class="payment-container">
        <!-- Header Section -->
        <div class="payment-header">
          <h1 class="page-title">Speaking Test Tarifflari</h1>
          <p class="page-subtitle">Tariff rejangizni tanlang</p>
        </div>

        <!-- Pricing Cards -->
        <div class="pricing-section">
          <!-- Basic Plan -->
          <div 
            class="pricing-card" 
            :class="{ 'selected': selectedPlan === 'basic' }"
            @click="selectPlan('basic')"
          >
            <div class="plan-header">
              <div class="plan-icon">
                <ion-icon :icon="micOutline" class="icon"></ion-icon>
              </div>
              <h2 class="plan-title">Basic Plan</h2>
              <p class="plan-duration">1 oy</p>
            </div>
            
            <div class="plan-price">
              <span class="price-amount">50,000</span>
              <span class="price-currency">UZS</span>
            </div>
            
            <div class="plan-features">
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle" color="success"></ion-icon>
                <span>5 ta Speaking Mock Test</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle" color="success"></ion-icon>
                <span>Multilevel Speaking format</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle" color="success"></ion-icon>
                <span>1 oylik muddatli</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle" color="success"></ion-icon>
                <span>AI feedback va baholash</span>
              </div>
            </div>
          </div>

          <!-- Premium Plan -->
          <div 
            class="pricing-card premium" 
            :class="{ 'selected': selectedPlan === 'premium' }"
            @click="selectPlan('premium')"
          >
            <div class="popular-badge">Eng ommabop</div>
            <div class="plan-header">
              <div class="plan-icon premium">
                <ion-icon :icon="trophyOutline" class="icon"></ion-icon>
              </div>
              <h2 class="plan-title">Premium Plan</h2>
              <p class="plan-duration">1 oy</p>
            </div>
            
            <div class="plan-price">
              <span class="price-amount">100,000</span>
              <span class="price-currency">UZS</span>
            </div>
            
            <div class="plan-features">
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle" color="success"></ion-icon>
                <span>Cheksiz Speaking Mock Tests</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle" color="success"></ion-icon>
                <span>Multilevel Speaking format</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle" color="success"></ion-icon>
                <span>1 oylik muddatli</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle" color="success"></ion-icon>
                <span>AI feedback va baholash</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle" color="success"></ion-icon>
                <span>Batafsil hisobotlar</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Plan Summary -->
        <div class="plan-summary" v-if="selectedPlan">
          <h3 class="summary-title">Tanlangan rejangiz</h3>
          <div class="summary-content">
            <div class="summary-info">
              <h4>{{ selectedPlan === 'basic' ? 'Basic Plan' : 'Premium Plan' }}</h4>
              <p>{{ selectedPlan === 'basic' ? '5 ta Mock Test' : 'Cheksiz Mock Tests' }}</p>
            </div>
            <div class="summary-price">
              {{ format('UZS ', selectedPlan === 'basic' ? 50000 : 100000, 0) }}
            </div>
          </div>
        </div>

        <!-- Contact Button -->
        <div class="contact-section">
          <ion-button 
            href="https://t.me/javlon_developer" 
            target="_blank" 
            expand="block" 
            class="contact-button"
            :disabled="!selectedPlan"
          >
            To'lov uchun bog'lanish
          </ion-button>
          <p class="contact-note">To'lov Telegram orqali amalga oshiriladi</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { 
  checkmarkCircle, 
  micOutline, 
  trophyOutline, 
} from 'ionicons/icons'
import { format } from 'money-formatter'

const selectedPlan = ref('basic')

function selectPlan(plan) {
  selectedPlan.value = plan
}
</script>

<style scoped>
.payment-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.payment-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px;
  border-radius: 16px;
  color: white;
  box-shadow: 0 8px 32px rgba(71, 85, 105, 0.15);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
  color: white;
}

.page-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.pricing-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.pricing-card {
  background: var(--ion-color-step-50);
  border-radius: 16px;
  padding: 24px;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  position: relative;
}

.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.pricing-card.selected {
  border-color: #10b981;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
}

.pricing-card.premium {
  background: linear-gradient(135deg, rgba(71, 85, 105, 0.05), rgba(51, 65, 85, 0.05));
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.plan-header {
  text-align: center;
  margin-bottom: 24px;
}

.plan-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #475569, #334155);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 4px 16px rgba(71, 85, 105, 0.2);
}

.plan-icon.premium {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.plan-icon .icon {
  font-size: 32px;
  color: white;
}

.plan-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px;
  color: var(--ion-color-step-850);
}

.plan-duration {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin: 0;
}

.plan-price {
  text-align: center;
  margin-bottom: 24px;
}

.price-amount {
  font-size: 36px;
  font-weight: 800;
  color: var(--ion-color-step-850);
}

.price-currency {
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-medium);
  margin-left: 4px;
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: var(--ion-color-step-700);
}

.feature-item ion-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.plan-summary {
  background: var(--ion-color-step-100);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border-left: 4px solid #10b981;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--ion-color-step-850);
}

.summary-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--ion-color-step-800);
}

.summary-info p {
  font-size: 14px;
  margin: 0;
  color: var(--ion-color-medium);
}

.summary-price {
  font-size: 20px;
  font-weight: 700;
  color: #10b981;
}

.contact-section {
  text-align: center;
}

.contact-button {
  --background:  #2563eb;
  --color: white;
  --border-radius: 12px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  --box-shadow: 0 4px 16px rgba(71, 85, 105, 0.3);
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.contact-button:hover:not([disabled]) {
  --box-shadow: 0 6px 20px rgba(71, 85, 105, 0.4);
  transform: translateY(-2px);
}

.contact-button[disabled] {
  opacity: 0.5;
}

.contact-note {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin: 0;
}

/* Dark theme adjustments */
@media (prefers-color-scheme: dark) {
  .pricing-card {
    background: var(--ion-color-step-100);
  }
  
  .plan-summary {
    background: var(--ion-color-step-150);
  }
}

/* Mobile responsiveness */
@media (max-width: 576px) {
  .payment-container {
    padding: 16px;
  }
  
  .payment-header {
    padding: 20px;
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .pricing-section {
    gap: 16px;
  }
  
  .pricing-card {
    padding: 20px;
  }
  
  .plan-icon {
    width: 56px;
    height: 56px;
  }
  
  .plan-icon .icon {
    font-size: 28px;
  }
  
  .price-amount {
    font-size: 32px;
  }
}
</style>