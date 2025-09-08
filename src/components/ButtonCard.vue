<template>
     <div class="w-full bg-gray-800 px-4 py-3 rounded-2xl flex items-center justify-between gap-x-2">
        <div class="flex items-center gap-x-5">
            <div class="bg-gray-900 w-[50px] h-[50px] flex items-center justify-center rounded-full text-[#7465E2]">
                <ion-icon :icon="iCon" class="text-xl"></ion-icon>
           </div>

            <div class="flex flex-col items-start">
                <span class="text-md font-bold">{{ title }}</span>
                <span class="text-sm text-gray-600">{{ subtitle }}</span>
            </div>
        </div>
        
        <ion-icon :icon="chevronForwardOutline" class="justify-end"></ion-icon>
      </div>
</template>

<script setup>
import { chevronForwardOutline } from 'ionicons/icons';
defineProps({
    iCon: String,
    title: String,
    subtitle: String
})

</script>