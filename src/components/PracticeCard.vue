<script setup>
import { ref, computed } from 'vue';
defineProps({
  title: String,
  icon: String,
  bgColor: String,
  description: String,
  status: String
})


</script>

<template>
  <ion-card class="w-full h-[125px] items-start sm:w-[80%] mx-auto rounded-2xl bg-gray-800 text-white ion-padding-horizontal shadow-none py-5 relative">
   <span class="bg-slate-800 rounded-xl p-1 text-2xl ellipse">{{ icon }}</span>
   <p class=" mt-4 text-md text-gray-300 font-bold">{{ title }}</p>
  </ion-card>
</template>
