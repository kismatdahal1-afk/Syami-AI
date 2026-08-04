import { contextBridge } from 'electron';
import os from 'node:os';

const desktopApi = {
  platform: process.platform,
  hostname: os.hostname(),
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
};

contextBridge.exposeInMainWorld('api', desktopApi);
