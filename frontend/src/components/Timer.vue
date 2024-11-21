<script setup>
import { useTimer } from 'vue-timer-hook';

const props = defineProps({
    time: {
        type: String,
        required: true,
        default: () => {}
    }
});

// Data zakończenia zdarzenia
const eventEndDate = new Date(props.time); // Przykładowa data zakończenia
const currentDate = new Date(); // Aktualna data

// Sprawdzenie, czy data zakończenia jest w przyszłości
if (eventEndDate <= currentDate) {
    console.warn('Zdarzenie już się zakończyło.');
}

// Inicjalizacja timera
const timer = useTimer(eventEndDate);
</script>
<template>
    <div>
        <span>{{ timer.days }}</span
        >d : <span>{{ timer.hours }}</span
        >h : <span>{{ timer.minutes }}</span
        >m : <span>{{ timer.seconds }}</span
        >s
    </div>
</template>

<!-- <p>{{ timer.isRunning ? 'Odliczanie trwa' : 'Zdarzenie zakończone' }}</p> -->
