
import router from '@/router';
import { Obj } from '../type';

const useQuery = () => {
  const getQuery = () => router.currentRoute.value.query;
  const setQuery = (query: Obj) => {
    router.replace({
      query,
    });
  };
  return {
    setQuery, getQuery,
  };
};

export default useQuery;
