import { defineComponent, createApp } from 'vue';
import Dialog, { ComponentOption, DialogOption } from './Dialog';
import { dialogs, Open } from '.';
import './confirm.scss';

const ConfirmDefault = defineComponent({
  name: 'confirm-default',
  props: {
    title: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  setup(props, { emit }) {
    return () => (
      <div class="sd-confirm">
        {props.title ? <h3 class="sd-confirm-title">{props.title}</h3> : null}
        {props.message ? <p class="sd-confirm-message">{props.message}</p> : null}
      </div>
    );
  },
});


export const confirm = ({
  title, message, confirmText, cancelText,
}:{title?:string, message?:string, confirmText?:string, cancelText?:string }): ReturnType<Open> => {
  const confirmCompOption:ComponentOption = {
    is: ConfirmDefault,
    props: {
      title,
      message,
    },
    showBtn: true,
    confirmText,
    cancelText,
  };
  const confirmDialogOption:DialogOption = {
    noTitle: true,
    props: {
      showClose: false,
      width: '440px',
      customClass: 'sd-confirm-dialog',
    },
  };
  const dialogVm = new Dialog();
  dialogs.push(dialogVm);
  return dialogVm.open(confirmCompOption, confirmDialogOption);
};

export default confirm;
