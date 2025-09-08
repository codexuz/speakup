<template>
    <ion-card class="p-4 rounded-2xl" color="main">
        <ion-card-header>
        <ion-card-title>
         Multilevel Speaking
        </ion-card-title>
        <ion-card-subtitle>
           Yangilangan Multilevel imtihon formati
        </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
           <button class="bg-slate-700 text-white font-medium text-md px-5 py-3.5 rounded-full w-full">
           <ion-icon v-if="status !== 'paid'" :icon="lockClosed"></ion-icon> 
           Start Random Test
           </button>
        </ion-card-content>
        
    </ion-card>
</template>

<script setup>
import { chevronForwardCircle, lockClosed } from 'ionicons/icons';
defineProps({
 status: String
})
</script>