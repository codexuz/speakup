import { useRouter } from 'vue-router';
import { Toast } from '@capacitor/toast';
import { networkService } from '@/lib/networkService.js';

export function useNavigation() {
  const router = useRouter();

  async function navigate(link) {
    const status = await networkService.getCurrentStatus();
    if (!status.connected) {
      await Toast.show({ text: "Internet aloqasi yo'q" });
    } else {
      router.push(link);
    }
  }

  return { navigate };
}
