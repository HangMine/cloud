export type Obj = { [key in string | number]: any };
export const $continue = Symbol('continue');
export const getType = (target: any) => Object.prototype.toString.call(target).slice(8, -1);
export const deepCopy = (() => {
  const getShadowValue = (target: any) => {
    const type = getType(target);
    switch (type) {
      case 'Object':
        return {};
      case 'Array':
        return [];
      default:
        return target;
    }
  };
  const _deepCopy = (target: any, {
    cache = [], layer = 0, maxLayer = Infinity, filter,
  }: {
    cache?: { original: Obj, copy: Obj }[],
    layer?: number,
    maxLayer?: number,
    filter?: ({
      // eslint-disable-next-line @typescript-eslint/no-shadow
      key, value, layer, copy,
    }: { key: string | number, value: any, layer: number, copy: () => any, getShadowValue: typeof getShadowValue }) => any
  } = {}) => {
    if (target === null || typeof target !== 'object') {
      return target;
    }
    const hit = cache.filter(c => c.original === target)[0];
    if (hit) {
      return hit.copy;
    }
    const copy: Obj = Array.isArray(target) ? [] : {};
    cache.push({
      original: target,
      copy,
    });
    layer++;
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(target)) {
      const value = target[key];
      if (filter) {
        const filterValue = filter({
          key,
          value,
          layer,
          copy: () => _deepCopy(value, {
            cache, layer, maxLayer, filter,
          }),
          getShadowValue,
        });
        // eslint-disable-next-line no-continue
        if (filterValue === $continue) continue;
        copy[key] = filterValue;
      } else {
        copy[key] = layer < maxLayer ? _deepCopy(value, {
          cache, layer, maxLayer,
        }) : getShadowValue(value);
      }
    }
    return copy;
  };
  return _deepCopy;
})();

export default deepCopy;

