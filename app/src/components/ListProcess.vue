<script setup>
import { watchEffect } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
const router = useRouter();
const toast = useToast();
const emit = defineEmits(['updateProcessList']);

const props = defineProps({
    process: {
        type: Array,
        required: true,
        default: () => []
    },
    usersList: {
        type: Array,
        required: true,
        default: () => []
    }
});
watchEffect(() => props.users);
const handleProcessChange = async (data) => {
    try {
        await axios
            .put(`${import.meta.env.VITE_APP_API_URL}/api/process-user/${data.process_id}`, { user_id: data.user.id })
            .then(() => {
                console.log('Zaktualizowano proces dla użytkownika:', data.user.id);
            })
            .catch((error) => {
                console.error('Error updating data:', error);
            });
    } catch (error) {
        console.error('Error updating data:', error);
    }
};
const handleDelete = async (data) => {
    try {
        await axios
            .delete(`${import.meta.env.VITE_APP_API_URL}/api/process/${data.process_id}`)
            .then(() => {
                toast.add({ severity: 'success', summary: 'Proces został usunięty.', life: 3000 });
                emit('updateProcessList', data.process_id);
            })
            .catch((error) => {
                console.error('Błąd podczas usuwania procesu:', error);
                toast.add({ severity: 'error', summary: 'Nie udało się usunąć procesu.', life: 3000 });
            });
    } catch (error) {
        console.error('Błąd:', error);
        toast.add({ severity: 'error', summary: 'Nieoczekiwany błąd.', life: 3000 });
    }
};
const handleEdit = (data) => {
    router.push({ name: 'process-edit', params: { id: data.process_id } });
};
const navigateToProcessDetail = (processId) => {
    router.push({ name: 'process-detail', params: { id: processId } });
};
</script>
<template>
    <div class="card">
        <DataTable :value="process" showGridlines paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
            <Column field="process_id" header="ID" sortable></Column>
            <Column field="process_name" header="Imię" sortable></Column>
            <Column field="user" header="Użytkownik">
                <template #body="{ data }">
                    <Select v-model="data.user" :options="usersList" optionLabel="full_name" placeholder="Wybierz użytkownika" class="w-full md:w-56" @change="handleProcessChange(data)" />
                </template>
            </Column>
            <Column field="action" header="Akcje">
                <template #body="{ data }">
                    <section class="flex gap-2">
                        <Button icon="pi pi-search" class="p-button-rounded p-button-info" @click="navigateToProcessDetail(data.process_id)" />
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-primary" @click="handleEdit(data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="handleDelete(data)" />
                    </section>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
