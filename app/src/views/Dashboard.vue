<script setup>
import { watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useClocks } from '@/hooks/Clocks/useClocks';
import ClockContainer from '@/components/containers/ClockContainer.vue';

const { getPrimary, getSurface, isDarkTheme } = useLayout();
watch([getPrimary, getSurface, isDarkTheme], () => {});

const { clocks, isLoading } = useClocks();
</script>

<template>
    <div class="card w-full relative">
        <Skeleton v-if="isLoading" width="100%" height="400px" />
        <div v-if="clocks.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ClockContainer v-for="clock in clocks" :key="clock" :clockId="clock" />
        </div>
    </div>
</template>
