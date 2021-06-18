/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-param-reassign */
import { camelCase } from '@4dst-saas/public-utils/dist/case';
import {
  Attr,
  Model,
  Model as OrmModel,
} from '@vuex-orm/core';
import { C, O, F } from 'ts-toolbelt';

type Obj = Record<PropertyKey, unknown>;

type ExcludeKey<K extends PropertyKey> = Exclude<K, keyof OrmModel>;
export type Raw<M> = M extends OrmModel ?
  {
    [k in ExcludeKey<O.OptionalKeys<M>>]?: Raw<M[k]>
  } & {
    [x in ExcludeKey<O.RequiredKeys<M>>]: Raw<M[x]>
  } : M extends unknown[] ? Raw<M[0]>[] : M;

type OmitTypeFields<T, K> = { [P in keyof T]: T[P] extends K ? never : P }[keyof T];

type ModelCtorOf<C extends C.Class, T = InstanceType<C>> = C.Class<C.Parameters<C>, {
  [i in keyof typeof Model]: typeof Model[i]
} & {
    [i in keyof T]: T[i] extends null ?
    null : T[i] extends Obj ? ModelOf<T[i]> : T[i]
  }> & typeof Model & C;

export type ModelOf<T extends Obj> = InstanceType<ModelCtorOf<C.Class<unknown[], T>>>;
type StaticsFields<T extends C.Class> = (this: ModelCtorOf<T>) =>
  { [key in Exclude<OmitTypeFields<T, F.Function>, 'constructor' | 'prototype'>]?: Attr };
type Statics<T extends C.Class> = Partial<Pick<typeof Model, 'primaryKey' | 'baseEntity'>> & {
  entity: string;
  fields: StaticsFields<T>;
};

function getRootClass(Klass: C.Class) {
  // eslint-disable-next-line no-constant-condition
  while (1) {
    // eslint-disable-next-line no-proto
    const superPrototype = Klass.prototype.__proto__;
    if (superPrototype && superPrototype !== Object.prototype) {
      Klass = superPrototype.constructor;
    } else {
      return Klass;
    }
  }
  return Klass;
}

export const modelOf = <T extends C.Class>(Klass: T,
  statics: Partial<Statics<T>> = {}): ModelCtorOf<T> => {
  const entity = statics.entity ?? camelCase(Klass.name, false);
  const rootClass = getRootClass(Klass);
  const baseEntity = statics.baseEntity
    ?? (rootClass !== Klass ? camelCase(rootClass.name, false) : undefined);
  const computedStatics = {
    ...statics,
    primaryKey: statics.primaryKey ?? 'id',
    fields: statics.fields,
    entity: statics.entity ?? camelCase(Klass.name),
  };
  if (baseEntity !== entity) {
    computedStatics.baseEntity = baseEntity;
  }
  const prototype = { ...Klass.prototype };
  // eslint-disable-next-line no-proto
  let superPrototype = Klass.prototype.__proto__;
  if (superPrototype && superPrototype !== Object.prototype) {
    superPrototype = modelOf(superPrototype.constructor).prototype;
  } else {
    superPrototype = Model.prototype;
  }

  function MixClass(this: unknown, ...args: unknown[]) {
    // @ts-ignore
    Model.call(this, ...args);
    // @ts-ignore
    Object.assign(this, new (Klass.bind.call(Klass))(...args));
  }
  Object.setPrototypeOf(prototype, superPrototype);
  Object.setPrototypeOf(MixClass, superPrototype.constructor);
  MixClass.prototype = prototype;
  Object.assign(MixClass, computedStatics);
  prototype.constructor = MixClass;
  return MixClass as unknown as ModelCtorOf<T>;
};

export default modelOf;
