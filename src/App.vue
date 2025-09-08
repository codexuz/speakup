<template>
   <k-provider theme="ios">
      <ion-app>
    <ion-router-outlet />
  </ion-app>
   </k-provider>

</template>

<script setup>
import { useBackButton, useIonRouter } from '@ionic/vue';
const ionRouter = useIonRouter();
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { App } from '@capacitor/app';
import { changeStatusBar } from "@/lib/utils"

useBackButton(-1, () => {
      if (!ionRouter.canGoBack()) {
        App.exitApp();
      }
});


App.addListener('appUrlOpen', (event) => {
  const slug = event.url.split('.uz').pop();
 
  if (slug) {
    router.push(`/${slug}`);
  }

})


changeStatusBar("main");


</script>
