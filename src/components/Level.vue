<template>
                    <!-- A1 -->
                    <div v-if="level ==='A1'"   class="container mx-auto relative size-40">
                    <svg class="size-full rotate-180" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        <!-- Background Circle (Gauge) -->
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="1" stroke-dasharray="50 100" stroke-linecap="round"></circle>

                        <!-- Gauge Progress -->
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-blue-600 dark:text-blue-500" stroke-width="1.5" stroke-dasharray="5 100" stroke-linecap="round"></circle>
                    </svg>

                    <!-- Value Text -->
                    <div class="absolute top-9 start-1/2 transform -translate-x-1/2 text-center">
                        <span class="text-3xl font-bold text-blue-600 dark:text-blue-500">{{ score === '0' ? '?': score }}</span>
                        <span class="text-sm text-blue-600 dark:text-blue-500 block">{{level}}</span>
                    </div>
                    </div>
                    <!-- A1 -->  
                     
                     
                             <!-- A2 -->
                    <div v-if="level ==='A2'"   class="container mx-auto relative size-40">
                    <svg class="size-full rotate-180" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        <!-- Background Circle (Gauge) -->
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="1" stroke-dasharray="50 100" stroke-linecap="round"></circle>

                        <!-- Gauge Progress -->
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-blue-600 dark:text-blue-500" stroke-width="1.5" stroke-dasharray="15 100" stroke-linecap="round"></circle>
                    </svg>

                    <!-- Value Text -->
                    <div class="absolute top-9 start-1/2 transform -translate-x-1/2 text-center">
                        <span class="text-3xl font-bold text-blue-600 dark:text-blue-500">{{ score === '0' ? '?': score }}</span>
                        <span class="text-sm text-blue-600 dark:text-blue-500 block">{{level}}</span>
                    </div>
                    </div>
                    <!-- A2 -->  


                    <!-- B1 -->
                    <div v-if="level ==='B1'"   class="container mx-auto relative size-40">
                    <svg class="size-full rotate-180" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        <!-- Background Circle (Gauge) -->
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="1" stroke-dasharray="50 100" stroke-linecap="round"></circle>

                        <!-- Gauge Progress -->
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-blue-600 dark:text-blue-500" stroke-width="1.5" stroke-dasharray="25 100" stroke-linecap="round"></circle>
                    </svg>

                    <!-- Value Text -->
                    <div class="absolute top-9 start-1/2 transform -translate-x-1/2 text-center">
                        <span class="text-3xl font-bold text-blue-600 dark:text-blue-500">{{ score === '0' ? '?': score }}</span>
                        <span class="text-sm text-blue-600 dark:text-blue-500 block">{{level}}</span>
                    </div>
                    </div>
                    <!-- B1 -->  

                    <!-- B2 -->
                    <div v-if="level ==='B2'"   class="container mx-auto relative size-40">
                    <svg class="size-full rotate-180" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        <!-- Background Circle (Gauge) -->
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="1" stroke-dasharray="50 100" stroke-linecap="round"></circle>

                        <!-- Gauge Progress -->
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-blue-600 dark:text-blue-500" stroke-width="1.5" stroke-dasharray="35 100" stroke-linecap="round"></circle>
                    </svg>

                    <!-- Value Text -->
                    <div class="absolute top-9 start-1/2 transform -translate-x-1/2 text-center">
                        <span class="text-3xl font-bold text-blue-600 dark:text-blue-500">{{ score === '0' ? '?': score }}</span>
                        <span class="text-sm text-blue-600 dark:text-blue-500 block">{{level}}</span>
                    </div>
                    </div>
                    <!-- B2 -->  

                    <!-- C1 -->
                  <div v-if="level ==='C1'"   class="container mx-auto relative size-40">
                    <svg class="size-full rotate-180" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        <!-- Background Circle (Gauge) -->
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="1" stroke-dasharray="50 100" stroke-linecap="round"></circle>

                        <!-- Gauge Progress -->
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-blue-600 dark:text-blue-500" stroke-width="1.5" stroke-dasharray="45 100" stroke-linecap="round"></circle>
                    </svg>

                    <!-- Value Text -->
                    <div class="absolute top-9 start-1/2 transform -translate-x-1/2 text-center">
                        <span class="text-3xl font-bold text-blue-600 dark:text-blue-500">{{ score === '0' ? '?': score }}</span>
                        <span class="text-sm text-blue-600 dark:text-blue-500 block">{{level}}</span>
                    </div>
                    </div>
                    <!-- C1 -->  


                     
                    <!-- C2 -->
                  <div v-if="level ==='C2'"   class="container mx-auto relative size-40">
                    <svg class="size-full rotate-180" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        <!-- Background Circle (Gauge) -->
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="1" stroke-dasharray="50 100" stroke-linecap="round"></circle>

                        <!-- Gauge Progress -->
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-blue-600 dark:text-blue-500" stroke-width="1.5" stroke-dasharray="50 100" stroke-linecap="round"></circle>
                    </svg>

                    <!-- Value Text -->
                    <div class="absolute top-9 start-1/2 transform -translate-x-1/2 text-center">
                        <span class="text-3xl font-bold text-blue-600 dark:text-blue-500">{{ score === '0' ? '?': score }}</span>
                        <span class="text-sm text-blue-600 dark:text-blue-500 block">{{level}}</span>
                    </div>
                    </div>
                    <!-- C2 -->  
</template>


<script setup>
defineProps({
    level: String,
    score: String
})

</script>