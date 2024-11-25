<script setup>
import { useClockDetails } from '@/hooks/Clocks/useClockDetails';
const props = defineProps({
    clockId: {
        type: Number,
        required: true
    }
});

const { isLoading, name, formattedNowDate, user, parsedData, daysLeft, progress, progressClass } = useClockDetails(props.clockId);
</script>

<template>
    <Skeleton v-if="isLoading" width="100%" height="300px" />
    <ClockCard v-else :name :formattedNowDate :user :parsedData :daysLeft :progress :progressClass />
</template>
