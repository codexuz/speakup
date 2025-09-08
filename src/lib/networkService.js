// networkStatus.js

import { Network } from '@capacitor/network';

class NetworkService {
  constructor() {
    this.initializeListeners();
  }

  initializeListeners() {
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      // You can add additional logic here, such as broadcasting events or updating UI.
    });
  }

  async getCurrentStatus() {
    const status = await Network.getStatus();
    return status;
  }
}

const networkService = new NetworkService();
export { networkService }; // Exporting the networkService instance
