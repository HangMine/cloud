
import Vue, {
  App, h, RenderContext, VNode,
} from 'vue';
import toggleFrom from '../toggle-from';
import VueReactiveChildren from './vue-reactive-children';

type ErrorInjectorComputedOption = {
  threshold: number,
  catchHook: string | ((info: string) => boolean)
  [otherOption: string]: any
} | false;

type ErrorInjectorOption = Partial<ErrorInjectorComputedOption>;

const defaultErrorInjectorOptions: ErrorInjectorComputedOption = {
  retryHandlers: {},
  threshold: 2,
  catchHook: 'created',
};

export default {
  install(_Vue: App, handlerOptions: ErrorInjectorOption = false) {
    _Vue.use(VueReactiveChildren);
    function errorInjectorStrategy(a?: ErrorInjectorOption, b?: ErrorInjectorOption) {
      if (b === false) return b;
      return {
        ...a,
        ...b,
      } as ErrorInjectorOption;
    }
    handlerOptions = errorInjectorStrategy(defaultErrorInjectorOptions, handlerOptions);
    type OptionRender = (createElement: typeof h, functionalContext: RenderContext) => VNode;
    type JackingRender<T = OptionRender> = T & { renderer: T[] };
    function isJackingRender<T extends OptionRender>(render: T): render is JackingRender<T> {
      return typeof render === 'function' && 'renderer' in render;
    }
    function createJackingRender(renderer: OptionRender | JackingRender) {
      if (isJackingRender(renderer)) {
        return renderer;
      }
      const render: JackingRender = function render(this: any, h, functionalContext) {
        const vdom = render.renderer[0].call(this, h, functionalContext);
        if (functionalContext) {
          return vdom;
        }

        if (vdom && vdom.children && this.$options.errorInjector
          && (!this.$parent || !this.$parent.$errors.length)
          && !!this.$errors.length) {
          vdom.children.unshift(h(this.$options.errorInjector.component, {
            props: {
              error: this.$errors[0],
            },
          }));
        }
        return vdom;
      };
      render.renderer = [renderer];
      return render;
    }
    function renderStrategy<T extends OptionRender>(b: T, a: T) {
      const jr = createJackingRender(a);
      let renders: ((...args: any[]) => any)[] = [];
      if (isJackingRender(b)) {
        renders = b.renderer;
      } else if (typeof b === 'function') {
        renders = [b];
      }
      jr.renderer.unshift(...renders);
      return jr;
    }
    Vue.config.optionMergeStrategies.render = renderStrategy;
    Vue.config.optionMergeStrategies.errorInjector = errorInjectorStrategy;
    Vue.mixin({
      errorInjector: handlerOptions,
      data() {
        return {
          instanceErrors_: [],
        };
      },
      errorCaptured(err: Error, vm: Vue, info: string) {
        const errorInjectorOptions = vm.$options.errorInjector as ErrorInjectorComputedOption;
        if (errorInjectorOptions) {
          const { catchHook } = errorInjectorOptions;
          let captured = false;
          if (typeof catchHook === 'function') {
            captured = catchHook(info);
          } else {
            captured = info.includes(catchHook);
          }
          if (captured) {
            toggleFrom(vm.instanceErrors_, err, true);
            return false;
          }
        }
        return undefined;
      },
      beforeCreate() {
        if (this.$options.render) {
          this.$options.render = createJackingRender(this.$options.render);
        }
      },
      // beforeCreate() {
      //   const errorInjectorOptions = this.$options.errorInjector as ErrorInjectorComputedOption;
      //   if (errorInjectorOptions) {
      //     const { catchHook } = errorInjectorOptions;
      //     if (!this.$options[catchHook]) return;
      //     type Hook = (this: Vue) => void;
      //     let hooks = this.$options[catchHook] as unknown as Hook[];
      //     if (!Array.isArray(this.$options[catchHook])) {
      //       hooks = [this.$options[catchHook] as Hook];
      //     }
      //     this.$options[catchHook] = hooks.map(hook => {
      //       return async function jackingHook(
      //         this: ThisParameterType<Hook>,
      //         ...args: Parameters<Hook>
      //       ) {
      //         try {
      //           return await hook.call(this, ...args);
      //         } catch (e) {
      //           e.vm = this;
      //           this.instanceErrors_.push(e);
      //         }
      //         return undefined;
      //       };
      //     }) as unknown as Hook;
      //   }
      // },
      methods: {
        $clearInstanceErrors() {
          this.instanceErrors_.splice(0, this.instanceErrors_.length);
        },
      },
      computed: {
        $instanceErrors() {
          return this.instanceErrors_;
        },
        $childrenErrors(): Error[] {
          const self = this as unknown as Vue;
          if (!self.$children.length) return [];
          const rs = self.$children.reduce(
            (a, b) => [...a, ...b.$errors], [] as Error[],
          );
          return rs;
        },
        $errors(): Error[] {
          const self = this as unknown as Vue;
          const errorInjectorOptions = self.$options.errorInjector as ErrorInjectorComputedOption;
          if (!errorInjectorOptions) {
            return self.instanceErrors_;
          }
          if (self.$children.filter(child => child.$hasError).length
            >= errorInjectorOptions.threshold) {
            return [...self.instanceErrors_, ...self.$childrenErrors];
          }
          return self.instanceErrors_;
        },
        $hasError(): boolean {
          const self = this as unknown as Vue;
          return !!self.$errors.length;
        },
      },
    });
  },
};


declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    errorInjector?: ErrorInjectorOption;
  }
}
declare module 'vue/types/vue' {
  interface Vue {
    instanceErrors_: Error[],
    $instanceErrors: Error[],
    $errors: Error[],
    $hasError: boolean,
    $childrenErrors: Error[],
  }
}
