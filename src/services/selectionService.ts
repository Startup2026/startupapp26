import { apiFetch } from "@/lib/api";

export const selectionService = {
  notifyShortlisted(data: { subject: string; message: string; applicationIdList: string[] }) {
    return apiFetch("/shortlists/notify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  notifySelected(data: { subject: string; message: string; applicationIdList: string[] }) {
    return apiFetch("/selections/notify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  notifyRejected(data: { subject: string; message: string; applicationIdList: string[] }) {
    return apiFetch("/rejections/notify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
