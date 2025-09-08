import { Toast } from '@capacitor/toast';

export async function showToast(message) {
  await Toast.show({ text: message });
}
