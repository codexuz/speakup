<template>
  <div 
    class="avatar-container"
    :class="[
      sizeClass,
      shapeClass,
      { 'avatar-clickable': clickable }
    ]"
    :style="avatarStyle"
    @click="handleClick"
  >
    <!-- Image Avatar -->
    <img 
      v-if="src && !imageError" 
      :src="src" 
      :alt="alt || `${firstName}'s avatar`"
      class="avatar-image"
      @error="onImageError"
      @load="onImageLoad"
    />
    
    <!-- Loading State -->
    <div v-else-if="loading" class="avatar-loading">
      <div class="loading-spinner"></div>
    </div>
    
    <!-- Generated Letter Avatar -->
    <div v-else class="avatar-letter">
      {{ avatarLetter }}
    </div>
    
    <!-- Status Badge -->
    <div 
      v-if="showStatus && status" 
      class="status-badge"
      :class="`status-${status}`"
    ></div>
    
    <!-- Edit Button -->
    <button 
      v-if="editable" 
      class="edit-button"
      @click.stop="$emit('edit')"
      :title="editTooltip"
    >
      <Camera :size="editIconSize" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Camera } from 'lucide-vue-next';

interface Props {
  firstName: string;
  lastName?: string;
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'rounded' | 'square';
  color?: 'auto' | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink' | 'indigo';
  textColor?: string;
  backgroundColor?: string;
  clickable?: boolean;
  editable?: boolean;
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
  loading?: boolean;
  editTooltip?: string;
}

const props = withDefaults(defineProps<Props>(), {
  lastName: '',
  alt: '',
  size: 'md',
  shape: 'circle',
  color: 'auto',
  textColor: '',
  backgroundColor: '',
  clickable: false,
  editable: false,
  showStatus: false,
  loading: false,
  editTooltip: 'Change avatar'
});

const emit = defineEmits<{
  click: [event: MouseEvent];
  edit: [];
  imageLoad: [];
  imageError: [];
}>();

const imageError = ref(false);

// Computed properties
const avatarLetter = computed(() => {
  return props.firstName.charAt(0).toUpperCase() || '?';
});

const sizeClass = computed(() => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-24 h-24 text-2xl'
  };
  return sizes[props.size];
});

const shapeClass = computed(() => {
  const shapes = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none'
  };
  return shapes[props.shape];
});

const editIconSize = computed(() => {
  const iconSizes = {
    xs: 8,
    sm: 10,
    md: 12,
    lg: 14,
    xl: 16,
    '2xl': 18
  };
  return iconSizes[props.size];
});

// Generate color based on first name
const generateColor = computed(() => {
  if (props.color !== 'auto') {
    const predefinedColors = {
      blue: { bg: 'linear-gradient(135deg, oklch(0.65 0.15 258), oklch(0.70 0.12 200))', text: 'white' },
      green: { bg: 'linear-gradient(135deg, oklch(0.65 0.15 258), oklch(0.70 0.12 200))', text: 'white' },
      purple: { bg: 'linear-gradient(135deg, oklch(0.65 0.15 258), oklch(0.70 0.12 200))', text: 'white' },
      orange: { bg: 'linear-gradient(135deg, oklch(0.65 0.15 258), oklch(0.70 0.12 200))', text: 'white' },
      red: { bg: 'linear-gradient(135deg, oklch(0.65 0.15 258), oklch(0.70 0.12 200))', text: 'white' },
      pink: { bg: 'linear-gradient(135deg, oklch(0.65 0.15 258), oklch(0.70 0.12 200))', text: 'white' },
      indigo: { bg: 'linear-gradient(135deg, oklch(0.65 0.15 258), oklch(0.70 0.12 200))', text: 'white' }
    };
    return predefinedColors[props.color] || predefinedColors.blue;
  }

  // Single blue to cyan gradient for all avatars
  return { bg: 'linear-gradient(135deg, oklch(0.65 0.15 258), oklch(0.70 0.12 200))', text: 'white' };
});

const avatarStyle = computed(() => {
  const generatedColor = generateColor.value;
  
  return {
    background: props.backgroundColor || generatedColor.bg,
    color: props.textColor || generatedColor.text,
  };
});

// Methods
const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event);
  }
};

const onImageError = () => {
  imageError.value = true;
  emit('imageError');
};

const onImageLoad = () => {
  imageError.value = false;
  emit('imageLoad');
};
</script>

<style scoped>
.avatar-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  background-color: #e5e7eb;
  color: #4b5563;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.avatar-clickable {
  cursor: pointer;
}

.avatar-clickable:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-letter {
  user-select: none;
  font-weight: 700;
}

.avatar-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 2px solid white;
}

.status-online {
  background-color: #10b981;
}

.status-offline {
  background-color: #9ca3af;
}

.status-away {
  background-color: #f59e0b;
}

.status-busy {
  background-color: #ef4444;
}

.edit-button {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background-color: var(--ielts-blue, #1e88e5);
  color: white;
  border-radius: 50%;
  padding: 0.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.edit-button:hover {
  background-color: var(--ielts-dark-blue, #1565c0);
}

/* Size-specific adjustments */
.w-6.h-6 .status-badge {
  width: 0.5rem;
  height: 0.5rem;
}

.w-8.h-8 .status-badge {
  width: 0.625rem;
  height: 0.625rem;
}

.w-12.h-12 .status-badge {
  width: 0.75rem;
  height: 0.75rem;
}

.w-16.h-16 .status-badge {
  width: 1rem;
  height: 1rem;
}

.w-20.h-20 .status-badge {
  width: 1.25rem;
  height: 1.25rem;
}

.w-24.h-24 .status-badge {
  width: 1.5rem;
  height: 1.5rem;
}

/* Hover effects */
.avatar-clickable:hover .avatar-letter {
  transform: scale(1.1);
}

.avatar-clickable:hover .avatar-image {
  transform: scale(1.05);
}

/* Focus states for accessibility */
.avatar-clickable:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--ielts-blue, #1e88e5), 0 0 0 4px rgba(30, 136, 229, 0.3);
}

.edit-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px white, 0 0 0 4px var(--ielts-blue, #1e88e5);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .avatar-container {
    border-color: #374151;
  }
  
  .status-badge {
    border-color: #1f2937;
  }
}
</style>