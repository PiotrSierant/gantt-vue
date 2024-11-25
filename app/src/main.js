import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

const app = createApp(App);
app.use(router)
    .use(ToastService)
    .use(ConfirmationService)
    .use(PrimeVue, {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '.app-dark',
                order: 'tailwind-base, primevue, tailwind-utilities'
            }
        }
    });
app.mount('#app');
