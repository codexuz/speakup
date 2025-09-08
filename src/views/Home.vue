<template>
  <ion-page>
    <ion-header class="ion-no-border m-2">
      <ion-toolbar class="px-3" color="transparent">
        <div class="flex items-center">
          <div>
            <avatar
              v-if="!loading"
              :border="false"
              @click="() => router.push('/profile')"
              :name="user?.first_name || user?.username"
              background="#1e293b"
              color="#fff"
              :size="50"
            />
            <ion-avatar v-else>
              <ion-skeleton-text :animated="true"></ion-skeleton-text>
            </ion-avatar>
          </div>
          <div>
            <ion-label v-if="!loading" class="text-2xl font-bold mx-4"
              >Salom, {{ user?.first_name || user?.username }}</ion-label
            >
            <ion-skeleton-text
              v-else
              class="mx-4 py-2"
              :animated="true"
              style="width: 250px"
            />
          </div>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-refresher
        mode="ios"
        slot="fixed"
        @ionRefresh="refreshPage($event, true)"
      >
        <ion-refresher-content
          refreshing-spinner="lines"
        ></ion-refresher-content>
      </ion-refresher>

      <!-----Telegram Join Card -->
      <div
        @click="joinTelegram"
        class="telegram-join-card mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-3 shadow-lg relative overflow-hidden"
      >
        <div class="flex items-center justify-between z-10">
          <div class="flex items-center space-x-3">
            <!-- Slim, elegant icon container -->
            <ion-avatar
              class="bg-white/15 backdrop-blur-md flex items-center justify-center p-2 border border-white/10"
            >
              <Send :size="20" color="white" stroke-width="1.5" />
            </ion-avatar>
            <div class="text-white">
              <h3 class="text-sm font-semibold tracking-wide">
                Join Our Telegram Channel
              </h3>
            </div>
          </div>

          <!-- Sleek, minimal button -->
          <ion-button
            fill="clear"
            class="bg-white/10 backdrop-blur-md text-white text-xs font-medium px-3 rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-sm"
          >
            Join
          </ion-button>
        </div>
      </div>

      <ion-list lines="none">
        <ion-list-header class="mb-6">
          <ion-label class="flex items-center gap-x-3"
            ><Dumbbell class="bg-blue-500 rounded-lg p-1" size="30" /> Speaking
            Practice</ion-label
          >
        </ion-list-header>
        <ion-item
        router-link="/speaking/part-1.1"
          detail="true"
          class="mb-4 bg-slate-800 shadow-xl rounded-xl py-2"
        >
          <ion-button
            fill="clear"
            class="bg-blue-200 w-10 h-10 rounded-xl"
            shape="rounded"
            slot="start"
          >
            <Mic color="blue" slot="start" />
          </ion-button>
          <ion-label class="text-xl font-bold">Part 1.1</ion-label>
        </ion-item>

        <ion-item
        router-link="/speaking/part-1.2"
          detail="true"
          class="mb-4 bg-slate-800 shadow-xl rounded-xl py-2"
        >
          <ion-button
            fill="clear"
            class="bg-blue-200 w-10 h-10 rounded-xl"
            shape="rounded"
            slot="start"
          >
            <ImageIcon color="blue" slot="start" />
          </ion-button>
          <ion-label class="text-xl font-bold">Part 1.2</ion-label>
        </ion-item>

        <ion-item
        router-link="/speaking/part-2"
          detail="true"
          class="mb-4 bg-slate-800 shadow-xl rounded-xl py-2"
        >
          <ion-button
            fill="clear"
            class="bg-green-200 w-10 h-10 rounded-xl"
            shape="rounded"
            slot="start"
          >
            <Clock color="green" slot="start" />
          </ion-button>
          <ion-label class="text-xl font-bold">Part 2</ion-label>
        </ion-item>

        <ion-item
         router-link="/speaking/part-3"
          detail="true"
          class="mb-4 bg-slate-800 shadow-xl rounded-xl py-2"
        >
          <ion-button
            fill="clear"
            class="bg-purple-200 w-10 h-10 rounded-xl"
            shape="rounded"
            slot="start"
          >
            <MessageSquare color="#9333ea" slot="start" />
          </ion-button>
          <ion-label class="text-xl font-bold">Part 3</ion-label>
        </ion-item>
      </ion-list>

      <ion-list lines="none">
        <ion-list-header class="mb-6">
          <ion-label class="flex items-center gap-x-3"
            ><Brain class="bg-green-500 rounded-lg p-1" size="30" /> Speaking
            Tests</ion-label
          >
        </ion-list-header>

        <ion-item
          router-link="/speaking/full-test"
          detail="true"
          class="mb-4 bg-slate-800 shadow-xl rounded-xl py-2"
        >
          <ion-button
            fill="clear"
            class="bg-orange-200 w-10 h-10 rounded-xl"
            shape="rounded"
            slot="start"
          >
            <FlagTriangleRight color="#f97316" slot="start" />
          </ion-button>
          <ion-label class="text-xl font-bold">Mock Tests</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useNavigation } from "@/composables/useNavigation";
import { fetchLimited } from "@/lib/appwrite";
import { changeStatusBar } from "@/lib/utils";
import { useUser } from "@/composables/useUser";

import {
  Brain,
  Clock,
  Dumbbell,
  FlagTriangleRight,
  ImageIcon,
  MessageSquare,
  Mic,
  Send,
} from "lucide-vue-next";

const { loadUser, user } = useUser();
const { navigate } = useNavigation();
const router = useRouter();

const fetchedVideos = ref([]);
const fetchingVideos = ref(true);
const loading = ref(true);

onMounted(async () => {
  fetchingVideos.value = true;
  fetchedVideos.value = await fetchLimited();
  fetchingVideos.value = false;
  changeStatusBar("primary");
  await loadUser();
  loading.value = false;
});

async function refreshPage(event) {
  loading.value = true;
  fetchingVideos.value = true;
  setTimeout(async () => {
    await loadUser();
    fetchedVideos.value = await fetchLimited();
    event.target.complete();
    loading.value = false;
    fetchingVideos.value = false;
  }, 2000);
}

function joinTelegram() {
  // Replace with your actual Telegram channel/group link
  window.open("https://t.me/speakup_edumo", "_blank");
}
</script>

<style scoped>
ion-item {
  --background: transparent;
}
</style>
