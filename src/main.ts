import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';
import { AVPlugin } from "vue-audio-visual";

/* Import and register all Ionic components used in the app */
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonItem,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonRadio,
  IonRadioGroup,
  IonToggle,
  IonRange,
  IonProgressBar,
  IonSpinner,
  IonAlert,
  IonActionSheet,
  IonLoading,
  IonModal,
  IonPopover,
  IonToast,
  IonFab,
  IonFabButton,
  IonFabList,
  IonChip,
  IonAvatar,
  IonThumbnail,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
  IonReorder,
  IonReorderGroup,
  IonPicker,
  IonNote,
  IonText,
  IonImg,
  IonBackButton,
  IonButtons,
  IonMenuButton,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonItemDivider,
  IonItemGroup,
  IonListHeader,
  IonAccordion,
  IonAccordionGroup,
  IonBreadcrumb,
  IonBreadcrumbs,
  IonFooter,
  IonInputOtp,
  IonRippleEffect,
  IonSkeletonText
} from '@ionic/vue';
import Avatar from '@/components/Avatar.vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
/* import '@ionic/vue/css/palettes/dark.system.css';*/

/* Theme variables */
import './theme/variables.css';

const app = createApp(App)
  .use(IonicVue, {
    mode: 'ios'
  })
  .use(router)
  .use(AVPlugin);

// Register all Ionic components globally
app.component('IonApp', IonApp);
app.component('IonRouterOutlet', IonRouterOutlet);
app.component('IonTabs', IonTabs);
app.component('IonTabBar', IonTabBar);
app.component('IonTabButton', IonTabButton);
app.component('IonLabel', IonLabel);
app.component('IonPage', IonPage);
app.component('IonHeader', IonHeader);
app.component('IonToolbar', IonToolbar);
app.component('IonTitle', IonTitle);
app.component('IonContent', IonContent);
app.component('IonGrid', IonGrid);
app.component('IonRow', IonRow);
app.component('IonCol', IonCol);
app.component('IonButton', IonButton);
app.component('IonIcon', IonIcon);
app.component('IonItem', IonItem);
app.component('IonList', IonList);
app.component('IonCard', IonCard);
app.component('IonCardHeader', IonCardHeader);
app.component('IonCardTitle', IonCardTitle);
app.component('IonCardSubtitle', IonCardSubtitle);
app.component('IonCardContent', IonCardContent);
app.component('IonInput', IonInput);
app.component('IonTextarea', IonTextarea);
app.component('IonSelect', IonSelect);
app.component('IonSelectOption', IonSelectOption);
app.component('IonCheckbox', IonCheckbox);
app.component('IonRadio', IonRadio);
app.component('IonRadioGroup', IonRadioGroup);
app.component('IonToggle', IonToggle);
app.component('IonRange', IonRange);
app.component('IonProgressBar', IonProgressBar);
app.component('IonSpinner', IonSpinner);
app.component('IonAlert', IonAlert);
app.component('IonActionSheet', IonActionSheet);
app.component('IonLoading', IonLoading);
app.component('IonModal', IonModal);
app.component('IonPopover', IonPopover);
app.component('IonToast', IonToast);
app.component('IonFab', IonFab);
app.component('IonFabButton', IonFabButton);
app.component('IonFabList', IonFabList);
app.component('IonChip', IonChip);
app.component('IonAvatar', IonAvatar);
app.component('IonThumbnail', IonThumbnail);
app.component('IonBadge', IonBadge);
app.component('IonSegment', IonSegment);
app.component('IonSegmentButton', IonSegmentButton);
app.component('IonRefresher', IonRefresher);
app.component('IonRefresherContent', IonRefresherContent);
app.component('IonInfiniteScroll', IonInfiniteScroll);
app.component('IonInfiniteScrollContent', IonInfiniteScrollContent);
app.component('IonSearchbar', IonSearchbar);
app.component('IonReorder', IonReorder);
app.component('IonReorderGroup', IonReorderGroup);
app.component('IonPicker', IonPicker);
app.component('IonNote', IonNote);
app.component('IonText', IonText);
app.component('IonImg', IonImg);
app.component('IonBackButton', IonBackButton);
app.component('IonButtons', IonButtons);
app.component('IonMenuButton', IonMenuButton);
app.component('IonItemSliding', IonItemSliding);
app.component('IonItemOptions', IonItemOptions);
app.component('IonItemOption', IonItemOption);
app.component('IonItemDivider', IonItemDivider);
app.component('IonItemGroup', IonItemGroup);
app.component('IonListHeader', IonListHeader);
app.component('IonAccordion', IonAccordion);
app.component('IonAccordionGroup', IonAccordionGroup);
app.component('IonBreadcrumb', IonBreadcrumb);
app.component('IonBreadcrumbs', IonBreadcrumbs);
app.component('IonFooter', IonFooter);  
app.component('IonRippleEffect', IonRippleEffect);
app.component('IonInputOtp', IonInputOtp);
app.component('IonSkeletonText', IonSkeletonText);
router.isReady().then(() => {
  app.mount('#app');
});
