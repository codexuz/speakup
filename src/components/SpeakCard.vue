<template>
    <ion-card  router-direction="forward"  class="rounded-2xl p-2" color="main">
            <ion-item  lines="none" color="main">
                <ion-card-title>
                 {{ title }}
                </ion-card-title>
             <ion-icon v-if="status" :icon="chevronForwardCircle" slot="end"></ion-icon>
             <ion-icon v-else :icon="lockClosed" slot="end"></ion-icon>
            </ion-item>
    </ion-card>
</template>

<script setup>
import { chevronForwardCircle, lockClosed } from 'ionicons/icons';
defineProps({
    title: String,
    status: Boolean
})
</script>
