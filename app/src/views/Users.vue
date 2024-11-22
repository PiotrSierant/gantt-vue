<script setup>
import { reactive, onMounted, watch, ref } from 'vue';
import { useLayout } from '@/layout/composables/layout';

import axios from 'axios';
import AddUsers from '@/components/AddUsers.vue';
import ListUsers from '@/components/ListUsers.vue';

const { getPrimary, getSurface, isDarkTheme } = useLayout();
watch([getPrimary, getSurface, isDarkTheme], () => {});

let users = reactive([]);
let processList = reactive([]);
const loading = ref(true);

onMounted(() => {
    fetchUsers();
    fetchProcessList();
});

function fetchUsers() {
    axios
        .get(`https://galeon-202410.omnimes.com/api/users`)
        .then((response) => {
            users.splice(0, users.length, ...response.data);
            console.log(users);
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
        .get(`https://galeon-202410.omnimes.com/api/process-list`)
        .then((response) => {
            processList.splice(0, processList.length, ...response.data);
        })
        .catch((error) => {
            console.error('Error fetching lists:', error);
        })
        .finally(() => {
            loading.value = false;
        });
}

function refreshUsers(user) {
    users.push({
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        phone: user.phone
    });
}
</script>

<template>
    <div>
        <AddUsers @userAdded="refreshUsers" />
        <Skeleton v-if="loading" width="100%" height="300px" />
        <ListUsers v-if="!loading && users.length > 0" :users="users" :processList="processList" @userUpdated="fetchUsers" />
        <Message v-if="!(users.length > 0)" severity="warn">Brak dodanych użytkowników.</Message>
    </div>
</template>
