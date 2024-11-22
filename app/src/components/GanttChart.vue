<script setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    viewMode: {
        type: String,
        default: 'Month'
    },
    tasks: {
        type: Array,
        required: true,
        default: () => []
    }
});

const emit = defineEmits(['task-updated', 'task-date-updated', 'task-progress-updated', 'view-mode-updated']);
const ganttContainer = ref(null);
let gantt = null;
// const isUpdating = ref(false);

// Watchers for reactive props
watch(
    () => props.viewMode,
    () => {
        updateViewMode();
    }
);

onMounted(async () => {
    // Dynamic import for compatibility
    const { default: Gantt } = await import('frappe-gantt');
    setupGanttChart(Gantt);
});

function setupGanttChart(Gantt) {
    // Make sure to reference the actual DOM element via `ganttContainer`
    gantt = new Gantt(ganttContainer.value, props.tasks, {
        header_height: 50,
        column_width: 30,
        step: 2,
        view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
        bar_height: 30,
        bar_corner_radius: 3,
        arrow_curve: 15,
        padding: 20,
        date_format: 'YYYY-MM-DD',
        language: 'en',
        sortable: true,

        // on_click: (task) => {
        //     emit('task-updated', task);
        //     // updateTasksWithScrollPreservation();
        // },

        on_date_change: async (task, start, end) => {
            const ganttContainer = document.querySelector('.gantt-container');
            let scrollXOffset = 0;
            if (ganttContainer) {
                scrollXOffset = ganttContainer.scrollLeft;
            }
            emit('task-date-updated', { task, start, end });
            updateTasksWithScrollPreservation(scrollXOffset);
        },

        on_progress_change: (task, progress) => {
            const ganttContainer = document.querySelector('.gantt-container');
            let scrollXOffset = 0;
            if (ganttContainer) {
                scrollXOffset = ganttContainer.scrollLeft;
            }
            emit('task-progress-updated', { task, progress });
            updateTasksWithScrollPreservation(scrollXOffset);
        },

        on_view_change: (mode) => {
            emit('view-mode-updated', mode);
        }
    });

    updateViewMode();
}

function updateViewMode() {
    if (gantt) {
        gantt.change_view_mode(props.viewMode.charAt(0).toUpperCase() + props.viewMode.slice(1));
    }
}
function updateTasksWithScrollPreservation(scrollXOffset) {
    gantt.refresh(props.tasks);
    document.querySelector('.gantt-container').scrollLeft = scrollXOffset;
}
</script>

<template>
    <div ref="ganttContainer"></div>
</template>

<style lang="scss">
.gantt-container {
    width: 100%;
    overflow: auto;
    height: calc(100vh - 220px);
}

/* bar collapsed */
.parent > .bar-group > .bar {
    outline: outset 1px #a3a3ff;
    border-radius: 2px;
    outline-offset: 2px;
}

.details-container {
    padding: 0px 12px;
}
</style>
