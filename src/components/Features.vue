<script setup>
import { chevronForwardOutline } from 'ionicons/icons';

import { ref, computed } from 'vue';
defineProps({
  title: String,
  link: String,
  icon: String,
})


</script>

<template>
  <ion-card :router-link="link" class="w-full mx-auto rounded-lg ion-padding-horizontal bg-gray-800 text-white shadow-none border-t-0 py-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-x-3">
        <img :src="icon" alt="" class="w-[50px] h-[50px]  p-[5px] rounded-xl">
         <span class="text-xl truncate text-white font-bold">{{ title }}</span>
    </div>
<ion-icon :icon="chevronForwardOutline" class="size-6 text-gray-500"></ion-icon>
    </div>
  </ion-card>
</template>
