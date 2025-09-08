<template>
    <ion-page>
    <ion-header class="ion-no-border">
    <ion-toolbar color="main" mode="ios">
    <ion-buttons slot="start">
    <ion-back-button default-href="/settings" text=""></ion-back-button>
    </ion-buttons>
    <ion-title>Parolni almashtirish</ion-title>
    </ion-toolbar>
    </ion-header>
    <ion-content scroll-y="false">
    <ion-grid>
    <ion-row class="ion-justify-content-center">
    <ion-col size-sm="12" size-md="6" size-lg="5" size-xl="4">
      <img :src="passwordUpdate" class="mx-auto"/>
      <p class="text-center my-3 font-bold text-xl">Yangi parolni kiriting</p>
      <form @submit.prevent="changePassword">
    <ion-list class="bg-transparent ion-padding">
      <ion-input v-model="password" class="ion-margin-bottom"  label="Parol" label-placement="stacked" placeholder="Yangi parolni kiriting" type="password" required>
      <ion-icon slot="start" :icon="lockClosed" aria-hidden="true"></ion-icon>
      <ion-input-password-toggle slot="end"></ion-input-password-toggle>
    </ion-input>

    <ion-button type="submit" mode="ios" expand="block" shape="round">Yangilash</ion-button>
    </ion-list>
    </form>
    </ion-col>
    </ion-row>
    </ion-grid>
    </ion-content>
    </ion-page>
    </template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase.js'
import passwordUpdate from '@/assets/passwordUpdate.svg';
const password = ref('')
import { toastController } from '@ionic/vue';
const isDisabled = ref(false)
const showSpinner = ref(false)
import { lockClosed  } from 'ionicons/icons'; 


async function changePassword(){

    const toast = await toastController.create({ duration: 2500 })
    showSpinner.value = true
    const { data, error } = await supabase.auth.updateUser({
        password: password.value
    })
        if(error){
            toast.message = error
            await toast.present()
            showSpinner.value = false
            return
        }

        toast.message = "Parolingiz muvafaqqiyatli almashtirildi!"
        await toast.present()
        isDisabled.value = true
        showSpinner.value = false
}

</script>

<style scoped>
  ion-spinner {
    width: 20px;
    height: 20x;
  }
</style>