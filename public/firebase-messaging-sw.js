/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyDQ_2x_veKhySiORFRc_6HpjcDaPlx6KBE',
  authDomain: 'otter-78857.firebaseapp.com',
  projectId: 'otter-78857',
  storageBucket: 'otter-78857.firebasestorage.app',
  messagingSenderId: '523879790697',
  appId: '1:523879790697:web:113c764eaab668bebacaf8',
  measurementId: 'G-BENPFYCBZM',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const title =
    payload.notification?.title
    || payload.data?.title
    || 'Оттер — напоминание'
  const body =
    payload.notification?.body
    || payload.data?.body
    || payload.data?.task_title
    || ''
  const taskId = payload.data?.task_id || ''
  const options = {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      ...(payload.data || {}),
      task_id: taskId,
      deeplink: payload.data?.deeplink || (taskId ? `otter://tasks/${taskId}` : ''),
    },
    tag: taskId ? `task-${taskId}` : undefined,
  }
  return self.registration.showNotification(title, options)
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const data = event.notification.data || {}
  const taskId = data.task_id || ''
  const target = taskId
    ? `/app/new-task?id=${encodeURIComponent(taskId)}&returnTo=${encodeURIComponent('/app')}`
    : '/app'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.focus()
          if ('navigate' in client) {
            return client.navigate(target)
          }
          return undefined
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(target)
      }
      return undefined
    }),
  )
})
