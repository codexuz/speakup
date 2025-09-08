import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import OneSignal from "onesignal-cordova-plugin";
import Avatar from "vue3-avatar";
import HighchartsVue from "highcharts-vue";
import { SafeArea } from "capacitor-plugin-safe-area";


SafeArea.getSafeAreaInsets().then((data) => {
  const { insets } = data;
  document.body.style.setProperty("--ion-safe-area-top", `${insets.top}px`);
});



import { IonicVue } from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";
import "./App.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import "@ionic/vue/css/palettes/dark.always.css";
/* Theme variables */
import "./theme/variables.css";

//Import konsta components

import {
  kProvider,
  kBlock,
  kBlockTitle,
  kNavbar,
  kNavbarBackLink,
  kTabbar,
  kMessages,
  kMessage,
  kMessagebar,
  kMessagesTitle,
  kLink,
  kIcon,
  kList,
  kListItem,
  kCard,
  kListInput,
  kDialog,
  kDialogButton,
  kTable,
  kTableCell,
  kTableBody,
  kTableRow,
  kTableHead,
} from "konsta/vue";

// Import Ionic-Vue components
import {
  IonSegmentView,
  IonImg,
  IonSegmentContent,
  IonAlert,
  IonTextarea,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCol,
  IonGrid,
  IonRow,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonBackButton,
  IonButtons,
  IonLoading,
  IonProgressBar,
  IonMenu,
  IonToast,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonSearchbar,
  IonAvatar,
  IonModal,
  IonRouterOutlet,
  IonApp,
  IonSpinner,
  IonToggle,
  IonList,
  IonListHeader,
  IonItemOption,
  IonItemOptions,
  IonBadge,
  IonFooter,
  IonAccordion,
  IonAccordionGroup,
  IonSelect,
  IonSelectOption,
  IonFab,
  IonFabButton,
  IonFabList,
  IonSkeletonText,
  IonPopover,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonCheckbox,
  IonInputPasswordToggle,
  IonRefresher,
  IonRefresherContent,
  IonChip,
  IonThumbnail,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInputOtp
} from "@ionic/vue";

const app = createApp(App)
  .use(IonicVue, {
    mode: "ios",
  })
  .use(router)
  .use(HighchartsVue);

// Register Ionic-Vue components global
app.component("ion-img", IonImg);
app.component("ion-segment-view", IonSegmentView);
app.component("ion-segment-content", IonSegmentContent);
app.component("ion-infinite-scroll", IonInfiniteScroll);
app.component("ion-infinite-scroll-content", IonInfiniteScrollContent);
app.component("ion-thumbnail", IonThumbnail);
app.component("avatar", Avatar);
app.component("ion-segment", IonSegment);
app.component("ion-segment-button", IonSegmentButton);
app.component("ion-text", IonText);
app.component("k-table", kTable);
app.component("k-table-head", kTableHead);
app.component("k-table-row", kTableRow);
app.component("k-table-cell", kTableCell);
app.component("k-table-body", kTableBody);
app.component("k-dialog", kDialog);
app.component("k-dialog-button", kDialogButton);
app.component("k-list-input", kListInput);
app.component("k-card", kCard);
app.component("k-link", kLink);
app.component("k-list", kList);
app.component("k-list-item", kListItem);
app.component("k-icon", kIcon);
app.component("k-messagebar", kMessagebar);
app.component("ion-popover", IonPopover);
app.component("ion-skeleton-text", IonSkeletonText);
app.component("k-navbar", kNavbar);
app.component("k-tabbar", kTabbar);
app.component("k-messages", kMessages);
app.component("k-message", kMessage);
app.component("k-messages-title", kMessagesTitle);
app.component("k-navbar-back-link", kNavbarBackLink);
app.component("k-block", kBlock);
app.component("k-block-title", kBlockTitle);
app.component("k-provider", kProvider);
app.component("ion-alert", IonAlert);
app.component("ion-fab", IonFab);
app.component("ion-fab-button", IonFabButton);
app.component("ion-fab-list", IonFabList);
app.component("ion-select", IonSelect);
app.component("ion-select-option", IonSelectOption);
app.component("ion-accordion", IonAccordion);
app.component("ion-accordion-group", IonAccordionGroup);
app.component("ion-textarea", IonTextarea);
app.component("ion-footer", IonFooter);
app.component("ion-badge", IonBadge);
app.component("ion-option", IonItemOption);
app.component("ion-options", IonItemOptions);
app.component("ion-list", IonList);
app.component("ion-list-header", IonListHeader);
app.component("ion-spinner", IonSpinner);
app.component("ion-app", IonApp);
app.component("ion-router-outlet", IonRouterOutlet);
app.component("ion-modal", IonModal);
app.component("ion-avatar", IonAvatar);
app.component("ion-searchbar", IonSearchbar);
app.component("ion-tabs", IonTabs);
app.component("ion-tab-bar", IonTabBar);
app.component("ion-tab-button", IonTabButton);
app.component("ion-toast", IonToast);
app.component("ion-menu", IonMenu);
app.component("ion-progress-bar", IonProgressBar);
app.component("ion-loading", IonLoading);
app.component("ion-buttons", IonButtons);
app.component("ion-back-button", IonBackButton);
app.component("ion-card-title", IonCardTitle);
app.component("ion-card-subtitle", IonCardSubtitle);
app.component("ion-card-content", IonCardContent);
app.component("ion-card-header", IonCardHeader);
app.component("ion-row", IonRow);
app.component("ion-grid", IonGrid);
app.component("ion-col", IonCol);
app.component("ion-card", IonCard);
app.component("ion-button", IonButton);
app.component("ion-content", IonContent);
app.component("ion-header", IonHeader);
app.component("ion-icon", IonIcon);
app.component("ion-input", IonInput);
app.component("ion-item", IonItem);
app.component("ion-label", IonLabel);
app.component("ion-page", IonPage);
app.component("ion-title", IonTitle);
app.component("ion-toolbar", IonToolbar);
app.component("ion-toggle", IonToggle);
app.component("ion-checkbox", IonCheckbox);
app.component("ion-input-password-toggle", IonInputPasswordToggle);
app.component("ion-refresher", IonRefresher);
app.component("ion-refresher-content", IonRefresherContent);
app.component("ion-chip", IonChip);
app.component("ion-input-otp", IonInputOtp);

router.isReady().then(() => {
  app.mount("#app");
  OneSignal.initialize("c7ea76c6-f10c-4be5-86d4-bf07020c05d8");
  OneSignal.Notifications.requestPermission();
});
