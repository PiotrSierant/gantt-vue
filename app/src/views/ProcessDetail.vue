<script setup>
import { useLayout } from '@/layout/composables/layout';
import { watch } from 'vue';
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const processId = ref(route.params.id); // Pobranie ID z parametrów trasy

const { getPrimary, getSurface, isDarkTheme } = useLayout();
watch([getPrimary, getSurface, isDarkTheme], () => {});

let tasks = reactive([]); // Przechowywanie szczegółów procesu
let idGanttTask = ref(null); // ID zadania w GanttChart
let name = ref(''); // Nazwa procesu

const currentViewMode = ref('Week');
const actionInGanttChart = ref(false);
const loading = ref(true);
const userId = ref('');
/*
    Przy tworzeniu zadania z kamieniem milowym
    aktualnie nie ma potrzeby tworzenia tej funkcjonalności

    Dodatkowo kamień milowy powinien mieć progress który:
    - jest średnią ważoną progresów zadań nad nim

    Trzeba będzie mienić wygląd kamienia milowego (jako kwadrat).
    
    custom_class: 'bar-milestone'
    custom_popup_html: null
*/
const fetchProcessDetail = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/process/${processId.value}`);
        if (response.data.message) {
            // Jeśli brak danych, ustaw loading i puste zadania
            tasks.splice(0, tasks.length); // Czyścimy listę zadań
        } else {
            idGanttTask.value = response.data.id;
            tasks.splice(0, tasks.length, ...JSON.parse(response.data.data)); // Przypisujemy dane reaktywnie
            name.value = response.data.name;
            userId.value = response.data.user_id;

            console.log(tasks);
        }
    } catch (error) {
        console.error('Błąd:', error);
    } finally {
        loading.value = false;
        actionInGanttChart.value = false;
    }
};

onMounted(() => {
    fetchProcessDetail();
});

async function updateSummaryTask() {
    const tasksToCalculate = [...tasks].splice(1);

    // Suma iloczynów postępu i długości trwania zadań
    const totalWeightedProgress = tasksToCalculate.reduce((sum, task) => {
        const taskDuration = new Date(task.end) - new Date(task.start);
        return sum + task.progress * taskDuration;
    }, 0);

    // Suma wszystkich czasów trwania zadań w dniach
    const totalDuration = tasksToCalculate.reduce((sum, task) => {
        const taskDuration = new Date(task.end) - new Date(task.start);
        return sum + taskDuration;
    }, 0);

    const averageProgress = (totalDuration ? totalWeightedProgress / totalDuration : 0).toFixed(2);

    tasks[0].name = `Bieżący postę prac: ${averageProgress}%`;
    tasks[0].progress = averageProgress;

    if (tasks.length === 2) {
        tasks[0].start = tasks[1].start;
        tasks[0].end = tasks[1].end;
        tasks[0].invalid = false;
    } else if (tasks.length > 2) {
        const earliestDate = tasksToCalculate.reduce((earliest, task) => {
            const taskStart = new Date(task.start);
            return taskStart < earliest ? taskStart : earliest;
        }, new Date(tasksToCalculate[0].start));

        const latestDate = tasksToCalculate.reduce((latest, task) => {
            const taskEnd = new Date(task.end);
            return taskEnd > latest ? taskEnd : latest;
        }, new Date(tasksToCalculate[0].end));

        tasks[0].start = earliestDate;
        tasks[0].end = latestDate;
    }

    const newData = {
        name: name.value,
        data: JSON.stringify(tasks),
        user_id: userId.value
    };

    try {
        await axios
            .put(`${import.meta.env.VITE_APP_API_URL}/api/process/${idGanttTask.value}`, newData)
            .then(() => {
                fetchProcessDetail();
            })
            .catch((error) => {
                console.error('Error updating data:', error);
            });
    } catch (error) {
        console.error('Error updating data:', error);
    }
}

// Event handler: task-date-updated - on date change
async function onTaskDateUpdated({ task, start, end }) {
    handleToggleActionInGanttChart();
    // console.log('Task date updated:', task, start, end);
    // Update the task dates or handle API update if necessary
    const taskIndex = tasks.findIndex((t) => t.id === task.id);

    if (taskIndex !== -1) {
        tasks[taskIndex].start = start;
        tasks[taskIndex].end = end;
    }
    await updateSummaryTask();
}

// Event handler: task-progress-updated
async function onTaskProgressUpdated({ task, progress }) {
    handleToggleActionInGanttChart();
    // console.log('Task progress updated:', task, progress);
    // Update the task progress or handle any necessary updates

    const taskIndex = tasks.findIndex((t) => t.id === task.id);
    if (taskIndex !== -1) {
        tasks[taskIndex].progress = progress;
    }

    await updateSummaryTask();
}

// Change view mode based on button click
// Event handler: view-mode-updated
function changeViewMode(mode) {
    currentViewMode.value = mode;
}
// Event handler: task-updated - on click
function onTaskUpdated(task) {
    console.log('Task updated:', task);
    // Update the task in the tasks array or trigger any required update
}
function handleToggleActionInGanttChart() {
    actionInGanttChart.value = true;
}
</script>

<template>
    <div class="card w-full relative">
        <LoaderGanttChartAction v-if="actionInGanttChart" />
        <div class="w-full flex flex-wrap gap-2 justify-between mb-4">
            <h1 class="text-3xl font-semibold">{{ name }}</h1>
            <section class="flex flex-wrap gap-2">
                <Button type="button" data-view="Half Day" :class="{ selected: currentViewMode === 'Half Day' }" @click="changeViewMode('Half Day')">Pół dnia</Button>
                <Button type="button" data-view="Day" :class="{ selected: currentViewMode === 'Day' }" @click="changeViewMode('Day')">Dzień</Button>
                <Button type="button" data-view="Week" :class="{ selected: currentViewMode === 'Week' }" @click="changeViewMode('Week')">Tydzień</Button>
                <Button type="button" data-view="Month" :class="{ selected: currentViewMode === 'Month' }" @click="changeViewMode('Month')">Miesiąc</Button>
            </section>
        </div>
        <Skeleton v-if="loading" width="100%" height="400px"></Skeleton>
        <GanttChart v-if="!loading && tasks.length > 0" :tasks="tasks" :viewMode="currentViewMode" @task-updated="onTaskUpdated" @task-date-updated="onTaskDateUpdated" @task-progress-updated="onTaskProgressUpdated" />
        <Message v-if="!loading && !(tasks.length > 0)" severity="warn">Nie znaleziono procesu.</Message>
    </div>
</template>
