<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/home">Back</ion-back-button>
                </ion-buttons>
                <ion-title>Speaking Practice</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-grid>
                <ion-row class="ion-margin-top items-center justify-center mx-auto gap-x-4 gap-y-2">
                    <ion-col size-md="6" size-lg="4" size="12">
                        <ion-card router-link="/speaking-practice/part-1.1"
                            class="mx-auto rounded-2xl ion-activatable ripple-parent shadow-none border border-gray-200 mt-4">
                            <ion-ripple-effect></ion-ripple-effect>
                            <ion-card-content>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-x-2">
                                        <div class="bg-blue-100 p-2 rounded-xl">
                                            <Mic class="w-6 h-6 text-blue-600" />
                                        </div>
                                        <ion-text class="block">
                                            <p class="poppins-bold text-md text-slate-900" style="line-height: 12px;">
                                                Speaking Part 1.1</p>
                                            <ion-label
                                                class="text-ellipsis poppins-regular text-sm text-gray-600">General Speaking questions</ion-label>
                                        </ion-text>
                                    </div>
                                </div>
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                    <ion-col size-md="6" size-lg="4" size="12">
                        <ion-card router-link="/speaking-practice/part-1.2" class="mx-auto rounded-2xl ion-activatable ripple-parent shadow-none border border-gray-200 mt-4">
                            <ion-ripple-effect></ion-ripple-effect>
                            <ion-card-content>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-x-2">
                                        <div class="bg-blue-100 p-2 rounded-xl">
                                            <ImageIcon class="w-6 h-6 text-blue-600" />
                                        </div>
                                        <ion-text class="block">
                                            <p class="poppins-bold text-md text-slate-900" style="line-height: 12px;">
                                                Speaking Part 1.2</p>
                                            <ion-label
                                                class="text-ellipsis poppins-regular text-sm text-gray-600">Describing given images</ion-label>
                                        </ion-text>
                                    </div>
                                </div>
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                    <ion-col size-md="6" size-lg="4" size="12">
                        <ion-card router-link="/speaking-practice/part-2" class="mx-auto rounded-2xl ion-activatable ripple-parent shadow-none border border-gray-200 mt-4">
                            <ion-ripple-effect></ion-ripple-effect>
                            <ion-card-content>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-x-2">
                                        <div class="bg-blue-100 p-2 rounded-xl">
                                            <Clock class="w-6 h-6 text-blue-600" />
                                        </div>
                                        <ion-text class="block">
                                            <p class="poppins-bold text-md text-slate-900" style="line-height: 12px;">
                                                Speaking Part 2</p>
                                            <ion-label
                                                class="text-ellipsis poppins-regular text-sm text-gray-600">Speaking on abstract topics</ion-label>
                                        </ion-text>
                                    </div>
                                </div>
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                    <ion-col size-md="6" size-lg="4" size="12">
                        <ion-card router-link="/speaking-practice/part-3" class="mx-auto rounded-2xl ion-activatable ripple-parent shadow-none border border-gray-200 mt-4">
                            <ion-ripple-effect></ion-ripple-effect>
                            <ion-card-content>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-x-2">
                                        <div class="bg-blue-100 p-2 rounded-xl">
                                            <MessageSquare class="w-6 h-6 text-blue-600" />
                                        </div>
                                        <ion-text class="block">
                                            <p class="poppins-bold text-md text-slate-900" style="line-height: 12px;">
                                                Speaking Part 3</p>
                                            <ion-label
                                                class="text-ellipsis poppins-regular text-sm text-gray-600">Speaking on global issues</ion-label>
                                        </ion-text>
                                    </div>
                                </div>
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    Clock,
    ImageIcon,
    MessageSquare,
    Mic,
} from "lucide-vue-next";
</script>