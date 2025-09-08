<template>
    <ion-page>
        <ion-header>
            <ion-toolbar mode="ios">
                <ion-title>
                    Natijam
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
                            <template v-if="results && results.length">
                                <ion-card :router-link="`/result/${result.id}`" router-direction="forward" v-for="(result, index) in results" :key="result.id" class="rounded-lg p-2 mt-4" color="main">
                                    <ion-item :detail="true" lines="none">
                                        <ion-card-title>
                                            {{  result.title }}
                                        </ion-card-title>
                                        <ion-card-subtitle class="mx-2">
                                            | {{ formatDateFromISOString(result.sent_time) }}
                                        </ion-card-subtitle>
                                    </ion-item>
                                </ion-card>
                            </template>
                            <template v-else>
                                <div class="text-center text-2xl font-medium mt-6">{{ emptyMessage }}</div>
                            </template>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { loadingController } from '@ionic/vue';
import { useUser } from '@/composables/useUser';
const { user, loadUser } = useUser();
import { changeStatusBar } from "@/lib/utils"





const results = ref('');
const emptyMessage = ref('')

onMounted(async () => {
    changeStatusBar("primary");
    await loadUser();
    const loading = await loadingController.create({
        message: 'Yuklamoqda ...',
        cssClass: 'loader',
        mode: 'ios'
    });

    loading.present();

    const response = [];
    if(!response || response.length < 1){
        emptyMessage.value ="Natijalar yo'q"
    }
    results.value = response;
    loading.dismiss();
});

function formatDateFromISOString(isoString) {
    const date = new Date(isoString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const day = date.getDate();
    const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentyabr", "Oktabr", "Noyabr", "Dekabr"];
    const month = months[date.getMonth()];

    return `${hours}:${minutes}, ${day}-${month}`;
}
</script>

<style scoped>
ion-spinner {
    --spinner-color: #1c6dff;
}

ion-toolbar {
--background: #070404;
}

ion-item{
    --background: transparent
}
</style>
