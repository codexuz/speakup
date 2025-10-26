<template>
  <div class="flex items-center justify-center space-x-1" :class="containerClass">
    <div 
      v-for="i in barCount" 
      :key="i"
      class="bg-ielts-blue rounded-full transition-all duration-150 ease-in-out"
      :class="barClass"
      :style="{
        height: isActive ? getRandomHeight() : minHeight,
        animationDelay: `${i * 0.1}s`,
        animationDuration: `${getRandomDuration()}ms`
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

interface Props {
  isActive?: boolean;
  barCount?: number;
  minHeight?: string;
  maxHeight?: string;
  barWidth?: string;
  color?: string;
  containerClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  barCount: 12,
  minHeight: '8px',
  maxHeight: '48px',
  barWidth: 'w-1',
  color: 'bg-ielts-blue',
  containerClass: 'h-16'
});

const animationInterval = ref<NodeJS.Timeout | null>(null);
const heights = ref<string[]>([]);

const barClass = computed(() => `${props.barWidth} ${props.color}`);

const getRandomHeight = () => {
  const min = parseInt(props.minHeight.replace('px', ''));
  const max = parseInt(props.maxHeight.replace('px', ''));
  return `${Math.random() * (max - min) + min}px`;
};

const getRandomDuration = () => {
  return Math.random() * 800 + 600; // 600-1400ms
};

const updateHeights = () => {
  if (props.isActive) {
    heights.value = Array.from({ length: props.barCount }, () => getRandomHeight());
  } else {
    heights.value = Array.from({ length: props.barCount }, () => props.minHeight);
  }
};

onMounted(() => {
  updateHeights();
  
  if (props.isActive) {
    animationInterval.value = setInterval(updateHeights, 200);
  }
});

onUnmounted(() => {
  if (animationInterval.value) {
    clearInterval(animationInterval.value);
  }
});

// Watch for isActive changes
const startAnimation = () => {
  if (props.isActive && !animationInterval.value) {
    animationInterval.value = setInterval(updateHeights, 200);
  } else if (!props.isActive && animationInterval.value) {
    clearInterval(animationInterval.value);
    animationInterval.value = null;
    updateHeights();
  }
};

// React to prop changes
import { watch } from 'vue';
watch(() => props.isActive, startAnimation);
</script>

<style scoped>
@keyframes wave {
  0%, 100% { 
    transform: scaleY(0.5); 
  }
  50% { 
    transform: scaleY(1.5); 
  }
}

.animate-wave {
  animation: wave 1.5s ease-in-out infinite;
}
</style>