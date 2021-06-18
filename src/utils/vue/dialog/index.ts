import { App, Plugin } from 'vue';
import Dialog, { ComponentOption, DialogOption } from './Dialog';
import { confirm as _confirm } from './confirm';

export const dialogs: Dialog[] = [];

export type Open = InstanceType<typeof Dialog>['open'];


export const getCurrentDialog = () => {
  return dialogs[dialogs.length - 1];
};

const dialogHepler = {
  open(...args: Parameters<Open>): ReturnType<Open> {
    const dialogVm = new Dialog();
    dialogs.push(dialogVm);
    return dialogVm.open(...args);
  },
  confirm: _confirm,
  getCurrentDialog,
  install(app: App) {
    app.config.globalProperties.$dialog = dialogHepler.open;
  },
};


export const dialog = dialogHepler.open;
export const { confirm } = dialogHepler;


export default dialogHepler;

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dialog: typeof dialogHepler.open
  }
}
