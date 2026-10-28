import { LocalNotifications } from '@capacitor/local-notifications';

export interface WeeklyReminderConfig {
  enabled: boolean;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  hour: number; // 0-23
  minute: number; // 0-59
}

const REMINDER_STORAGE_KEY = 'fakkerfeha_weekly_reminder_v1';

export const NotificationManager = {
  async requestPermission(): Promise<boolean> {
    try {
      // 1. Try Capacitor Local Notifications
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display === 'granted') {
        return true;
      }
    } catch {
      // Not running in native capacitor environment or web fallback
    }

    // 2. Fall back to Web Notification API
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') return true;
      const res = await Notification.requestPermission();
      return res === 'granted';
    }

    return false;
  },

  getConfig(): WeeklyReminderConfig {
    if (typeof window === 'undefined') {
      return { enabled: false, dayOfWeek: 5, hour: 19, minute: 0 }; // Default Friday 7 PM
    }
    try {
      const saved = localStorage.getItem(REMINDER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return { enabled: false, dayOfWeek: 5, hour: 19, minute: 0 };
  },

  async saveConfig(config: WeeklyReminderConfig): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(config));
      if (config.enabled) {
        await this.scheduleNotification(config);
      } else {
        await this.cancelAll();
      }
    } catch {
      // ignore
    }
  },

  async scheduleNotification(config: WeeklyReminderConfig): Promise<void> {
    try {
      // Cancel previous scheduled notifications
      await LocalNotifications.cancel({ notifications: [{ id: 101 }] });

      // Calculate next trigger date based on dayOfWeek, hour, minute
      const now = new Date();
      const target = new Date();
      target.setHours(config.hour, config.minute, 0, 0);

      const currentDay = now.getDay();
      let dayDiff = config.dayOfWeek - currentDay;
      if (dayDiff < 0 || (dayDiff === 0 && now.getTime() >= target.getTime())) {
        dayDiff += 7;
      }
      target.setDate(now.getDate() + dayDiff);

      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'جلسة نسمة حياة الأسبوعية 🛋️',
            body: 'حان موعد جلستك النفسية الأسبوعية المخصصة. خذ وقفة هادئة لتفقد سلامك الداخلي.',
            id: 101,
            schedule: { at: target, repeats: true, every: 'week' },
            sound: undefined,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    } catch {
      // Fallback for web or non-native execution
    }
  },

  async cancelAll(): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: 101 }] });
    } catch {
      // ignore
    }
  }
};
