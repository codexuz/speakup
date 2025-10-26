<template>
  <ion-page>
    <ion-content class="ion-padding" :fullscreen="false">
      <div class="flex items-center gap-x-3">
        <Avatar :firstName="user.first_name || user.last_name || user.username  || 'User'" backgroundColor="dodgerblue" />
        <ion-text>
          <h2 class="poppins-semibold text-xl text-slate-800" style="line-height: 15px;">Welcome, {{ user.first_name || user.last_name || user.username  || 'User' }}!</h2>
          <p class="poppins-regular text-sm text-gray-600">Get ready for Multilevel Speaking</p>
        </ion-text>
      </div>
      
      <ion-grid class="ion-margin-top">
        <ion-row class="ion-margin-top items-center justify-center mx-auto gap-x-4 gap-y-2">
          <ion-col size="12" size-md="6" size-lg="6" size-sm="12">
            <ion-card class="mx-auto  shadow-none border border-gray-200 mt-4">
              <ion-card-content>  
                <ion-card-title class="poppins-bold text-2xl sm:text-3xl">
                  Master your speaking skills!
                </ion-card-title>
                <ion-card-subtitle class="poppins-regular my-2 text-gray-600">
                  Real Exam like Practice Sessions to Boost Your Confidence
                </ion-card-subtitle>
                <div class="grid grid-cols-3 gap-x-2">
                  <ion-badge class="p-2" color="primary">B2-C1</ion-badge>
                  <ion-badge class="p-2" color="dark">Time-Based</ion-badge>
                  <ion-badge class="p-2" color="success">Feedback</ion-badge>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <ion-row class="ion-margin-top items-center justify-center mx-auto gap-x-4 gap-y-2">
          <ion-col  size-md="6" size-lg="3" size="12">
           <ion-card @click="() => router.push('/speaking-practice')" class="mx-auto ion-activatable ripple-parent shadow-none border border-gray-200 mt-4">
              <ion-ripple-effect></ion-ripple-effect>
              <ion-card-content>  
                <div class="flex items-center justify-between">
                   <div class="flex items-center gap-x-2">  
                      <div class="bg-blue-100 p-2 rounded-xl">
                        <CirclePlay class="w-6 h-6 text-blue-600"/>
                      </div>
                      <ion-text class="block">
                        <p class="poppins-bold text-md text-slate-900" style="line-height: 12px;">Practice Speaking</p>
                        <ion-label class="text-ellipsis poppins-regular text-sm text-gray-600">Improve your fluency and confidence</ion-label>
                      </ion-text>
                  </div>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>
           <ion-col  size-md="6" size-lg="3" size="12">
            <ion-card @click="() => router.push('/speaking-mock')" router-direction="forward" class="mx-auto ion-activatable ripple-parent shadow-none border border-gray-200 mt-4">
              <ion-ripple-effect></ion-ripple-effect>
              <ion-card-content>  
                <div class="flex items-center justify-between">
                   <div class="flex items-center gap-x-2">  
                      <div class="bg-blue-100 p-2 rounded-xl">
                        <CirclePlay class="w-6 h-6 text-blue-600"/>
                      </div>
                      <ion-text class="block">
                        <p class="poppins-bold text-md text-slate-900" style="line-height: 12px;">Speaking  Mock</p>
                        <ion-label class="text-ellipsis poppins-regular text-sm text-gray-600">Experience real exam atmosphere</ion-label>
                      </ion-text>
                  </div>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <ion-row class="ion-margin-top items-center justify-center mx-auto gap-x-4 gap-y-2">
          <ion-col size="12" size-md="6" size-lg="6" size-sm="12">
            <ion-card href="https://t.me/speakup_edumo" target="_blank" class="card-bg mx-auto ion-activatable ripple-parent shadow-none border border-gray-200 mt-4">
               <ion-ripple-effect></ion-ripple-effect>
              <ion-card-content>  
                 <div class="flex items-center gap-x-3">
                    <ion-avatar  class="w-10 h-10">
                      <img :src="Logo" alt="SpeakUp Logo">
                    </ion-avatar>
                  <ion-card-title class="poppins-bold text-xl sm:text-3xl">
                  Welcome to speakUp!
                </ion-card-title>
                 </div>
                <ion-card-subtitle class="poppins-bold text-emerald-500 flex items-center gap-x-1 my-2">
                  JOIN NOW <ArrowUpRight class="w-4 h-4  inline-block"/>
                </ion-card-subtitle>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <ion-badge color="light" class="p-2 text-blue-500">@speakup_edumo</ion-badge>
                  <ion-badge color="light" class="p-2 text-green-500">Exam Tips</ion-badge>
                  <ion-badge color="light" class="p-2 text-red-500">Free Lessons</ion-badge>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  CirclePlay,
  ArrowUpRight,
  Quote,
  Flame
} from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Avatar from '@/components/Avatar.vue';
import Logo from '@/assets/icon.png'
const router = useRouter();
import { useUser } from '@/composables/useUser'
const { user } = useUser();


onMounted(() => {
});
</script>

<style scoped>
ion-card {
  --background: #f7f9ff;
  border-radius: 12px;
  border: 1px solid #e7ecff;

}


ion-card.card-bg {
  --background: #8cb7fc1f;
  border-radius: 12px;
  border: 1px solid #e7ecff;

}
</style>