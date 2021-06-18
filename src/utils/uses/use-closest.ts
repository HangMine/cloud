import {
  reactive, computed, ref, toRefs, getCurrentInstance, onMounted, watch, SetupContext, ComponentInternalInstance,
} from 'vue';

const useClosest = (componentName: string, currentSt?: ComponentInternalInstance | null): ComponentInternalInstance | null => {
  const pubSt = currentSt ?? getCurrentInstance();
  if (!pubSt) return null;
  const interSt = pubSt.proxy;
  if (!interSt) return null;
  const name = interSt.$options.name || interSt.$options.componentName;
  if (componentName === name) {
    return pubSt;
  }
  return useClosest(componentName, pubSt.parent);
};

export default useClosest;
