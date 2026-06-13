// src/utils/BroadcastService.js
export const broadcastUpdate = (type, id, ten, status) => {
  const channel = new BroadcastChannel('data_update_channel')
  channel.postMessage({ type, id, ten, status })
  channel.close()
}

export const listenUpdate = (callback) => {
  const channel = new BroadcastChannel('data_update_channel')
  channel.onmessage = (event) => callback(event.data)
}
