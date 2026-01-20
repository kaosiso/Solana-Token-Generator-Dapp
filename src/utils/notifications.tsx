import { useNotificationStore } from "stores/useNotificationStore";

export function notify(newNotification: {
  type?: "success" | "error" | "info";
  message: string;
  description?: string;
  txid?: string;
}) {
  const setNotificationStore = useNotificationStore.getState().set;

  setNotificationStore((state) => {
    state.notifications.push({
      type: newNotification.type || "success",
      message: newNotification.message,
      description: newNotification.description || "",
      txid: newNotification.txid,
    });
  });
}
