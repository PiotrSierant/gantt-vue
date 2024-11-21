<script setup>
import { watchEffect } from 'vue';
const props = defineProps({
    users: {
        type: Array,
        required: true,
        default: () => []
    },
    processList: {
        type: Array,
        required: true,
        default: () => []
    }
});
watchEffect(() => props.users);
</script>
<template>
    <div class="card">
        <DataTable :value="users" showGridlines paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
            <Column field="id" header="ID" sortable></Column>
            <Column field="name" header="Imię" sortable></Column>
            <Column field="last_name" header="Nazwisko" sortable></Column>
            <Column field="phone" header="Nr. Telefonu"></Column>
            <Column field="process" header="Procesy">
                <template #body="{ data }">
                    {{ data.process.map((process) => process.name).join(', ') }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>
