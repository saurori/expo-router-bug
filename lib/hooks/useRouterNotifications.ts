import { useRouter } from 'expo-router';
import React from 'react';
import * as Notifications from 'expo-notifications';

export function useRouterNotifications() {
  const router = useRouter();

  React.useEffect(() => {
    let isMounted = true;

    const redirect = (notification: Notifications.Notification) => {
      const url = notification.request.content.data?.url;
      if (url) {
        console.log('redirect to:', url);
        router.push(url);
      }
    }

    // Handle URL from expo push notifications
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        console.log('not mounted');
        return;
      }
      console.log('mounted');
      redirect(response?.notification);
    });

    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('subscription redirect');
      redirect(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}
