/* eslint-disable class-methods-use-this */
import Vue, {
  createApp, h, ComponentOptionsMixin, defineComponent, reactive, ref, AllowedComponentProps, ComponentCustomProps, VNodeProps,
} from 'vue';
import { ElDialog } from 'element-plus';

import deepmerge from 'deepmerge';
import app from '@/app';
import { extendRootApp } from '@/pc-main';
import AppError from '@/utils/error';
import DialogWrap from './DialogWrap.vue';
import { dialogs } from './index';


type DialogVm = InstanceType<typeof ElDialog> | null;
type DialogWrapVm = InstanceType<typeof DialogWrap> | null;
type PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps;
export type ElDialogProps = Partial<InstanceType<typeof ElDialog>['$props']>;
interface Data {
  [key: string]: unknown
}

export interface ComponentOption {
  is: ComponentOptionsMixin,
  props?: PublicProps & Data,
  showBtn?: boolean,
  cancelText?: string,
  confirmText?: string,
  slots?: unknown
}

export type DialogOption = {
  props?: ElDialogProps
  noTitle?: boolean,
};


class Dialog {
  el: HTMLElement | null = null;
  dialogWrapVm: DialogWrapVm | null = null;
  elDialogVm: typeof ElDialog | null = null;
  resolve: ((value: unknown | PromiseLike<unknown>) => void) | null = null;
  reject: ((reason?: unknown) => void) | null = null;
  open(componentOption: ComponentOption, dialogOption: DialogOption = {}): Promise<unknown> {
    const {
      is, props, showBtn, cancelText, confirmText, slots,
    } = componentOption;
    const { dialogify } = is;
    const { props: dialogProps, noTitle } = deepmerge(dialogify || {}, dialogOption);
    const DialogWrapApp = createApp(DialogWrap, {
      ...props, dialogVm: this, dialogProps, showBtn, cancelText, confirmText, is, slots, noTitle,
    });
    extendRootApp(DialogWrapApp);
    this.el = document.createElement('div');
    this.dialogWrapVm = DialogWrapApp.mount(this.el) as DialogWrapVm;
    const { dialogWrapVm } = this;
    if (!dialogWrapVm) return Promise.reject(new Error('dialogWrapVm is undefined'));
    dialogWrapVm.dialogVisible = true;
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  onConfirm(...arg: unknown[]): void {
    this.resolve?.(arg[0]); // resolve只支持一个参数
  }
  onCancel(...arg: unknown[]): void {
    this.reject?.(arg[0] || AppError.abort);// reject只支持一个参数
  }
  // onClose({ isClose }: { isClose: boolean }): void {
  //   // close归在reject里面
  //   const closeError = AppError.abort;
  //   closeError.isClose = isClose;
  //   this.reject?.(closeError);
  // }
  onOpen({ elDialogVm }: { elDialogVm: typeof ElDialog }): void {
    this.elDialogVm = elDialogVm;
  }
  onClosed({ elDialogVm, isClose }: { elDialogVm: typeof ElDialog, isClose?: boolean }): void {
    // close归在reject里面
    const closeError = AppError.abort;
    if (isClose) closeError.isClose = isClose;
    this.reject?.(closeError);

    dialogs.pop();
    const elOverLayEl: HTMLElement = elDialogVm?.dialogRef.parentElement;
    if (elOverLayEl && elOverLayEl.parentElement) document.body.removeChild(elOverLayEl);
  }
}
export default Dialog;

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    dialogify?: DialogOption
  }
}
