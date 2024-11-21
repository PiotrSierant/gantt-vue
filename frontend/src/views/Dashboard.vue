<script setup>
import { useLayout } from '@/layout/composables/layout';
import { watch } from 'vue';
import ZegarCard from '@/components/ZegarCard.vue';
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance();
const { getPrimary, getSurface, isDarkTheme } = useLayout();
watch([getPrimary, getSurface, isDarkTheme], () => {});

import { reactive, onMounted, ref } from 'vue';
import axios from 'axios';

let zegary = reactive([]);
const loading = ref(true);

onMounted(() => {
    fetchZegary();
});
// Odświeżaj dane co 5 sekund
setInterval(() => {
    fetchZegary();
}, 2000);
watch(
    zegary,
    (newZegary, oldZegary) => {
        console.log('Zegary zostały zaktualizowane', newZegary);
        // Dodatkowe operacje, które mogą wymusić przerenderowanie
    },
    { deep: true }
);
const fetchZegary = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/dashboard-zegary`);
        zegary = response.data;
        zegary.splice(0, zegary.length, ...response.data);
        instance?.proxy?.$forceUpdate();
    } catch (error) {
        console.error('Błąd:', error);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="card w-full relative">
        <h1 class="mb-4">ZEGARY</h1>
        <Skeleton v-if="loading" width="100%" height="400px"></Skeleton>
        <div v-if="zegary.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ZegarCard v-for="zegar in zegary" :key="zegar.id" :zegar="zegar" />
        </div>
    </div>
</template>
