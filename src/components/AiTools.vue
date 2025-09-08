<script setup>

defineProps({
    title: String,
    image: String,
})
</script>

<template>
    <ion-card  class="w-full bg-slate-800 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-70 rounded-3xl shadow">
    <ion-card-header>
      <ion-img  class="object-fit mx-auto w-18" :src="image"></ion-img>
      <ion-label class="text-center" color="light">
        {{ title }}
      </ion-label>
      <slot></slot>
    </ion-card-header>
  </ion-card>
</template>


