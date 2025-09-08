import { ref } from 'vue';
import { networkService } from '@/lib/networkService.js';

export function useNetwork() {
  const networkStatus = ref(null);

  networkService.getCurrentStatus().then((status) => {
    networkStatus.value = status.connected;
  });

  return { networkStatus };
}
