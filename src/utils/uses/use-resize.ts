import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
import resizeWatch from '@/utils/resize-watch';

type UnWatch = () => void;
function useResize(callback: Function, useEl?: true): UnWatch;
function useResize(callback: Function, target?: HTMLElement): UnWatch;
function useResize(callback: Function, useElOrTarget: true | HTMLElement = document.documentElement) {
  const vm = getCurrentInstance();
  let unWatch: UnWatch;
  onMounted(() => {
    const _target = useElOrTarget === true ? (vm?.proxy?.$el as HTMLElement) : useElOrTarget;
    unWatch = resizeWatch(callback, _target);
  });
  const _unWatch = () => {
    if (unWatch) {
      unWatch();
    }
  };
  onUnmounted(_unWatch);
  return _unWatch;
}
export { useResize };
export default useResize;
