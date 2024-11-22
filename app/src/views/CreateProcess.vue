<script setup>
import { useLayout } from '@/layout/composables/layout';
import { uuid } from '@primevue/core';
import { Form, FormField } from '@primevue/forms';
import axios from 'axios';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DatePicker from 'primevue/datepicker';
import MultiSelect from 'primevue/multiselect';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref, watch } from 'vue';

const toast = useToast();

const { getPrimary, getSurface, isDarkTheme } = useLayout();
watch([getPrimary, getSurface, isDarkTheme], () => {});

let usersList = reactive([]);
const loading = ref(true);

// Initial values for the form
const form = reactive({
    name: '',
    user_id: '',
    data: []
});

const touchedFields = reactive({
    name: false,
    user_id: false
});

// Initial values for new task input
const newTask = reactive({
    id: '',
    name: '',
    start: '',
    end: '',
    progress: 0,
    dependencies: '',
    _index: 0
});

onMounted(() => {
    fetchUsers();
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

const resolver = ({ values }) => {
    const errors = {
        name: [],
        user_id: []
    };

    if (touchedFields.name && !values.name) {
        errors.name.push({ type: 'required', message: 'Nazwa procesu jest wymagana' });
    }

    if (touchedFields.user_id && !values.user_id) {
        errors.user_id.push({ type: 'required', message: 'Użytkownik jest wymagany.' });
    }

    return { errors };
};

const onSubmit = async (e) => {
    if (!e.valid) return;
    if (form.name === '' && form.user_id === '') {
        touchedFields.name = true;
        touchedFields.user_id = true;
        return;
    }
    if (form.name === '') {
        touchedFields.name = true;
        return;
    } else if (form.user_id === '') {
        touchedFields.user_id = true;
        return;
    }

    let firstDate = '';
    let lastDate = '';

    form.data.forEach((task) => {
        if (!firstDate || new Date(task.start) < new Date(firstDate)) {
            firstDate = task.start;
        }
        if (!lastDate || new Date(task.end) > new Date(lastDate)) {
            lastDate = task.end;
        }
    });

    const summaryTask = {
        id: 'progress',
        name: 'Bieżący postę prac: 0%',
        start: firstDate,
        end: lastDate,
        progress: 0,
        dependencies: [],
        _index: 0
    };

    const processData = {
        name: form.name,
        user_id: form.user_id.id,
        data: JSON.stringify([summaryTask, ...form.data])
    };

    try {
        const response = await axios.post('https://galeon-202410.omnimes.com/api/process', processData);

        if (response.status === 201) {
            toast.add({
                severity: 'success',
                summary: 'Proces dodany',
                detail: `Proces o ID ${response.data.id} został pomyślnie utworzony.`,
                life: 3000
            });

            form.name = '';
            form.user_id = '';
            form.data = [];
            touchedFields.name = false;
            touchedFields.user_id = false;
        } else {
            toast.add({
                severity: 'warn',
                summary: 'Nieoczekiwany problem',
                detail: 'Proces nie został dodany.',
                life: 3000
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Błąd serwera',
            detail: 'Nie udało się dodać procesu. Spróbuj ponownie później.',
            life: 3000
        });
    }
};

function addTask() {
    // Add a new task object to the tasks array
    const deps = newTask.dependencies.length > 0 ? newTask.dependencies.map((dep) => dep.id) : [];

    form.data.push({ ...newTask, id: uuid(), dependencies: deps, _index: form.data.length + 1 });
    // Reset the newTask fields
    Object.keys(newTask).forEach((key) => {
        newTask[key] = key === 'progress' ? 0 : '';
    });
}

function deleteTask(task) {
    // Usuń zadanie z tablicy
    const updatedData = form.data.filter((t) => t.id !== task.id);

    // Usuń zależności od tego zadania
    const cleanedData = updatedData.map((t) => {
        if (t.dependencies.length) {
            const updatedDependencies = t.dependencies.filter((dep) => dep !== task.id);
            return {
                ...t,
                dependencies: updatedDependencies // Aktualizujemy zależności
            };
        }
        return t;
    });

    // Wymuszenie nowego przypisania do reaktywnej zmiennej
    form.data = [...cleanedData];
}
function getNameDep(id) {
    return form.data.find((task) => task.id === id).name;
}
</script>

<template>
    <div class="card">
        <Toast />
        <Form :initialValues="form" :resolver @submit="onSubmit" class="flex flex-col gap-4 w-full mb-10">
            <section class="flex flex-row flex-wrap gap-4">
                <FormField name="name" class="flex flex-col gap-1 w-[250px]">
                    <label for="name">Nazwa procesu</label>
                    <InputText id="name" v-model="form.name" type="text" placeholder="Nazwa procesu" @blur="touchedFields.name = true" />
                    <Message v-if="touchedFields.name && !form.name" severity="error" size="small" variant="simple" class="p-message-error">Imię jest wymagane. </Message>
                </FormField>

                <FormField name="user_id" class="flex flex-col gap-1 w-[250px]">
                    <label for="user_id">Użytkownik</label>
                    <Select id="user_id" v-model="form.user_id" :options="usersList" optionLabel="full_name" placeholder="Wybierz użytkownika" class="" @blur="touchedFields.user_id = true" />
                    <Message v-if="touchedFields.user_id && !form.user_id" severity="error" size="small" variant="simple" class="p-message-error">Użytkownik jest wymagany. </Message>
                </FormField>
                <Button :disabled="!form.data.length" type="submit" severity="primary" label="Zapisz" :class="[(touchedFields.name && !form.name) || (touchedFields.user_id && !form.user_id) ? '!my-auto' : '', 'w-[250px]', 'mt-auto']" />
            </section>
        </Form>

        <h2 class="mb-4 font-bold text-lg">Dodaj zadania do procesu</h2>

        <div class="flex flex-col gap-4">
            <section class="flex flex-wrap gap-4">
                <FormField name="name" class="flex flex-col gap-2">
                    <label for="name-task">Nazwa zadania</label>
                    <InputText id="name-task" v-model="newTask.name" placeholder="Nazwa zadania" aria-describedby="Nazwa zadania" class="w-[250px]" />
                    <small>Wprowadź nazwę zadania</small>
                </FormField>
                <FormField name="name" class="flex flex-col gap-2">
                    <label for="calendar-24h-start">Data rozpoczęcia zadania</label>
                    <DatePicker id="calendar-24h-start" v-model="newTask.start" dateFormat="dd/mm/yy" showTime hourFormat="24" placeholder="Data początkowa" class="w-[250px]" />
                    <small>Wybierz datę</small>
                </FormField>
                <FormField name="name" class="flex flex-col gap-2">
                    <label for="calendar-24h-end">Data zakończenia zadania</label>
                    <DatePicker id="calendar-24h-end" v-model="newTask.end" dateFormat="dd/mm/yy" showTime hourFormat="24" placeholder="Data końcowa" class="w-[250px]" />
                    <small>Wybierz datę</small>
                </FormField>
                <FormField name="name" class="flex flex-col gap-2">
                    <label for="select">Zależności zadania</label>
                    <MultiSelect id="select" v-model="newTask.dependencies" :options="form.data" optionLabel="name" placeholder="Wybierz zależności" class="w-[250px]" />
                    <small>Wybierz zalezności</small>
                </FormField>
                <Button label="Dodaj zadanie" @click="addTask" class="w-[250px] my-auto" />
            </section>

            <DataTable v-if="form.data.length" :key="form.data" :value="form.data">
                <Column field="name" header="Nazwa"></Column>
                <Column field="start" header="Rozpoczęcie">
                    <template #body="{ data }">
                        {{ new Date(data.start).toLocaleString() }}
                    </template>
                </Column>
                <Column field="end" header="Zakończenie">
                    <template #body="{ data }">
                        {{ new Date(data.end).toLocaleString() }}
                    </template>
                </Column>
                <Column field="dependencies" header="Zależności">
                    <template #body="{ data }">
                        <ul>
                            <li v-for="dep in data.dependencies" :key="dep">{{ getNameDep(dep) }}</li>
                        </ul>
                    </template>
                </Column>
                <Column class="w-24 !text-end">
                    <template #body="{ data }">
                        <Button class="p-button-danger" icon="pi pi-trash" @click="deleteTask(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
