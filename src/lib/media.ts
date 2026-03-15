export const resolveMediaUrl = (baseUrl: string, mediaPath?: string | null): string => {
  if (!mediaPath) return "";
  if (/^https?:\/\//i.test(mediaPath)) return mediaPath;
  return `${baseUrl}${mediaPath}`;
};
