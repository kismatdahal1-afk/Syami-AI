import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { app, BrowserWindow, shell } from 'electron';

/** Resolve the Syami AI logo for the window icon across dev + build layouts. */
const resolveAppIcon = (): string | undefined => {
  const candidates = [
    // .ico used by electron-builder (best for Windows window/taskbar icon)
    join(app.getAppPath(), 'build/logo.ico'),
    // electron-vite build output (out/main -> out/renderer)
    join(__dirname, '../renderer/assets/images/logo/syami-logo.png'),
    // vite public dir during `npm run dev`
    join(app.getAppPath(), 'src/renderer/public/assets/images/logo/syami-logo.png'),
  ];
  return candidates.find((candidate) => existsSync(candidate));
};

const createMainWindow = (): void => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#070b1a',
    icon: resolveAppIcon(),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    void shell.openExternal(details.url);
    return { action: 'deny' };
  });

  const devServerUrl = process.env['ELECTRON_RENDERER_URL'];

  if (!app.isPackaged && devServerUrl) {
    void mainWindow.loadURL(devServerUrl);
  } else {
    void mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
};

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
