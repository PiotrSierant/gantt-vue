<script setup>
import { useTimer } from 'vue-timer-hook';

const props = defineProps({
  time: {
    type: String,
    required: true,
  }
});

const eventEndDate = new Date(props.time);
const currentDate = new Date();

const isEventEnded = eventEndDate <= currentDate;
const timer = useTimer(eventEndDate);
</script>

<template>
  <div v-if="!isEventEnded" class="timer">
    <span>{{ timer.days }}</span>d : 
    <span>{{ timer.hours }}</span>h : 
    <span>{{ timer.minutes }}</span>m : 
    <span>{{ timer.seconds }}</span>s
  </div>
  <div v-else class="event-ended">
    <span>Process zakończony.</span>
  </div>
</template>