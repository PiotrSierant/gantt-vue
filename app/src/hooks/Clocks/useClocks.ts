import { ref, onMounted } from 'vue';
import axios from 'axios';

export function useClocks() {
    const clocks = ref([]);
    const isLoading = ref(true);

    const fetchClocks = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/dashboard-zegary`);
            clocks.value = response.data;
        } catch (error) {
            console.error('Error fetching clocks list:', error);
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        fetchClocks();
        setInterval(fetchClocks, 5000);
    });

    return { clocks, isLoading };
}
