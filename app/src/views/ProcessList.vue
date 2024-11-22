<script setup>
import { useLayout } from '@/layout/composables/layout';
import { watch, reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import ListProcess from '@/components/ListProcess.vue';

const { getPrimary, getSurface, isDarkTheme } = useLayout();
watch([getPrimary, getSurface, isDarkTheme], () => {});

let usersList = reactive([]);
let process = reactive([]);
const loading = ref(true);

onMounted(async () => {
    await fetchUsers();
    await fetchProcessList();
});

function fetchUsers() {
    axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/users-list`)
        .then((response) => {
            usersList.splice(0, usersList.length, ...response.data);
        })
        .catch((error) => {
            console.error('Error fetching users:', error);
        })
        .finally(() => {
            loading.value = false;
        });
}

function fetchProcessList() {
    axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/process-list-with-users`)
        .then((response) => {
            process.splice(0, process.length, ...response.data);
        })
        .catch((error) => {
            console.error('Error fetching lists:', error);
        })
        .finally(() => {
            loading.value = false;
        });
}
</script>

<template>
    <div>
        <ListProcess v-if="!loading && process.length > 0" :process="process" :usersList="usersList" @updateProcessList="fetchProcessList()" />
        <Message v-if="!(process.length > 0)" severity="warn">Brak dodanych procesów.</Message>
    </div>
</template>
