export interface DesktopApi {
  platform: NodeJS.Platform;
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
