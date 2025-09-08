<template>
  <audio ref="playerInstance" :src="audioSrc"></audio>
  <div class="container px-2 py-[2px] rounded-full mx-auto flex items-center justify-center gap-x-3" :class="bgColor">
    <button @click="togglePlay">
      <svg v-if="!isPlaying" class="text-white" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10m-1.306-6.154l4.72-2.787c.781-.462.781-1.656 0-2.118l-4.72-2.787C9.934 7.706 9 8.29 9 9.214v5.573c0 .923.934 1.507 1.694 1.059" clip-rule="evenodd"/></svg>
      <svg v-if="isPlaying" class=" text-white" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10M8.076 8.617C8 8.801 8 9.034 8 9.5v5c0 .466 0 .699.076.883a1 1 0 0 0 .541.54c.184.077.417.077.883.077s.699 0 .883-.076a1 1 0 0 0 .54-.541c.077-.184.077-.417.077-.883v-5c0-.466 0-.699-.076-.883a1 1 0 0 0-.541-.54C10.199 8 9.966 8 9.5 8s-.699 0-.883.076a1 1 0 0 0-.54.541m5 0C13 8.801 13 9.034 13 9.5v5c0 .466 0 .699.076.883a1 1 0 0 0 .541.54c.184.077.417.077.883.077s.699 0 .883-.076a1 1 0 0 0 .54-.541c.077-.184.077-.417.077-.883v-5c0-.466 0-.699-.076-.883a1 1 0 0 0-.541-.54C15.199 8 14.966 8 14.5 8s-.699 0-.883.076a1 1 0 0 0-.54.541" clip-rule="evenodd"/></svg>
    </button>
    <ion-range :min="0" :max="audioDuration" color="light" class="mx-2" :value="currentTime" @ionChange="seek"></ion-range>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { IonRange } from '@ionic/vue';

const props = defineProps({
  audioSrc: String,
  bgColor: String
});

const isPlaying = ref(false);
const playerInstance = ref(null);

const currentTimeDisplay = ref('0:00');
const totalTimeDisplay = ref('0:00');
const currentTime = ref(0);
const audioDuration = ref(0);
let audio;

onMounted(() => {
  audio = playerInstance.value;

  audio.onended = () => {
    isPlaying.value = false;
  };

  audio.onpause = () => {
    isPlaying.value = false;
  };

  audio.ontimeupdate = () => {
    currentTime.value = audio.currentTime;
    const duration = audio.duration;

    const currentMinutes = Math.floor(currentTime.value / 60);
    const currentSeconds = Math.floor(currentTime.value % 60);
    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = Math.floor(duration % 60);

    currentTimeDisplay.value = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    totalTimeDisplay.value = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
  };

  audio.onloadedmetadata = () => {
    audioDuration.value = audio.duration;
    const duration = audio.duration;
    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = Math.floor(duration % 60);
    totalTimeDisplay.value = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
  };
});

function togglePlay() {
  if (!isPlaying.value) {
    audio.play();
    isPlaying.value = true;
  } else {
    audio.pause();
    isPlaying.value = false;
  }
}

function seek(event) {
  const seekTime = event.detail.value;
  audio.currentTime = seekTime;
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
}
</style>
