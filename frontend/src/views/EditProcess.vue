<script setup>
import { useLayout } from '@/layout/composables/layout';
import { Form, FormField } from '@primevue/forms';
import { reactive, onMounted, watch, ref } from 'vue';
import axios from 'axios';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DatePicker from 'primevue/datepicker';
import MultiSelect from 'primevue/multiselect';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import SaveLoader from '@/components/SaveLoader.vue';
import { v4 as uuidv4 } from 'uuid';

const toast = useToast();
const { getPrimary, getSurface, isDarkTheme } = useLayout();
watch([getPrimary, getSurface, isDarkTheme], () => {});
let usersList = reactive([]);
const loading = ref(true);
const saveLoader = ref(false);

const route = useRoute();
const processId = ref(route.params.id);
let idGanttTask = ref(null);
const selectValue = ref(null);
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

onMounted(async () => {
    await fetchUsers();
    await fetchProcessDetail();
    loading.value = false;
});

const fetchProcessDetail = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/process/${processId.value}`);
        if (response.data.message) {
            // Jeśli brak danych, ustaw loading i puste zadania
            form.data.splice(0, form.data.length); // Czyścimy listę zadań
            form.name = '';
            form.user_id = '';
        } else {
            idGanttTask.value = response.data.id;
            // Przypisujemy dane reaktywnie, konwertując dependencies do odpowiedniego formatu
            form.data.splice(
                0,
                form.data.length,
                ...JSON.parse(response.data.data).map((item) => ({
                    ...item,
                    start: new Date(item.start),
                    end: new Date(item.end),
                    dependencies: item.dependencies.length
                        ? item.dependencies
                              .map((depId) => {
                                  const dependency = JSON.parse(response.data.data).find((task) => task.id === depId);
                                  return dependency ? { id: dependency.id, name: dependency.name } : null;
                              })
                              .filter(Boolean)
                        : []
                }))
            );

            selectValue.value = form.data.map((task) => ({ id: task.id, name: task.name }));
            form.name = response.data.name;
            form.user_id = usersList.find((user) => user.id == response.data.user_id) || null;
        }
    } catch (error) {
        console.error('Błąd:', error);
    }
};
async function fetchUsers() {
    axios
        .get(`http://localhost:3000/api/users-list`)
        .then((response) => {
            usersList.splice(0, usersList.length, ...response.data);
        })
        .catch((error) => {
            console.error('Error fetching users:', error);
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
async function onSubmit() {
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

    const processData = {
        name: form.name,
        user_id: form.user_id.id,
        data: JSON.stringify(form.data)
    };
    try {
        const response = await axios.put(`http://localhost:3000/api/process/${processId.value}`, processData);

        if (response.status === 200) {
            toast.add({
                severity: 'success',
                summary: 'Pomyślnie edytowano proces',
                detail: `Proces o ID ${response.data.id} został pomyślnie zmodyfikowany.`,
                life: 3000
            });
        } else if (response.status === 404) {
            toast.add({
                severity: 'warn',
                summary: 'Proces nie znaleziony',
                detail: `Proces o ID ${processId.value} nie został znaleziony w bazie danych.`,
                life: 3000
            });
        } else {
            toast.add({
                severity: 'warn',
                summary: 'Nieoczekiwany problem',
                detail: 'Proces nie został zaaktualizowany.',
                life: 3000
            });
        }
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 404) {
                toast.add({
                    severity: 'warn',
                    summary: 'Proces nie znaleziony',
                    detail: `Proces o ID ${processId.value} nie został znaleziony w bazie danych.`,
                    life: 3000
                });
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Błąd serwera',
                    detail: data?.error || 'Wystąpił błąd podczas aktualizacji procesu. Spróbuj ponownie później.',
                    life: 3000
                });
            }
        } else {
            toast.add({
                severity: 'error',
                summary: 'Błąd połączenia',
                detail: 'Nie udało się połączyć z serwerem. Spróbuj ponownie później.',
                life: 3000
            });
        }
    } finally {
        saveLoader.value = false;
    }
}
async function addTask() {
    handleToggleSaveLoader();
    const deps = newTask.dependencies.length > 0 ? newTask.dependencies.map((dep) => ({ id: dep.id, name: dep.name })) : [];
    form.data.push({ ...newTask, id: uuidv4(), dependencies: deps, _index: form.data.length });
    Object.keys(newTask).forEach((key) => {
        newTask[key] = key === 'progress' ? 0 : '';
    });
    await onSubmit();
}
async function deleteTask(task) {
    handleToggleSaveLoader();
    const updatedData = form.data.filter((t) => t.id !== task.id);
    const cleanedData = updatedData.map((t) => {
        if (t.dependencies.length) {
            const updatedDependencies = t.dependencies.filter((dep) => dep.id !== task.id);
            return {
                ...t,
                dependencies: updatedDependencies
            };
        }
        return t;
    });
    form.data = [...cleanedData];
    await onSubmit();
}
async function onRowReorder(event) {
    handleToggleSaveLoader();
    // plus jeden ze wzgledu na to ze wyswietlam tam bez indexu 0
    const oldIndex = event.dragIndex + 1;
    const newIndex = event.dropIndex + 1;

    // Wyciągamy przesuwany element
    const movedTask = form.data.splice(oldIndex, 1)[0];

    // Wstawiamy element w nowe miejsce
    form.data.splice(newIndex, 0, movedTask);

    // Aktualizujemy indeksy wszystkich elementów zgodnie z ich pozycją w tablicy
    form.data.forEach((task, index) => {
        task._index = index;
    });

    // Tworzymy nową referencję dla form.data, aby Vue zareagował na zmiany
    form.data = [...form.data];
    // zapis
    await onSubmit();
}
function handleToggleSaveLoader() {
    saveLoader.value = true;
}
</script>

<template>
    <div class="card w-full relative">
        <SaveLoader v-if="saveLoader" />

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
                    <MultiSelect id="select" v-model="newTask.dependencies" :options="form.data.filter((item) => item.id != 'progress')" optionLabel="name" placeholder="Wybierz zależności" class="w-[250px]" />
                    <small>Wybierz zalezności</small>
                </FormField>
                <Button label="Dodaj zadanie" @click="addTask" class="w-[250px] my-auto" />
            </section>

            <Skeleton v-if="loading" width="100%" height="400px"></Skeleton>
            <Message v-if="!loading && !(form.data.length > 0)" severity="warn">Nie znaleziono procesu.</Message>
            <DataTable v-if="form.data.length" :key="form.data" :value="form.data.filter((item) => item.id != 'progress')" resizableColumns showGridlines @rowReorder="onRowReorder">
                <Column field="name" header="Nazwa" style="min-width: 100px">
                    <template #body="{ data }">
                        <InputText
                            v-model="data.name"
                            placeholder="Nazwa zadania"
                            aria-describedby="Nazwa zadania"
                            class="w-full"
                            @blur="
                                handleToggleSaveLoader();
                                onSubmit();
                            "
                        />
                    </template>
                </Column>
                <Column field="start" header="Rozpoczęcie" style="min-width: 90px; max-width: 90px">
                    <template #body="{ data }">
                        <DatePicker v-model="data.start" dateFormat="dd/mm/yy" showTime hourFormat="24" placeholder="Data początkowa" class="w-full" @update:modelValue="onSubmit" />
                    </template>
                </Column>
                <Column field="end" header="Zakończenie" style="min-width: 90px; max-width: 90px">
                    <template #body="{ data }">
                        <DatePicker v-model="data.end" dateFormat="dd/mm/yy" showTime hourFormat="24" placeholder="Data końcowa" class="w-full" @update:modelValue="onSubmit" />
                    </template>
                </Column>
                <Column field="dependencies" header="Zależności" style="min-width: 100px">
                    <template #body="{ data }">
                        <MultiSelect v-model="data.dependencies" :options="selectValue" optionLabel="name" placeholder="Wybierz zależności" class="w-full" @blur="onSubmit()" />
                    </template>
                </Column>
                <Column field="progress" header="Progres(%)" style="min-width: 50px; max-width: 50px">
                    <template #body="{ data }">
                        <InputText
                            v-model="data.progress"
                            placeholder="progress"
                            aria-describedby="Progres zadania"
                            class="w-full"
                            @blur="
                                handleToggleSaveLoader();
                                onSubmit();
                            "
                        />
                    </template>
                </Column>
                <Column class="w-24 !text-end" style="min-width: 50px; max-width: 60px">
                    <template #body="{ data }">
                        <Button class="p-button-danger" icon="pi pi-trash" @click="deleteTask(data)" />
                    </template>
                </Column>
                <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false" />
            </DataTable>
        </div>
    </div>
</template>
