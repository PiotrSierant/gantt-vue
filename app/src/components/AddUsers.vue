<script setup>
import { reactive } from 'vue';
import { Form, FormField } from '@primevue/forms';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const emit = defineEmits(['userAdded']);

// Initial values for the form
const form = reactive({
    firstname: '',
    lastname: '',
    phone: ''
});

const touchedFields = reactive({
    firstname: false,
    lastname: false,
    phone: false
});

// Resolver function for validation
const resolver = ({ values }) => {
    const errors = {
        firstname: [],
        lastname: [],
        phone: []
    };

    if (touchedFields.firstname && !values.firstname) {
        errors.firstname.push({ type: 'required', message: 'Imię jest wymagane.' });
    }

    if (touchedFields.lastname && !values.lastname) {
        errors.lastname.push({ type: 'required', message: 'Nazwisko jest wymagane.' });
    }

    if (touchedFields.phone && !values.phone) {
        errors.phone.push({ type: 'required', message: 'Numer telefonu jest wymagany.' });
    }

    return { errors };
};

// Handle form submission
const onSubmit = async (e) => {
    if (!e.valid) return;
    const { firstname, lastname, phone } = e.states;
    const data = {
        name: firstname.value,
        last_name: lastname.value,
        phone: phone.value
    };

    try {
        const response = await axios.post(`https://galeon-202410.omnimes.com/api/users`, data);
        if (response.data.message) {
            toast.add({ severity: 'success', summary: 'Użytkownik dodany.', life: 3000 });
            emit('userAdded', response.data.user);
        } else {
            toast.add({ severity: 'success', summary: 'Wystąpił błąd.', life: 3000 });
        }
    } catch (error) {
        console.error('Błąd:', error);
    }
};
</script>

<template>
    <div class="card flex justify-center">
        <Toast />
        <Form :initialValues="form" :resolver="resolver" @submit="onSubmit" class="flex flex-col gap-4 w-full">
            <FormField name="firstname" class="flex flex-col gap-1">
                <InputText v-model="form.firstname" type="text" placeholder="Imię" @blur="touchedFields.firstname = true" />
                <Message v-if="touchedFields.firstname && !form.firstname" severity="error" size="small" variant="simple" class="p-message-error">Imię jest wymagane.</Message>
            </FormField>

            <FormField name="lastname" class="flex flex-col gap-1">
                <InputText v-model="form.lastname" type="text" placeholder="Nazwisko" @blur="touchedFields.lastname = true" />
                <Message v-if="touchedFields.lastname && !form.lastname" severity="error" size="small" variant="simple" class="p-message-error">Nazwisko jest wymagane.</Message>
            </FormField>

            <FormField name="phone" class="flex flex-col gap-1">
                <InputText v-model="form.phone" placeholder="Numer telefonu" @blur="touchedFields.phone = true" />
                <Message v-if="touchedFields.phone && !form.phone" severity="error" size="small" variant="simple" class="p-message-error">Numer telefonu jest wymagany.</Message>
            </FormField>

            <Button type="submit" severity="primary" label="Submit" />
        </Form>
    </div>
</template>
