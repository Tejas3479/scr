class NotificationService {
  private static subscription: PushSubscription | null = null

  /**
   * Initialize the notification service
   */
  static async initialize(): Promise<void> {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', registration)
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  /**
   * Check if notifications are enabled
   */
  static isNotificationEnabled(): boolean {
    return Notification.permission === 'granted'
  }

  /**
   * Subscribe to push notifications
   */
  static async subscribeToNotifications(): Promise<PushSubscription | null> {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.error('Push notifications not supported')
        return null
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      this.subscription = subscription
      await this.sendSubscriptionToServer(subscription)
      return subscription
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error)
      return null
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  static async unsubscribeFromNotifications(): Promise<boolean> {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe()
        this.subscription = null
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to unsubscribe from notifications:', error)
      return false
    }
  }

  /**
   * Send test notification
   */
  static async sendTestNotification(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready
      registration.showNotification('Test Notification', {
        body: 'This is a test notification from Eco Farm',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
      })
    } catch (error) {
      console.error('Failed to send test notification:', error)
    }
  }

  /**
   * Send subscription to server
   */
  private static async sendSubscriptionToServer(
    subscription: PushSubscription
  ): Promise<void> {
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      })
    } catch (error) {
      console.error('Failed to send subscription to server:', error)
    }
  }
}

export default NotificationService
