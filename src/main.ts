import { registerHook, registerShortcut, VKey } from "@smiilliin/keyhook";
import SettingManager from "@smiilliin/settings";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

let mainWindow: BrowserWindow;
const createMainWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 0,
    height: 0,
    frame: false,
    transparent: true,
    show: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../index.html"));
  mainWindow.on("close", (event) => {
    event.preventDefault();
  });
};
interface ISettings {
  interval: number;
  imageURL: string;
  text: string;
  width: number;
  height: number;
}

app.on("ready", () => {
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: true,
    });
  }
  createMainWindow();

  const settingManager = new SettingManager("save-alert");

  const settingDefault = {
    interval: 3 * 60 * 1000,
    imageURL: "https://media.tenor.com/8AqUPOC5GMgAAAAi/parrot-party.gif",
    text: "제발 파일을 저장하세요\n(Esc로 창 닫기)",
    width: 500,
    height: 500,
  };
  let { interval, imageURL, text, width, height } =
    settingManager.load<ISettings>("settings.json", settingDefault);
  mainWindow.setSize(width, height);

  ipcMain.on("open", () => {
    mainWindow.webContents.send("image-url", imageURL);
    mainWindow.webContents.send("text", text);
  });
  ipcMain.on("close-window", () => {
    hideWindow();
  });
  mainWindow.on("blur", () => {
    hideWindow();
  });

  const hideWindow = () => {
    mainWindow.hide();
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunc, interval);
  };
  const timeoutFunc = () => {
    mainWindow.center();
    mainWindow.show();
    mainWindow.moveTop();
    mainWindow.focus();
  };
  let timeout = setTimeout(timeoutFunc, interval);

  settingManager.watch(
    "settings.json",
    (options) => {
      interval = options.interval;
      clearTimeout(timeout);
      timeout = setTimeout(timeoutFunc, interval);

      imageURL = options.imageURL;
      mainWindow.webContents.send("image-url", imageURL);
      text = options.text;
      mainWindow.webContents.send("text", text);

      width = options.width;
      height = options.height;
      mainWindow.setSize(width, height);
    },
    settingDefault
  );

  registerShortcut([VKey.VK_CONTROL, "s"], () => {
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunc, interval);
  });
  registerShortcut([VKey.VK_ESCAPE], () => {
    hideWindow();
  });
  registerHook();
});

app.on("window-all-closed", () => {
  app.quit();
});
