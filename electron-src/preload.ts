/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  test: async () => await ipcRenderer.invoke("test", "message: test"),
});
