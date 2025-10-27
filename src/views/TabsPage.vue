<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <homeFilled class="text-blue-600" v-if="isActiveTab('home')"/>
          <homeOutline v-else/>
          <ion-label
            :class="{ 'text-blue-600 font-medium': isActiveTab('home'), 'text-gray-500': !isActiveTab('home') }">
            Home
          </ion-label>
        </ion-tab-button>

        <ion-tab-button tab="reports" href="/reports">
          <graphFilled class="text-blue-600" v-if="isActiveTab('reports')" />
          <graphOutline v-else />
          <ion-label
            :class="{ 'text-blue-600 font-medium': isActiveTab('reports'), 'text-gray-500': !isActiveTab('reports') }">
            Reports
          </ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/profile">
          <userFilled class="text-blue-600" v-if="isActiveTab('profile')" />
          <userOutline v-else />
          <ion-label
            :class="{ 'text-blue-600 font-medium': isActiveTab('profile'), 'text-gray-500': !isActiveTab('profile') }">
            Profile
          </ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { IonRouterOutlet } from '@ionic/vue';
import homeOutline from '@/assets/icons/homeOutline.vue';
import homeFilled from '@/assets/icons/homeFilled.vue';
import userFilled from '@/assets/icons/userFilled.vue';
import userOutline from '@/assets/icons/userOutline.vue';
import graphFilled from '@/assets/icons/graphFilled.vue';
import graphOutline from '@/assets/icons/graphOutline.vue';

const route = useRoute();

const isActiveTab = computed(() => (tabName: string) => {
  return route.path.includes(`/${tabName}`);
});
</script>

<style scoped>
ion-tab-button {
  transition: all 0.2s ease;
}

ion-tab-button:hover {
  transform: translateY(-1px);
}
</style>
