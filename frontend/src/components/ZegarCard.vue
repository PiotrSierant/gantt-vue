<script setup>
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Timer from './Timer.vue';
import { computed, ref } from 'vue';
import { useFullscreen } from '@vueuse/core';

const props = defineProps({
    zegar: {
        type: Object,
        required: true,
        default: () => {}
    }
});

const { name, user, data } = props.zegar;
const parsedData = JSON.parse(data);
const currentDate = new Date();

// Pobierz datę (np. UTC)
const lastDate = new Date(parsedData[0].end);
const progress = ref(parsedData[0].progress);

// Ustawienie lokalnego czasu (czyli w strefie czasowej przeglądarki)
// const localDate = new Date(lastDate.toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }));

// Formatuj datę w lokalnej strefie czasowej
// const formattedDate = format(localDate, 'dd MMM yyyy / HH:mm', { locale: pl });
const formattedNowDate = format(currentDate, 'dd MMM yyyy / HH:mm', { locale: pl });
const daysLeft = computed(() => {
    const timeDifference = lastDate.getTime() - currentDate.getTime();
    return timeDifference > 0 ? Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) : 0;
});

const progressClass = computed(() => {
    if (progress.value <= 20) return 'bg-red-600'; // Czerwony
    if (progress.value <= 50) return 'bg-yellow-500'; // Żółty
    if (progress.value <= 80) return 'bg-blue-600'; // Niebieski
    return 'bg-green-600'; // Zielony
});

const el = ref(null); // Poprawione przypisanie
const { isFullscreen, enter, exit, toggle } = useFullscreen(el);
</script>

<template>
    <div ref="el" class="gap-2 border rounded-md @container">
        <!-- Header -->
        <section class="flex gap-4 flex-col @sm:flex-row w-full justify-between border-b p-4">
            <div class="text-xl font-bold">{{ name }}</div>
            <div class="text-left text-sm">{{ formattedNowDate }}</div>
            <Button @click="toggle">Go Fullscreen</Button>
        </section>
        <!-- Contact Section -->
        <section class="flex flex-col @sm:flex-row w-full justify-between border-b">
            <div class="@sm:w-1/2 @md:w-5/12 @sm:border-r">
                <div class="font-semibold border-b p-2">kbj: {{ user.name }} {{ user.last_name }}</div>
                <div class="text-sm p-2 border-b @sm:border-b-0">tel: {{ user.phone }}</div>
            </div>
            <div class="flex justify-start @sm:justify-end items-center">
                <div class="text-3xl font-bold text-red-600 p-2 @sm:p-4"><Timer :time="parsedData[0].end" /></div>
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
    </div>
</template>
<style lang="css">
:fullscreen {
    width: 100vw;
    height: 100vh;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
}
</style>
