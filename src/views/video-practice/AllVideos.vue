<template>
    <ion-page>
        <ion-header class="ion-no-border">
            <ion-toolbar mode="ios">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/home"></ion-back-button>
                </ion-buttons>
                <ion-title>All Videos</ion-title>
            </ion-toolbar>
            <ion-toolbar mode="ios" class="searchbar">
                <ion-row>
                    <ion-col size="10">
                        <ion-searchbar v-model="searchQuery" show-clear-button="never" placeholder="Search video"></ion-searchbar>
                    </ion-col>
                    <ion-col size="2">
                        <ion-fab-button size="small" color="dark" @click="openCategoryModal">
                            <ion-icon :icon="optionsOutline"></ion-icon>
                        </ion-fab-button>
                    </ion-col>
                </ion-row>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-margin-vertical ion-padding-vertical">
            <template v-if="filteredVideos && filteredVideos.length > 0">
                <ion-card class="video-card" v-for="video in filteredVideos" :key="video.$id" :router-link="`/videos/${video.$id}`">
                    <ion-img :src="video.thumb || PlaceHolder"></ion-img>
                    <ion-card-header>
                        <ion-badge color="danger">{{ video.category }}</ion-badge>
                        <ion-card-title class="text-ellipsis text-lg">{{ video.title }}</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        <ion-label>
                            <ion-icon :icon="eye"></ion-icon>
                            <span class="eye-text"> 
                               9K Views</span>
                        </ion-label>
                    </ion-card-content>
                </ion-card>
            </template>
            <template v-else-if="!filteredVideos && !filteredVideos.length > 0">
                <ion-text class="ion-text-center ion-margin-top">
                    <p>No videos found.</p>
                </ion-text>
            </template>
            <template v-else>
                <ion-card class="video-card" v-for="(video, index) in 5" :key="index">
                <ion-thumbnail class="w-full h-[200px]">
                    <ion-skeleton-text :animted="true"></ion-skeleton-text>
                </ion-thumbnail>
                <ion-card-header>
                    <ion-card-title>
                        <ion-skeleton-text :animted="true" class="w-[50px] h-[30px] rounded-full"></ion-skeleton-text>
                        <ion-skeleton-text :animted="true" class="mt-5 h-[20px]"></ion-skeleton-text>
                    </ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-label>
                        <ion-skeleton-text :animted="true" class="h-[10px] w-[60px]"></ion-skeleton-text>
                    </ion-label>
                </ion-card-content>
            </ion-card>
            </template>

            <!-- Category Filter Modal -->
            <ion-modal mode="ios" :initial-breakpoint="0.25" :breakpoints="[0, 0.25, 0.5, 0.75]" :is-open="isCategoryModalOpen" @didDismiss="closeCategoryModal">
                <ion-header :translucent="true">
                    <ion-toolbar class="rounded-t-xl">
                        <ion-title>Select Category</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click="closeCategoryModal">Close</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content>
                    <ion-list lines="none">
                        <ion-item detail="false" button @click="selectCategory('')">
                            <ion-label>All</ion-label>
                            <ion-icon color="primary" slot="end" :icon="selectedCategory === '' ? checkmark : ''"></ion-icon>
                        </ion-item>
                        <ion-item detail="false" button v-for="category in categories" :key="category" @click="selectCategory(category)">
                            <ion-label>{{ category }}</ion-label>
                            <ion-icon color="primary" slot="end" :icon="selectedCategory === category ? checkmark : ''"></ion-icon>
                        </ion-item>
                    </ion-list>
                </ion-content>
            </ion-modal>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchVideos } from '@/lib/appwrite';
import { eye, optionsOutline, checkmark } from 'ionicons/icons';
import PlaceHolder from "@/assets/podcast/placeholder.jpg"

const videos = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const categories = ref([]);
const isCategoryModalOpen = ref(false);

onMounted(async () => {
    videos.value = await fetchVideos();
    // Get unique categories from the fetched videos
    categories.value = [...new Set(videos.value.map(video => video.category))];
});

// Computed property to filter videos based on search query and selected category
const filteredVideos = computed(() => {
    return videos.value.filter(video => {
        const matchesCategory = selectedCategory.value ? video.category === selectedCategory.value : true;
        const matchesSearch = video.title.toLowerCase().includes(searchQuery.value.toLowerCase());
        return matchesCategory && matchesSearch;
    });
});

// Modal and Category Selection Functions
function openCategoryModal() {
    isCategoryModalOpen.value = true;
}

function closeCategoryModal() {
    isCategoryModalOpen.value = false;
}

function selectCategory(category) {
    selectedCategory.value = category;
    closeCategoryModal();
}
</script>

<style scoped>
ion-toolbar {
    --background: #070404;
}

ion-toolbar.searchbar {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    ion-row {
        background: #131212;
        border-radius: 25px;
        margin: 5px 5px 8px 5px;
        ion-col {
            padding: 0;
        }
    }
}

ion-fab-button {
    --box-shadow: none;
    ion-icon {
        font-size: 1.3rem;
    }
}

ion-searchbar {
    padding: 0 3px;
    margin: 1px 2px 3px 4px;
    --background: transparent;
    --box-shadow: none;
    --border-radius: 25px;
}

ion-card.video-card {
    --background: rgba(7, 1, 13, 0.25);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(7.5px);
    -webkit-backdrop-filter: blur(7.5px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 20px;
    margin-bottom: 20px;
    ion-card-header {
        display: block;
        ion-badge {
            display: inline-block;
            text-align: left;
            padding: 8px;
            border-radius: 30px;
            color: #fff;
        }
    }
    ion-card-content {
        ion-label {
            display: flex;
            align-content: center;
            align-items: center;
            column-gap: 5px;
            font-size: 14px;
            color: rgb(182, 180, 180);
            ion-icon {
                font-size: 20px;
            }
        }
    }
}

.eye-text{
    display: flex;
    align-items: center;
    column-gap: 3px;
}
</style>
