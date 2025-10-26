<template>
  <div class="w-full">
    <div v-if="showLabel" class="flex justify-between text-sm mb-2">
      <span class="font-medium text-text-primary">{{ label }}</span>
      <span class="text-text-secondary">{{ displayProgress }}</span>
    </div>
    
    <div 
      class="w-full bg-gray-200 rounded-full overflow-hidden"
      :class="heightClass"
    >
      <div 
        class="h-full rounded-full transition-all duration-700 ease-out"
        :class="colorClass"
        :style="{ width: percentage + '%' }"
      >
        <div v-if="animated" class="h-full w-full animate-pulse bg-white/20 rounded-full"></div>
      </div>
    </div>
    
    <div v-if="showSubLabel && subLabel" class="text-xs text-gray-500 mt-1">
      {{ subLabel }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  value: number;
  max?: number;
  label?: string;
  subLabel?: string;
  showLabel?: boolean;
  showSubLabel?: boolean;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showPercentage?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  label: '',
  subLabel: '',
  showLabel: true,
  showSubLabel: true,
  color: 'blue',
  size: 'md',
  animated: false,
  showPercentage: true
});

const percentage = computed(() => {
  return Math.min(Math.max((props.value / props.max) * 100, 0), 100);
});

const displayProgress = computed(() => {
  if (props.showPercentage) {
    return `${Math.round(percentage.value)}%`;
  }
  return `${props.value}/${props.max}`;
});

const heightClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-2';
    case 'lg': return 'h-4';
    default: return 'h-3';
  }
});

const colorClass = computed(() => {
  const colors = {
    blue: 'bg-gradient-to-r from-ielts-blue to-ielts-dark-blue',
    green: 'bg-gradient-to-r from-green-400 to-green-600',
    red: 'bg-gradient-to-r from-red-400 to-red-600',
    yellow: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
    indigo: 'bg-gradient-to-r from-indigo-400 to-indigo-600'
  };
  return colors[props.color];
});
</script>