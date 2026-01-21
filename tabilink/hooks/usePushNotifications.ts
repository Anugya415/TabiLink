import { useState, useEffect } from 'react';
import axios from 'axios';

const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const usePushNotifications = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window && PUBLIC_VAPID_KEY) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    setRegistration(reg);
                    reg.pushManager.getSubscription()
                        .then(sub => {
                            if (sub) {
                                setSubscription(sub);
                                setIsSubscribed(true);
                            }
                        });
                })
                .catch(err => console.error('Service Worker registration failed:', err));
        }
    }, []);

    const subscribeUser = async () => {
        if (!registration || !PUBLIC_VAPID_KEY) {
            setError('Push notifications not supported or not configured');
            return;
        }
        setLoading(true);
        try {
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
            });

            setSubscription(sub);
            setIsSubscribed(true);

            // Send subscription to backend
            const token = localStorage.getItem('token'); // Simplistic token retrieval
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/auth/push/subscribe`, sub, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('User subscribed to push notifications');
        } catch (err: any) {
            console.error('Failed to subscribe the user: ', err);
            setError(err.message || 'Failed to subscribe');
        } finally {
            setLoading(false);
        }
    };

    const unsubscribeUser = async () => {
        if (!subscription) return;
        setLoading(true);
        try {
            await subscription.unsubscribe();

            // Send unsubscribe to backend
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/auth/push/unsubscribe`, {
                endpoint: subscription.endpoint
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSubscription(null);
            setIsSubscribed(false);
            console.log('User unsubscribed from push notifications');
        } catch (err: any) {
            console.error('Error unsubscribing', err);
            setError(err.message || 'Error unsubscribing');
        } finally {
            setLoading(false);
        }
    };

    return {
        isSubscribed,
        subscription,
        subscribeUser,
        unsubscribeUser,
        loading,
        error
    };
};
