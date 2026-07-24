/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyCwg8YuF1oNhGbhqTwo08wQTjjtYEe9_S4',
  authDomain: 'otter-6bdac.firebaseapp.com',
  projectId: 'otter-6bdac',
  storageBucket: 'otter-6bdac.firebasestorage.app',
  messagingSenderId: '911773858551',
  appId: '1:911773858551:web:dd939daa464da5af74f1f2',
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
