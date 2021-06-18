import { App } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import '@/styles/index.scss';
import locale from 'element-plus/lib/locale/lang/zh-cn';
import 'dayjs/locale/zh-cn';

const registerBase = (app: App) => {
  const requireCtx = require.context('./base', true, /\.(vue|[jt]sx?)$/);
  const keys = requireCtx.keys();
  keys.forEach(key => {
    const comp = requireCtx(key).default;
    app.component(comp.name, comp);
  });
};

export default {
  install(app: App) {
    app.use(ElementPlus, { locale });
    registerBase(app);
  },
};
