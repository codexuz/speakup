<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { settingsOutline } from "ionicons/icons";
import Pen from "@/components/icons/Pen.vue";
import Location from "@/components/icons/Location.vue";
import Calendar from "@/components/icons/Calendar.vue";
import WalletMoney from "@/components/icons/WalletMoney.vue";
import { useUser } from "@/composables/useUser";
import { changeStatusBar } from "@/lib/utils";

const { user, loadUser, updateUserAvatar } = useUser();
const router = useRouter();
const loading = ref(true);

function formatTimestamp(timestamp) {
  if (!timestamp) return "";

  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentyabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];

  const date = new Date(timestamp);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

onMounted(async () => {
  changeStatusBar("primary");
  await loadUser();
  loading.value = false;
});

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  loading.value = true;

  try {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        // Update avatar in composable
        await updateUserAvatar(reader.result);
        // Update the user profile in Supabase
      } catch (error) {
        console.error("Error updating avatar:", error);
      } finally {
        loading.value = false;
      }
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error("Error reading file:", error);
    loading.value = false;
  }
};

const refreshProfile = async (event) => {
  await loadUser();
  if (event) {
    event.target.complete();
  }
};
</script>

<template>
  <ion-page>
    <ion-content scroll-y="true">
      <ion-refresher
        mode="ios"
        slot="fixed"
        @ionRefresh="refreshProfile($event)"
      >
        <ion-refresher-content
          refreshing-spinner="lines"
        ></ion-refresher-content>
      </ion-refresher>

      <ion-header class="ion-no-border">
        <ion-toolbar class="ion-padding" color="transparent">
          <section class="flex items-center justify-between">
            <div class="relative" slot="start">
              <avatar
                v-if="!loading"
                :name="user?.first_name || user?.username || 'User'"
                background="#1e293b"
                :border="false"
                color="#fff"
                :size="70"
              />

              <ion-avatar slot="start" v-if="loading">
                <ion-skeleton-text :animated="true"></ion-skeleton-text>
              </ion-avatar>
            </div>

            <div slot="end">
              <ion-icon
                :icon="settingsOutline"
                @click="router.push('/settings', 'forward')"
                class="text-2xl text-white cursor-pointer"
              />
            </div>
          </section>

          <section class="flex items-center justify-between">
            <div>
              <h1 v-if="!loading" class="text-xl font-bold">
                {{ user?.first_name || user?.username || "User" }}
              </h1>
              <ion-text v-if="loading">
                <ion-skeleton-text
                  :animated="true"
                  class="w-28 mb-3 mt-6"
                ></ion-skeleton-text>
              </ion-text>

              <div class="flex items-center gap-x-2" v-if="!loading">
                <Calendar class="w-4 h-4" />
                <p class="text-gray-100">
                  {{ formatTimestamp(user?.created_at || user?.joinedAt) }}
                </p>
              </div>
              <ion-text v-if="loading">
                <ion-skeleton-text
                  :animated="true"
                  class="w-28 mb-3"
                ></ion-skeleton-text>
              </ion-text>
            </div>
          </section>
        </ion-toolbar>
      </ion-header>

       
            <ion-card
              color="main"
              class="overflow-hidden mt-6 relative rounded-xl px-2"
            >
              <div class="flex items-center justify-between">
                <div class="p-3">
                  <span class="flex gap-x-1 items-center">
                    <WalletMoney /> Hisobim
                  </span>
                  <div
                    class="text-lg font-medium flex items-center gap-x-1 my-1 text-yellow-400"
                  >
                    {{ user?.balance || 0 }}
                  </div>
                </div>
                <button
                  @click="router.push('/payment', 'forward')"
                  class="z-10 bg-gray-900/85 shadow-md px-8 py-3 rounded-full flex items-center gap-x-2 font-bold text-gray-100 hover:bg-gray-800 transition-colors"
                >
                  + To'ldirish
                </button>
              </div>
            </ion-card>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-toolbar {
  --background: #121212;
}

ion-item {
  --background: #121212;
}

.cursor-pointer {
  cursor: pointer;
}

.transition-colors {
  transition: background-color 0.2s ease;
}
</style>
