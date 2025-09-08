<template>
    <router-link :to="link" router-direction="forward" class="relative text-white flex items-center">
        <span v-if="messageCount >=1" class="bg-red-500 absolute bottom-[20px] left-[-5px] z-10 rounded-full px-[7px] flex items-center justify-center text-center" style="font-size: 12px;">{{ messageCount }}</span>
        <ion-icon :icon="notifications" class="size-4.5 bg-slate-800 mx-1 p-2 rounded-xl cursor-pointer" ></ion-icon>
    </router-link>

</template>

<script setup>
import { notifications } from 'ionicons/icons';

defineProps({
    show: Boolean,
    messageCount: String,
    link: String
})

</script>