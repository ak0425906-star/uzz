import webpush from "web-push";

export const initWebPush = () => {
    const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

    if (!publicVapidKey || !privateVapidKey) {
        console.error("VAPID keys are missing");
        return false;
    }

    webpush.setVapidDetails(
        process.env.VAPID_SUBJECT || "mailto:ak0425906@gmail.com",
        publicVapidKey,
        privateVapidKey
    );
    return true;
};

export const sendPushNotification = async (subscription, payload) => {
    if (!initWebPush()) return;
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
        return true;
    } catch (err) {
        console.error("Push notification failed:", err);
        return false;
    }
};
