const CDN_PREFIX: string = "https://cdn-url.com";

export const cdnPath = (path: string): string => {
  if (!path) return "";
  return `${CDN_PREFIX}${path.startsWith("/") ? path : `/${path}`}`;
};
