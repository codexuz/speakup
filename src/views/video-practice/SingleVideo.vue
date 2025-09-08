<template>
    <ion-page>
        <ion-header mode="ios">
             <ion-toolbar mode="ios">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/home"></ion-back-button>
                </ion-buttons>
                <ion-title>{{ video.title }}</ion-title>
                </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding-vertical" :scroll-events="true">
            <VideoPlayer 
            v-if="video.url" 
            :videoSrc="video.url" 
            :captionsSrc="video.subtitle" 
            :autoplay="false" 
            :controls="true"/>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import { useRoute } from 'vue-router';
import VideoPlayer from "@/components/VideoPlayer.vue"
import { fetchSingleOfVideo } from '@/lib/appwrite';

const route = useRoute()

const video = ref({
    id: null,
    url: '',
    title: '',
    subtitle: ''
})
const {category, id} = route.params;

async function fetchVideo() {
video.value = await fetchSingleOfVideo(category, id);
}

fetchVideo()


</script>

<style scoped>
ion-toolbar{
  --background: #070404
}
</style>