<template>
  <div 
    class="bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
    :class="{ 'p-3': compact }"
    @click="$emit('click')"
  >
    <div class="flex items-center space-x-3" :class="{ 'space-x-2': compact }">
      <div 
        class="p-3 rounded-xl text-white flex items-center justify-center"
        :class="[color, { 'p-2': compact }]"
      >
        <component :is="iconComponent" :size="compact ? 16 : 20" />
      </div>
      
      <div class="flex-1">
        <h4 
          class="font-semibold text-text-primary"
          :class="{ 'text-sm': compact, 'text-base': !compact }"
        >
          {{ title }}
        </h4>
        <p 
          class="text-text-secondary"
          :class="{ 'text-xs': compact, 'text-sm': !compact }"
        >
          {{ description }}
        </p>
      </div>
      
      <ChevronRight 
        :size="compact ? 14 : 16" 
        class="text-gray-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight, Mic, BarChart3, User } from 'lucide-vue-next';

interface Props {
  title: string;
  description: string;
  icon: string;
  color: string;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
});

const emit = defineEmits<{
  click: [];
}>();

const iconMap = {
  Mic,
  BarChart3,
  User
};

const iconComponent = computed(() => {
  return iconMap[props.icon as keyof typeof iconMap] || Mic;
});
</script>