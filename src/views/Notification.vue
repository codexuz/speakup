<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="main" mode="ios">
          <ion-buttons slot="start">
            <ion-back-button default-href="/home" text=""></ion-back-button>
          </ion-buttons>
          <ion-title>
            Xabarnomalar
          </ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="12" size-md="8" size-lg="6" size-xl="4">
              <ion-list lines="none" :inset="true" class="ion-margin-top bg-transparent" mode="ios">
                <template v-if="messages.length > 0">
                  <ion-item :detail="true" v-for="(msg, index) in messages" :router-link="`/notifications/${msg.id}`">
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-7" slot="start" viewBox="0 0 24 24"><path fill="currentColor" d="M15.25 2.02h-6.5A6.76 6.76 0 0 0 2 8.77v6.46a6.76 6.76 0 0 0 6.75 6.75h6.5A6.76 6.76 0 0 0 22 15.23v-6.5a6.76 6.76 0 0 0-6.75-6.71m2 13.12a.5.5 0 0 1-.08.23a.26.26 0 0 1-.15.12a.5.5 0 0 1-.24 0H7.23c-.18 0-.33 0-.37-.09a.8.8 0 0 1 0-.57q.183-.444.47-.83a3.5 3.5 0 0 0 .78-1.92c0-2 0-2.28.82-3.26a3 3 0 0 1 .93-.72l.57-.28a1.24 1.24 0 0 0 .48-.4c.15-.178.25-.391.29-.62a.77.77 0 0 1 .26-.46a.74.74 0 0 1 .45-.15h.15a.9.9 0 0 1 .28 0a.8.8 0 0 1 .23.13a.68.68 0 0 1 .27.48c.044.2.126.39.24.56c.129.187.3.342.5.45l.55.27c.358.17.676.416.93.72c.82 1 .82 1.29.82 3.26c.078.735.37 1.43.84 2q.295.402.49.86a.34.34 0 0 1 .02.22zm-3.53 2.23c-.216.222-.48.392-.77.5a2.3 2.3 0 0 1-.94.17a3 3 0 0 1-.89-.16a2.32 2.32 0 0 1-1.21-1.16h4.25a2 2 0 0 1-.46.65z"/></svg>
                    <ion-label>{{ msg.title }}</ion-label>
                  </ion-item>
                </template>
                <template v-else>
                  <ion-item :detail="true" v-for="n in 3">
                    <ion-avatar slot="start">
                      <ion-skeleton-text :animated="true"></ion-skeleton-text>
                    </ion-avatar>
                    <ion-label>
                      <h3>
                        <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
                      </h3>
                    </ion-label>
                  </ion-item>
                </template>
              </ion-list>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { readMessages } from '@/supabase'
  import { chevronForwardOutline, chatbubbleEllipses } from 'ionicons/icons';
  const messages = ref([]);
  import { useUser } from '@/composables/useUser';
  const { loadUser } = useUser();
  const loading = ref(true);

  onMounted( async() => {
      await loadUser();
      messages.value = await readMessages();
      loading.value = false
  })
  </script>
  
  <style scoped>
   ion-item{
  --background: #1e293b;
  --padding-top: 8px;
  --padding-bottom: 8px;
  }
</style>