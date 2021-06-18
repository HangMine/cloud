/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { delay } from '_/delay';
import {
  reactive, toRefs,
} from 'vue';
import { DefaultResponse } from '../axios';

type FetchFn = (...args: any[]) => Promise<any>;
type StopFn = (res: any) => boolean;

interface Option { fetchFn: FetchFn, stopFn: StopFn, limit?: number, rate?: number }

const useLoopFetch = ({
  fetchFn, stopFn, limit = 10, rate = 1000,
}: Option) => {
  const state = reactive({
    isLooping: false,
    loopIndex: 1,
    forceStop: false,
  });

  const loopReset = () => {
    state.isLooping = false;
    state.loopIndex = 1;
  };

  let loopRes = {
    isLimit: false,
    isForceStop: false,
    res: {} as DefaultResponse,
  };
  const loopFetch = async (): Promise<typeof loopRes> => {
    state.isLooping = true;

    try {
      const isLimit = state.loopIndex > limit;
      if (isLimit) {
        loopRes.isLimit = true;
        loopReset();
        return loopRes;
      }
      if (state.forceStop) {
        loopRes.isForceStop = true;
        loopReset();
        return loopRes;
      }
      const fetchRes = await fetchFn();
      loopRes.res = fetchRes;
      state.loopIndex++;
      const stopRes = stopFn(fetchRes);
      if (stopRes) {
        loopReset();
      } else {
        await delay(rate);
        loopRes = await loopFetch();
      }
      return loopRes;
    } catch (e) {
      loopReset();
      throw e;
    }
  };

  const stopFetch = () => {
    state.forceStop = true;
  };


  return {
    ...toRefs(state), loopFetch, stopFetch,
  };
};

export default useLoopFetch;

