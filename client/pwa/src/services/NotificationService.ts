/**
 * Notification Service for PWA
 * Handles Web Push notifications and notification management
 */

export interface PushNotification {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: Record<string, any>
}

export class NotificationService {
  private static instance: NotificationService
  private swRegistration: ServiceWorkerRegistration | null = null

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  /**
   * Initialize notification service
   * Register service worker and request permissions
   */
  async initialize(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers not supported')
      return
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js')
      console.log('✅ Service Worker registered for notifications')

      // Check for existing subscription
      const subscription = await this.getSubscription()
      if (!subscription && this.isNotificationEnabled()) {
        // Auto-subscribe if permission already granted
        await this.subscribeToNotifications()
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  /**
   * Request permission and subscribe to push notifications
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToNotifications(): Promise<PushSubscription | null> {
    try {
      if (!this.swRegistration) {
        console.error('Service Worker not registered')
        return null
      }

      // Check if already subscribed
      const existing = await this.getSubscription()
      if (existing) {
        return existing
      }

      // Request permission first
      const hasPermission = await this.requestNotificationPermission()
      if (!hasPermission) {
        return null
      }

      // Subscribe to push
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.getApplicationServerKey(),
      })

      // Store subscription on server
      await this.storeSubscription(subscription)

      console.log('✅ Subscribed to push notifications')
      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromNotifications(): Promise<boolean> {
    try {
      const subscription = await this.getSubscription()
      if (!subscription) {
        return true
      }

      await subscription.unsubscribe()
      await this.removeSubscription()

      console.log('✅ Unsubscribed from push notifications')
      return true
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
      return false
    }
  }

  /**
   * Send local notification (for testing or immediate alerts)
   */
  async sendLocalNotification(notification: PushNotification): Promise<void> {
    try {
      if (!this.swRegistration) {
        console.error('Service Worker not registered')
        return
      }

      await this.swRegistration.showNotification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/icon-192x192.png',
        badge: notification.badge || '/icon-192x192.png',
        tag: notification.tag || 'default',
        data: notification.data,
        requireInteraction: false,
      })

      console.log('✅ Notification sent:', notification.title)
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  /**
   * Check if notifications are enabled
   */
  isNotificationEnabled(): boolean {
    return 'Notification' in window && Notification.permission === 'granted'
  }

  /**
   * Get current push subscription
   */
  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      return null
    }

    return await this.swRegistration.pushManager.getSubscription()
  }

  /**
   * Store subscription on server
   */
  private async storeSubscription(subscription: PushSubscription): Promise<void> {
    try {
      // Store in localStorage for offline access
      localStorage.setItem('push_subscription', JSON.stringify(subscription))

      // Optional: Send to server for backend push management
      // await fetch('/api/v1/notifications/subscribe', {
      //   method: 'POST',
      //   body: JSON.stringify(subscription),
      //   headers: { 'Content-Type': 'application/json' }
      // })
    } catch (error) {
      console.error('Failed to store subscription:', error)
    }
  }

  /**
   * Remove stored subscription
   */
  private async removeSubscription(): Promise<void> {
    try {
      localStorage.removeItem('push_subscription')

      // Optional: Notify server
      // await fetch('/api/v1/notifications/unsubscribe', { method: 'POST' })
    } catch (error) {
      console.error('Failed to remove subscription:', error)
    }
  }

  /**
   * Get application server key for push notifications
   * NOTE: Replace with your actual VAPID public key
   */
  private getApplicationServerKey(): Uint8Array {
    // This is a placeholder - replace with actual VAPID public key
    const base64 = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
      'BEl62iUm-Z2-tdyFTyp8GiDlw1SJg8ohBnH28PoGKeRS_LQ9yUhWiNqFTV-hWAqPmFQbV-_mXlPYeomLSnotUU'
    
    const padding = '='.repeat((4 - base64.length % 4) % 4)
    const binary = atob((base64 + padding).replace(/\-/g, '+').replace(/_/g, '/'))
    const bytes = new Uint8Array(binary.length)
    
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    
    return bytes
  }

  /**
   * Send test notification (for development)
   */
  async sendTestNotification(): Promise<void> {
    await this.sendLocalNotification({
      title: '🎮 FarmQuest Nexus',
      body: 'Test notification - Your platform is ready!',
      icon: '/icon-192x192.png',
      tag: 'test',
      data: { type: 'test' },
    })
  }
}

export default NotificationService.getInstance()
