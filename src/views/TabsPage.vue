<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <Home :size="20" :class="{ 'text-ielts-blue': isActiveTab('home'), 'text-gray-500': !isActiveTab('home') }" />
          <ion-label
            :class="{ 'text-ielts-blue font-medium': isActiveTab('home'), 'text-gray-500': !isActiveTab('home') }">
            Home
          </ion-label>
        </ion-tab-button>

        <ion-tab-button tab="reports" href="/reports">
          <BarChart3 :size="20"
            :class="{ 'text-ielts-blue': isActiveTab('reports'), 'text-gray-500': !isActiveTab('reports') }" />
          <ion-label
            :class="{ 'text-ielts-blue font-medium': isActiveTab('reports'), 'text-gray-500': !isActiveTab('reports') }">
            Reports
          </ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/profile">
          <User :size="20"
            :class="{ 'text-ielts-blue': isActiveTab('profile'), 'text-gray-500': !isActiveTab('profile') }" />
          <ion-label
            :class="{ 'text-ielts-blue font-medium': isActiveTab('profile'), 'text-gray-500': !isActiveTab('profile') }">
            Profile
          </ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { Home, BarChart3, User } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { IonRouterOutlet } from '@ionic/vue';

const route = useRoute();

const isActiveTab = computed(() => (tabName: string) => {
  return route.path.includes(`/${tabName}`);
});
</script>

<style scoped>
ion-tab-button {
  --color: #6b7280;
  --color-selected: #1e88e5;
  transition: all 0.2s ease;
}

ion-tab-button:hover {
  transform: translateY(-1px);
}
</style>
