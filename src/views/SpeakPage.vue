<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserMedia } from '@vueuse/core'
import { AVMedia } from 'vue-audio-visual';
import { mic, play, stop, square } from 'ionicons/icons';

const { stream, enabled } = useUserMedia({
  constraints: { audio: true },
})

const showBar = ref(false)
const isRecording = ref(false)
const recordedAudio = ref(null)
const mediaRecorder = ref(null)
const audioChunks = ref([])

const startRecording = async () => {
  try {
    // Clear previous recording
    if (recordedAudio.value) {
      URL.revokeObjectURL(recordedAudio.value)
      recordedAudio.value = null
    }
    
    enabled.value = true
    audioChunks.value = []
    
    // Wait for stream to be available
    await new Promise(resolve => {
      const checkStream = () => {
        if (stream.value) {
          resolve()
        } else {
          setTimeout(checkStream, 100)
        }
      }
      checkStream()
    })
    
    showBar.value = true
    isRecording.value = true
    
    mediaRecorder.value = new MediaRecorder(stream.value)
    
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data)
      }
    }
    
    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' })
      const audioUrl = URL.createObjectURL(audioBlob)
      recordedAudio.value = audioUrl
    }
    
    mediaRecorder.value.start()
  } catch (error) {
    console.error('Error starting recording:', error)
    // Reset states on error
    enabled.value = false
    showBar.value = false
    isRecording.value = false
  }
}

const stopRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
    mediaRecorder.value.stop()
  }
  enabled.value = false
  showBar.value = false
  isRecording.value = false
}

const toggleRecording = () => {
  if (!isRecording.value) {
    startRecording()
  } else {
    stopRecording()
  }
}

const playRecording = () => {
  if (recordedAudio.value) {
    const audio = new Audio(recordedAudio.value)
    audio.play()
  }
}

onUnmounted(() => {
  if (mediaRecorder.value && isRecording.value) {
    stopRecording()
  }
  if (recordedAudio.value) {
    URL.revokeObjectURL(recordedAudio.value)
  }
})
</script>
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
       <ion-title>Speaking Tests</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content scroll-y="true">
      <div class="p-5">
        <div v-if="recordedAudio" class="mb-4">
          <h3 class="text-lg font-semibold mb-2">Recorded Audio</h3>
          <div class="flex items-center gap-3">
            <button 
              @click="playRecording" 
              class="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <ion-icon :icon="play" class="text-lg"></ion-icon>
              Play Recording
            </button>
            <audio :src="recordedAudio" controls class="flex-1"></audio>
          </div>
        </div>
        
        <div v-if="isRecording" class="text-center">
          <p class="text-lg text-red-500 mb-2">🔴 Recording in progress...</p>
          <p class="text-sm text-gray-600">Tap the button below to stop recording</p>
        </div>
        
        <div v-else-if="!recordedAudio" class="text-center">
          <p class="text-lg text-gray-700 mb-2">Ready to record</p>
          <p class="text-sm text-gray-600">Tap the microphone to start recording</p>
        </div>
      </div>
      <ion-footer class="ion-no-border">
      <ion-toolbar color="light" class="ion-padding">
        <div class="flex items-center justify-center py-5">
          <button 
            @click="toggleRecording" 
            class="shadow-none rounded-full w-[60px] h-[60px] flex justify-center items-center relative overflow-hidden"
            :class="isRecording ? 'bg-red-500' : 'bg-emerald-400'"
          >
             <div v-if="isRecording" class="pulse"></div>
             <ion-icon 
               v-show="!showBar" 
               :icon="isRecording ? square : mic" 
               class="text-3xl text-white"
             ></ion-icon>
           <div v-show="showBar">
            <AVMedia 
              :media="stream" 
              type="frequ" 
              :frequ-lnum="3" 
              :frequ-line-cap="true"  
              :line-width="6" 
              :canv-width="30" 
              :canv-height="30" 
              line-color="#FFF"
            />
          </div>
        </button>
        </div>
      </ion-toolbar>
    </ion-footer>
    </ion-content>
  </ion-page>
</template>
