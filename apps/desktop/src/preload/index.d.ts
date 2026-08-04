export interface DesktopApi {
  platform: NodeJS.Platform;
  hostname: string;
  versions: {
    electron: string;
    chrome: string;
    node: string;
  };
}

declare global {
  interface Window {
    api: DesktopApi;
  }
}
