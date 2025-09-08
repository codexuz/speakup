<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Share } from '@capacitor/share'
import { toastController } from '@ionic/vue'
import { personOutline, helpOutline, informationOutline, shareOutline, notificationsOutline, logOutOutline } from 'ionicons/icons'
import { useUser } from '@/composables/useUser'
import { changeStatusBar } from '@/lib/utils'

const router = useRouter()
const { user, loadUser, logout } = useUser()
const loading = ref(true)
const modal = ref(null)
const notificationsEnabled = ref(true)

onMounted(async () => {
  changeStatusBar('primary')
  await loadUser()
  loading.value = false
})

const dismiss = () => {
  modal.value?.$el.dismiss()
}

const handleLogout = async () => {
  try {
    await logout()
    dismiss()
    router.replace('/login')
  } catch (error) {
    const toast = await toastController.create({
      message: 'Chiqishda xatolik yuz berdi',
      duration: 2500,
      position: 'top',
      color: 'danger'
    })
    await toast.present()
  }
}

const shareApp = async () => {
  try {
    await Share.share({
      title: 'ExamOnline Edumo',
      text: 'Multilevel imtihoniga tayyorlanuvchilar uchun ilova',
      url: 'https://play.google.com/store/apps/details?id=uz.speakup.edumo',
      dialogTitle: 'Do\'stlaringiz bilan ulashing'
    })
  } catch (error) {
    console.error('Error sharing app:', error)
  }
}

const toggleNotifications = () => {
  notificationsEnabled.value = !notificationsEnabled.value
  // Here you can add logic to save notification preference
}

const navigateTo = (path) => {
  router.push(path, 'forward')
}

const openExternal = (url) => {
  window.open(url, '_blank')
}


</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-back-button default-href="/profile" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Sozlamalar</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="settings-container">
     

        <!-- Account Settings -->
        <div class="section pt-10">
          <h3 class="section-title">Hisobim</h3>
          <div class="settings-list">
            <div class="setting-item" @click="navigateTo('/update-profile')">
              <div class="setting-icon">
                <ion-icon :icon="personOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <h4>Profilni tahrirlash</h4>
                <p>Ism va ma'lumotlarni yangilash</p>
              </div>
              <ion-icon name="chevron-forward-outline" class="setting-arrow"></ion-icon>
            </div>

            <div class="setting-item" @click="openExternal('https://t.me/javlon_developer')">
              <div class="setting-icon support">
                <ion-icon :icon="informationOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <h4>Yordam so'rash</h4>
                <p>Telegram Support</p>
              </div>
              <ion-icon name="chevron-forward-outline" class="setting-arrow"></ion-icon>
            </div>

            <div class="setting-item" @click="shareApp">
              <div class="setting-icon share">
                <ion-icon :icon="shareOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <h4>Ilovani ulashish</h4>
                <p>Do'stlaringiz bilan ulashing</p>
              </div>
              <ion-icon name="chevron-forward-outline" class="setting-arrow"></ion-icon>
            </div>
          </div>
        </div>

        <!-- General Settings -->
        <div class="section">
          <h3 class="section-title">Umumiy</h3>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-icon notifications">
                <ion-icon :icon="notificationsOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <h4>Xabarnomalar</h4>
                <p>Push bildirishnomalar</p>
              </div>
              <ion-toggle 
                :checked="notificationsEnabled" 
                @ionChange="toggleNotifications"
                color="primary"
                mode="ios"
              ></ion-toggle>
            </div>
          </div>
        </div>

        <!-- Logout Section -->
        <div class="section">
          <div class="settings-list">
            <div class="setting-item logout" id="open-modal">
              <div class="setting-icon logout">
                <ion-icon :icon="logOutOutline"></ion-icon>
              </div>
              <div class="setting-content">
                <h4>Chiqish</h4>
                <p>Hisobdan chiqish</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- Logout Confirmation Modal -->
    <ion-modal ref="modal" trigger="open-modal" :initial-breakpoint="0.4" :breakpoints="[0, 0.4]">
      <ion-content class="modal-content">
        <div class="logout-modal">
          <div class="modal-header">
            <h2>Hisobdan chiqish</h2>
            <p>Hisobingizdan chiqishingizga ishonchingiz komilmi?</p>
          </div>
          
          <div class="modal-actions">
            <ion-button 
              @click="handleLogout" 
              color="primary" 
              expand="block" 
              class="logout-btn text-white"
            >
              Ha, chiqish
            </ion-button>
            
            <ion-button 
              @click="dismiss" 
              fill="clear" 
              color="light"
              expand="block" 
              class="cancel-btn mb-6"
            >
              Bekor qilish
            </ion-button>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<style scoped>
ion-toolbar {
  --background: #070404;
}

.settings-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.section {
  margin-bottom: 2rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 1rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border: 3px solid #6366f1;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.25rem 0;
}

.user-email {
  color: #9ca3af;
  margin: 0;
  font-size: 0.875rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e5e7eb;
  margin: 0 0 1rem 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.settings-list {
  background: #1f2937;
  border-radius: 0.75rem;
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #374151;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:hover {
  background: #374151;
}

.setting-item.logout {
  color: #ef4444;
}

.setting-item.logout:hover {
  background: #7f1d1d;
}

.setting-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6366f1;
  color: white;
  font-size: 1.25rem;
}

.setting-icon.support {
  background: #10b981;
}

.setting-icon.share {
  background: #8b5cf6;
}

.setting-icon.notifications {
  background: #f59e0b;
}

.setting-icon.faq {
  background: #06b6d4;
}

.setting-icon.logout {
  background: #ef4444;
}

.setting-content {
  flex: 1;
}

.setting-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.25rem 0;
}

.setting-content p {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

.setting-arrow {
  color: #6b7280;
  font-size: 1.25rem;
}

.modal-content {
  --background: #1f2937;
}

.logout-modal {
  padding: 2rem;
  text-align: center;
}

.modal-header {
  margin-bottom: 2rem;
}

.modal-icon {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.5rem 0;
}

.modal-header p {
  color: #9ca3af;
  margin: 0;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.logout-btn {
  --background: #ef4444;
  --background-hover: #dc2626;
}

.cancel-btn {
  --color: #6b7280;
}

ion-toggle {
  --track-background: #374151;
  --track-background-checked: #6366f1;
  --handle-background: #fff;
  --handle-background-checked: #fff;
}

@media (max-width: 768px) {
  .settings-container {
    padding: 0.75rem;
  }
  
  .user-info {
    padding: 1rem;
  }
  
  .setting-item {
    padding: 0.875rem 1rem;
  }
}
</style>