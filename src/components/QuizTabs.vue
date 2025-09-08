<script setup>
import { personOutline, homeOutline, barChartOutline } from 'ionicons/icons';
import HomeIcon from './icons/HomeIcon.vue';
import Result from './icons/Result.vue';
import Words from './icons/CourseIcon.vue';
import Sword from './icons/SwordIcon.vue';
</script>

<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="questions" href="/mock/questions">
          <HomeIcon/>
          <ion-label>Questions</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="answersheet" href="/mock/answersheet">
          <HomeIcon/>
          <ion-label>Questions</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<style scoped>
ion-tab-bar{
  --background: #070707
}
</style>

