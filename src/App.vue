<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>

<style>
/* Global IELTS App Styles */
html, body {
  background-color: #f5f5f5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Ensure proper spacing and layout */
ion-content {
  --background: #f5f5f5;
}

/* Custom scrollbar styling */
.native-scrollbar {
  overflow-y: auto;
}

.native-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.native-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.native-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.native-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
