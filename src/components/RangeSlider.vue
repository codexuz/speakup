<template>
  <div class="flex flex-col items-center justify-center w-full mt-10">
    <VueSpeedometer :minValue="0" :maxValue="200" :value="level"  startColor="#2E3440"
    endColor="#4C566A"/>
  </div>
  </template>
  
  <script setup>
import VueSpeedometer from "vue-speedometer"

  const props = defineProps({
  level: Number,
  })
  </script>
  
  