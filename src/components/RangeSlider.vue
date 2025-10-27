<template>
  <div class="w-full px-5 py-4">
    <div class="relative pt-1">
      <!-- Range bar -->
      <div class="flex mb-2 items-center justify-between">
        <div class="text-xs font-semibold inline-block text-gray-400">
          Slow (0-60)
        </div>
        <div class="text-xs font-semibold inline-block text-gray-400">
          Normal (90-150)
        </div>
        <div class="text-xs font-semibold inline-block text-gray-400">
          Fast (150+)
        </div>
      </div>
      
      <!-- Progress bar background -->
      <div class="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-700">
        <!-- Slow zone (0-60) - Red -->
        <div class="w-[30%] bg-red-500"></div>
        
        <!-- Moderate zone (60-90) - Yellow -->
        <div class="w-[15%] bg-yellow-500"></div>
        
        <!-- Normal zone (90-150) - Green -->
        <div class="w-[30%] bg-green-500"></div>
        
        <!-- Fast zone (150+) - Blue -->
        <div class="w-[25%] bg-blue-500"></div>
      </div>
      
      <!-- Marker for current level -->
      <div class="relative h-2 mb-2">
        <div 
          class="absolute top-0 transform -translate-x-1/2 transition-all duration-500"
          :style="{ left: markerPosition + '%' }"
        >
          <div class="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      </div>
      
      <!-- Level indicators -->
      <div class="flex justify-between text-xs text-gray-500 mt-2">
        <span>0</span>
        <span>60</span>
        <span>90</span>
        <span>150</span>
        <span>200+</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  level: {
    type: Number,
    required: true,
    default: 0
  }
});

// Calculate marker position as percentage (0-100%)
// Map WPM (0-200+) to percentage (0-100%)
const markerPosition = computed(() => {
  const wpm = props.level;
  
  // Cap at 200 for display purposes
  const cappedWpm = Math.min(wpm, 200);
  
  // Convert to percentage
  return (cappedWpm / 200) * 100;
});
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
