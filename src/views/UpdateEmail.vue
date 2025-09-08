<template>
    <ion-page>
    <ion-header class="ion-no-border">
    <ion-toolbar color="main" mode="ios">
    <ion-buttons slot="start">
    <ion-back-button default-href="/settings" text=""></ion-back-button>
    </ion-buttons>
    <ion-title>Emailni almashtirish</ion-title>
    </ion-toolbar>
    </ion-header>
    <ion-content scroll-y="false">
    <ion-grid>
    <ion-row class="ion-justify-content-center">
    <ion-col size-sm="12" size-md="6" size-lg="5" size-xl="4">
      <img :src="emailUpdate" class="mx-auto"/>
      <p class="text-center my-3 font-bold text-xl">Yangi emailni kiriting</p>
      <form @submit.prevent="changePassword">
    <ion-list class="bg-transparent ion-padding">
    <ion-input v-model="email" class="ion-margin-bottom"  label="E-mail" label-placement="stacked" placeholder="Yangi emailni kiriting" required>
      <ion-icon slot="start" :icon="mail" aria-hidden="true"></ion-icon>

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
import emailUpdate from '@/assets/emailUpdate.svg';
const email = ref('')
import { toastController } from '@ionic/vue';
const isDisabled = ref(false)
const showSpinner = ref(false)
import {  mail } from 'ionicons/icons'; 


async function changePassword(){

    const toast = await toastController.create({ duration: 2500 })
    showSpinner.value = true
    const { data, error } = await supabase.auth.updateUser({
        email: email.value
    })
        if(error){
            toast.message = error
            await toast.present()
            showSpinner.value = false
            return
        }

        toast.message = "Email muvafaqqiyatli almashtirildi!"
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