<script setup>
import Timer from './Timer.vue';
import { ref } from 'vue';
import { useFullscreen } from '@vueuse/core';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  formattedNowDate: {
    type: String,
    required: true
  },
  user: {
    type: Object,
    required: true
  },
  parsedData: {
    type: Array,
    required: true
  },
  daysLeft: {
    type: Number,
    required: true
  },
  progress: {
    type: Number,
    required: true
  },
  progressClass: {
    type: String,
    required: true
  }
});

const el = ref(null);
const { toggle, isFullscreen } = useFullscreen(el);
</script>

<template>
    <div ref="el" class="gap-2 border rounded-md @container">
        <div v-if="isFullscreen" class="w-full min-h-[100vh] p-8 bg-white dark:bg-black">
            <section class="w-full flex justify-between pb-6 border-b-8">
                <h1 class="text-9xl font-bold">{{ name }}</h1>
                <div class="text-left text-7xl flex items-center justify-center gap-5">
                    {{ formattedNowDate }}
                    <Button icon="pi pi-times" severity="danger" rounded aria-label="Exit" size="large" @click="toggle" />
                </div>
            </section>


            <section class="flex flex-row w-full justify-between border-b-8">
                <div class="w-5/12 border-r-8 border-l-8">
                    <div class="font-semibold border-b-8 p-8 text-7xl">kbj: {{ user.name }} {{ user.last_name }}</div>
                    <div class="p-8 border-b-0 text-7xl">tel: {{ user.phone }}</div>
                </div>
                <div class="flex justify-end items-center border-r-8">
                    <div class="text-9xl font-bold text-red-600 p-8">
                        <Timer v-if="parsedData.length" :time="parsedData[0].end" />
                    </div>
                </div>
            </section>


            <div class="col-span-3 flex justify-between items-center p-8 border-l-8 border-r-8">
                <div class="w-full bg-gray-400 h-8">
                    <div :class="progressClass + ' h-8'" :style="{ width: progress + '%' }"></div>
                </div>
                <div class="ml-2 text-sm font-bold">{{ progress }}%</div>
            </div>


            <section class="flex flex-row w-full justify-between border-8">
                <!-- Chart Section -->
                <div class="flex flex-col p-8 border-b @sm:border-b-0">
                    <p class="text-5xl font-bold text-wrap">BŁĘDY JAKOŚCIOWE Z PODZIAŁEM NA DZIAŁY PRODUKCYJNE</p>
                    <div class="flex justify-start items-end space-x-1 h-full min-h-[100px]">
                        <div class="bg-blue-600 h-11 @sm:h-1/3 w-4"></div>
                        <div class="bg-green-600 h-14 @sm:h-1/2 w-4"></div>
                        <div class="bg-yellow-600 h-6 @sm:h-1/4 w-4"></div>
                        <div class="bg-red-600 h-20 @sm:h-4/5 w-4"></div>
                    </div>
                </div>
                <div class="w-1/3 border-l-8">
                    <div class="font-semibold border-b-8 p-8 text-5xl">Ilość dni do końca produkcji jednostki</div>
                    <div class="p-8 text-5xl font-bold">{{ daysLeft }}</div>
                </div>
            </section>
        </div>
        <!-- Header -->
        <section v-if="!isFullscreen">
            <section class="flex gap-4 flex-col @sm:flex-row w-full justify-between border-b p-4">
                <div class="text-xl font-bold">{{ name }}</div>
                <div class="text-left text-sm flex items-center justify-center gap-2">
                    {{ formattedNowDate }}
                    <Button icon="pi pi-arrows-v" variant="text" rounded aria-label="Fullscreen" @click="toggle" />
                </div>
            </section>
            <!-- Contact Section -->
            <section class="flex flex-col @sm:flex-row w-full justify-between border-b">
                <div class="@sm:w-1/2 @md:w-5/12 @sm:border-r">
                    <div class="font-semibold border-b p-2">kbj: {{ user.name }} {{ user.last_name }}</div>
                    <div class="text-sm p-2 border-b @sm:border-b-0">tel: {{ user.phone }}</div>
                </div>
                <div class="flex justify-start @sm:justify-end items-center">
                    <div class="text-3xl font-bold text-red-600 p-2 @sm:p-4">
                        <Timer v-if="parsedData.length" :time="parsedData[0].end" />
                    </div>
                </div>
            </section>


            <section class="flex flex-col @sm:flex-row w-full justify-between border-b">
                <!-- Chart Section -->
                <div class="flex flex-col p-2 @sm:p-4 border-b @sm:border-b-0">
                    <p class="text-xs font-bold text-wrap">BŁĘDY JAKOŚCIOWE Z PODZIAŁEM NA DZIAŁY PRODUKCYJNE</p>
                    <div class="flex justify-start items-end space-x-1 h-full min-h-[100px]">
                        <div class="bg-blue-600 h-11 @sm:h-1/3 w-4"></div>
                        <div class="bg-green-600 h-14 @sm:h-1/2 w-4"></div>
                        <div class="bg-yellow-600 h-6 @sm:h-1/4 w-4"></div>
                        <div class="bg-red-600 h-20 @sm:h-4/5 w-4"></div>
                    </div>
                </div>
                <div class="@sm:w-1/3 @sm:border-l">
                    <div class="font-semibold border-b p-2 @sm:p-4">Ilość dni do końca produkcji jednostki</div>
                    <div class="p-2 border-b @sm:border-b-0 @sm:p-4 text-4xl font-bold">{{ daysLeft }}</div>
                </div>
            </section>


            <!-- Progress Section -->
            <div class="col-span-3 flex justify-between items-center p-2 @sm:p-4">
                <div class="w-full bg-gray-400 h-4">
                    <div :class="progressClass + ' h-4'" :style="{ width: progress + '%' }"></div>
                </div>
                <div class="ml-2 text-sm font-bold">{{ progress }}%</div>
            </div>
        </section>
    </div>

</template>
