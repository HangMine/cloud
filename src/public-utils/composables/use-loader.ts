import {
  ref, watch, reactive, Ref, isRef, getCurrentInstance, UnwrapRef,
} from '@vue/composition-api';
import { Unpromise } from '../../typings/unpromise.d';

export type Loader<T> = (params: UnwrapRef<T>) => unknown;
type UnwrapIfRef<A extends any> = A extends Ref<any> ? UnwrapRef<A> : A;
type LoaderResult<L extends Loader<any>> = UnwrapIfRef<Unpromise<ReturnType<L>>>;
type LoadingValue<L extends Loader<any>, I, S> = (result: LoaderResult<L> | I) => S;
type UseLoaderOptions<L extends Loader<any>, I, S> = {
  initialValue?: I,
  loadingValue?: LoadingValue<L, I, S>
};

export type DefaultUseLoaderOptions<L extends Loader<any>> = {
  initialValue: undefined
  loadingValue: LoadingValue<L, undefined, LoaderResult<L>>
};
export type ComputedUseLoaderOptions<L extends Loader<any>,
  O extends UseLoaderOptions<L, any, any> = UseLoaderOptions<L, any, any>> =
  DefaultUseLoaderOptions<L> & O;

type Result<
  L extends Loader<any>, O extends ComputedUseLoaderOptions<L>> =
  LoaderResult<L> | O['initialValue'] |
  ReturnType<O['loadingValue']>;

type RefResult<L extends Loader<any>, O extends Required<UseLoaderOptions<L, any, any>>>
  = Ref<Result<L, O>>;

const defaultOptions = {
  initialValue: undefined,
  loadingValue: (oldValue: any) => oldValue,
};

function useLoader<L extends Loader<{}>>
(loader: L): RefResult<L, DefaultUseLoaderOptions<L>>;
function useLoader<T, L extends Loader<T>>
(loader: L, params: T): RefResult<L, DefaultUseLoaderOptions<L>>;
function useLoader<
  T,
  L extends Loader<T>,
  O extends UseLoaderOptions<L, any, any>
>
(loader: L, params: T, options: O): RefResult<L, ComputedUseLoaderOptions<L, O>>;
function useLoader(
  loader: Loader<any>,
  params = {},
  {
    initialValue = defaultOptions.initialValue,
    loadingValue = defaultOptions.loadingValue,
  } = defaultOptions,
) {
  const r = reactive(params);
  const watchSource = () => {
    return {
      ...r,
    };
  };

  const resultRef = ref<any>(initialValue);
  const tmp = ref<any>(null);
  const that = getCurrentInstance() as unknown as Vue;
  const loaderPromiseRef = ref<Promise<any> | undefined>();
  if (!that) return;
  that.$on('hook:created', async () => {
    loaderPromiseRef.value = loader(watchSource()) as any;
    watch(loaderPromiseRef, async (_loaderPromiseRef) => {
      resultRef.value = loadingValue(resultRef.value);
      tmp.value = await _loaderPromiseRef;
    }, {
      immediate: true,
    });
    await loaderPromiseRef.value;
  });
  let oldWatcher: ReturnType<typeof watch>;

  watch(watchSource, (s) => {
    if (oldWatcher) {
      oldWatcher();
    }
    loaderPromiseRef.value = loader(s) as any;
  });

  watch(tmp, async (_tmp) => {
    if (isRef(_tmp)) {
      oldWatcher = watch(_tmp, (__tmp) => {
        resultRef.value = __tmp;
      }, {
        immediate: true,
      });
    } else {
      resultRef.value = _tmp;
    }
  });

  // eslint-disable-next-line consistent-return
  return resultRef;
}

export default useLoader;
