<template>
    <div>
      <video
        ref="videoPlayer"
        class="video-js vjs-default-skin mt-3"
        :data-setup="videoSetup"
      ></video>
      <div class="cue-list w-full">
        <div
          v-if="!loading"
          v-for="(cue, index) in cues"
          :key="index"
          @click="jumpToCue(index)"
          ref="cueElements"
          class="w-full flex items-start mb-1 gap-x-1 p-[10px]"
          :class="{ active: activeCueIndex === index }"
        >
          <p class="w-full" :class="{ active: activeCueIndex === index }">{{ cue.text + ' ' }}</p>
        </div>
        <div class="flex items-center justify-center" v-else>
              <ion-spinner name="lines"></ion-spinner>
          </div>
      </div>
          
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, onBeforeUnmount, useTemplateRef } from 'vue';
  import videojs from 'video.js';
  import 'videojs-youtube/dist/Youtube';
  import 'video.js/dist/video-js.min.css';
  
  const loading = ref(true);

  const props = defineProps({
    videoSrc: { type: String, required: true },
    captionsSrc: { type: String, default: '' },
    autoplay: { type: Boolean, default: false },
    controls: { type: Boolean, default: true }
  });
  
  const options = reactive({
    autoplay: props.autoplay,
    controls: props.controls
  });
  
  const videoPlayer = useTemplateRef("videoPlayer");
  const player = ref(null);
  const cues = ref([]);
  const activeCueIndex = ref(null);
  const addedTrack = ref('');
  const cueElements = ref([]);
  const fetchedCaption = ref('');

  const videoSetup = JSON.stringify({
    techOrder: ["youtube"],
    sources: [{ type: "video/youtube", src: props.videoSrc }]
  });
  
  // Function to load cues from text track
  function loadCues() {
    const textTrack = addedTrack.value?.track;
    if (textTrack && textTrack.cues) {
      cues.value = Array.from(textTrack.cues);
    } else {
      setTimeout(loadCues, 500);
    }
  }
  
  // Function to jump to a specific cue in the video
  function jumpToCue(index) {
    if (cues.value[index]) {
      player.value.currentTime(cues.value[index].startTime);
    }
  }
  
  // Helper function to format milliseconds into hh:mm:ss format
  function formatTime(milliseconds) {
    const date = new Date(milliseconds);
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
  
  onMounted( async () => {
    player.value = videojs(videoPlayer.value, options);
    const data = new Blob([props.captionsSrc], {type: 'text/vtt'});
    fetchedCaption.value = URL.createObjectURL(data);
    player.value.on('loadedmetadata', () => {
      if (props.captionsSrc) {
        addedTrack.value = player.value.addRemoteTextTrack(
          {
            kind: 'captions',
            src: fetchedCaption.value,
            srclang: 'en',
            label: 'English',
            default: true,
          },
          false
        );
        loadCues();
        loading.value = false
      }
    });
  
    player.value.on('timeupdate', () => {
      const currentTime = player.value.currentTime();
      activeCueIndex.value = cues.value.findIndex(
        (cue) => currentTime >= cue.startTime && currentTime <= cue.endTime
      );

      // Scroll the active cue into view
      if (activeCueIndex.value !== -1 && cueElements.value[activeCueIndex.value]) {
       // cueElements.value[activeCueIndex.value].scrollToTop()
        cueElements.value[activeCueIndex.value].scrollIntoView({
          behavior: 'smooth', // Smooth scrolling
          block: 'center',     // Align to the top
        });
      }
      
    });


  });
  
  onBeforeUnmount(() => {
    if (player.value) {
      player.value.dispose();
    }
  });
  </script>
  
  <style scoped>
  .video-js {
    width: 100%; /* Full width */
    position: fixed;
    top: 40px;
    height: auto; /* Auto height */
    aspect-ratio: 16 / 9; /* Common aspect ratio for videos */
  }
  
  .video-js .vjs-poster {
    background-size: contain; /* Adjusts to contain the image without cropping */
    background-position: center;
    background-repeat: no-repeat;
}

.cue-list{
  margin-top: calc(100% - 48%);
}

  .cue-list .active {
    background-color: rgb(55, 121, 243);
    padding: 1px;
    color: #f1eeee;
    cursor: pointer;
    padding: 5px;
  }
  </style>
  