<script setup>
import Loader from '@/assets/loader.json'
import { Vue3Lottie } from 'vue3-lottie'


</script>
<template>
<div class="flex  flex-col items-center justify-center h-[80vh]">
    <Vue3Lottie class="mx-auto" :animationData="Loader" :height="200" :width="200" />
</div>
</template>