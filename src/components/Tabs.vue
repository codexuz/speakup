<script setup>
import { personOutline } from 'ionicons/icons';
import HomeIcon from './icons/HomeIcon.vue';
import Result from './icons/Result.vue';
import { Clapperboard, UserRound } from 'lucide-vue-next';

</script>

<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" color="main">
        <ion-tab-button tab="home" href="/home">
          <HomeIcon />
          <ion-label>Asosiy</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="videos" href="/videos">
          <Clapperboard stroke-width="1.8" />
          <ion-label>Video</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="result" href="/result">
          <Result />
          <ion-label>Natijam</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/profile">
          <UserRound stroke-width="1.8"/>
          <ion-label>Profilim</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>
