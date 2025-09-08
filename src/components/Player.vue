<script setup>
import { ref } from 'vue'
import { WaveSurferPlayer } from '@meersagor/wavesurfer-vue'
import { volumeHigh } from 'ionicons/icons'
const props = defineProps({
  audioURL: String
})


const options = ref({
  width: 150,
  height: 20,
  waveColor: '#a5a5a5',
  progressColor: '#0055ff',
  barGap: 2,
  barWidth: 1.6,
  barRadius: 30,
  barHeight: 1,
  fillParent: true,
  cursorWidth:0,
  duration: 80,
  url: props.audioURL,
})

const waveSurfer = ref(null)

const readyWaveSurferHandler = (ws) => {
  waveSurfer.value = ws
}
const isPlaying = ref(false)
function playPause(){
  isPlaying.value !==isPlaying.value

  if(!isPlaying.value){
    waveSurfer.value.play()
    isPlaying.value = true
  }
  else{
    waveSurfer.value.pause()
    isPlaying.value = false
  }

  waveSurfer.value.on('pause', () => {
    isPlaying.value = false
  })

  waveSurfer.value.on('play', () => {
    isPlaying.value = true
  })
  
  waveSurfer.value.on('finish', () => {
    waveSurfer.value.setTime(0)
})

}
</script>

<template>
  <div class="flex overflow-hidden gap-x-2">
    <button @click="playPause">
    <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="#0055ff" fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m3 10a1 1 0 0 1-.5.866l-3 1.732a1 1 0 0 1-1.5-.866v-3.464a1 1 0 0 1 1.5-.866l3 1.732A1 1 0 0 1 15 12" clip-rule="evenodd" />
</svg>

<svg v-if="isPlaying"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path fill="#0055ff" d="M15 16h-2V8h2m-4 8H9V8h2m1-6A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2" />
</svg>
  </button>
 <WaveSurferPlayer :options="options" 
       @waveSurfer="readyWaveSurferHandler" />
  </div>
   
</template>

