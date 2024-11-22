<script setup>
import ZegarCard from '@/components/ZegarCard.vue';
import { useLayout } from '@/layout/composables/layout';
import { getCurrentInstance, watch } from 'vue';
const instance = getCurrentInstance();
const { getPrimary, getSurface, isDarkTheme } = useLayout();
watch([getPrimary, getSurface, isDarkTheme], () => {});

import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';

let zegary = reactive([]);
const loading = ref(true);

const fetchZegary = async () => {
    try {
        const response = await axios.get('https://galeon-202410.omnimes.com/api/dashboard-zegary');
        zegary.splice(0, zegary.length, ...response.data);
        instance?.proxy?.$forceUpdate();
    } catch (error) {
        console.error('Błąd podczas pobierania listy zegarów:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchZegary();
    setInterval(fetchZegary, 5000);
});
</script>

<template>
    <div class="card w-full relative">
        <h1 class="mb-4">ZEGARY</h1>
        <Skeleton v-if="loading" width="100%" height="400px"></Skeleton>
        <div v-if="zegary.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ZegarCard v-for="zegarId in zegary" :key="zegarId" :zegarId="zegarId" />
        </div>
    </div>
</template>
