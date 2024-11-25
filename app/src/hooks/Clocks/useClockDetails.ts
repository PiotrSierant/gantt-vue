import axios from 'axios';
import { pl } from 'date-fns/locale';
import { format } from 'date-fns';
import { ref, computed, onMounted, onUnmounted } from 'vue';

type Clock = {
    data: string;
    name: string;
    user: object;
    progress: number;
}

type ParsedData = {
    start: string;
    end: string;
    name: string;
    progress: number;
}

export function useClockDetails(clockId: number) {
  const clock = ref<Clock | null>(null);
  const isLoading = ref(true);
  const currentDate = ref(new Date());
  const progress = ref(0);
  const parsedData = ref<ParsedData[]>([]);

  const fetchClockDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/dashboard-zegary/${clockId}`);
      clock.value = response.data;
      parsedData.value = clock.value ? JSON.parse(clock.value.data) : [];
    } catch (error) {
      console.error(`Error fetching clock details ${clockId}:`, error);
    } finally {
      isLoading.value = false;
    }
  };

  const updateCurrentDate = () => {
    currentDate.value = new Date();
  };

  onMounted(() => {
    fetchClockDetails();
    const updateInterval = setInterval(fetchClockDetails, 5000);
    const timeInterval = setInterval(updateCurrentDate, 1000);

    onUnmounted(() => {
      clearInterval(updateInterval);
      clearInterval(timeInterval);
    });
  });

  const name = computed(() => clock.value?.name || 'No name');
  const formattedNowDate = computed(() => format(currentDate.value, 'dd MMM yyyy / HH:mm', { locale: pl }));
  const user = computed(() => clock.value?.user || {});
  
  const lastDate = computed(() => (parsedData.value[0]?.end ? new Date(parsedData.value[0].end) : null));
  
  const daysLeft = computed(() => {
    if (!lastDate.value) return 0;
    const timeDifference = lastDate.value.getTime() - currentDate.value.getTime();
    return timeDifference > 0 ? Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) : 0;
  });

  progress.value = clock.value?.progress || 0;

  const progressClass = computed(() => {
    if (progress.value <= 20) return 'bg-red-600';
    if (progress.value <= 50) return 'bg-yellow-500';
    if (progress.value <= 80) return 'bg-blue-600';
    return 'bg-green-600';
  });

  return {
    isLoading,
    name,
    formattedNowDate,
    user,
    parsedData,
    daysLeft,
    progress,
    progressClass,
  };
}
