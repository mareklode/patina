export class TabMessenger {
  constructor(channelName) {
    this.channel = new BroadcastChannel(channelName);
    this.pending = new Map();
    this.openedTab = null;
    this.onResponse = null; // Callback for handling responses

    this.channel.onmessage = (event) => {
      const msg = event.data;

      if (msg.type === 'READY' && this.pending.has(msg.requestId)) {
        const payload = this.pending.get(msg.requestId);
        this.channel.postMessage({
          type: 'DATA',
          requestId: msg.requestId,
          payload
        });
        this.pending.delete(msg.requestId);
      } else if (msg.type === 'RESPONSE') {
        console.log('Received from child:', msg.data);
        if (this.onResponse) {
          this.onResponse(msg.data);
        }
      }
    };
  }

  sendToTab(payload) {
    // Send data to an already open tab
    if (this.openedTab && !this.openedTab.closed) {
      this.channel.postMessage({
        type: 'DATA',
        payload
      });
    }
  }

  openTabWithPayload(url, payload) {
    // If tab is already open, send data to it
    if (this.openedTab && !this.openedTab.closed) {
      this.sendToTab(payload);
    } else {
      // Open new tab
      const requestId = crypto.randomUUID();
      this.pending.set(requestId, payload);
      this.openedTab = window.open(`${url}?requestId=${requestId}`, '_blank');
    }
  }

  setResponseHandler(callback) {
    this.onResponse = callback;
  }
}

export const createMessenger = (channelName) => {
  return new TabMessenger(channelName);
};
