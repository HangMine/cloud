import remove from '@4dst-saas/public-utils/dist/remove';
import { F } from 'ts-toolbelt';

export abstract class EventEmitter<EventTypeAndHandler extends {
  [type: string]: readonly unknown[]
}> {
  #handlers: { [key: string]: F.Function[] } = {};
  emit<T extends string>(type: T, ...args: EventTypeAndHandler[T]): void {
    const typeHandlers = this.#handlers[type];
    if (typeHandlers) {
      typeHandlers.forEach(handler => {
        handler({ type }, ...args);
      });
    }
  }
  on<T extends string>(type: T, handler: (event: { type: T }, ...args: EventTypeAndHandler[T]) => void): void {
    this.#handlers[type] = this.#handlers[type] ?? [];
    this.#handlers[type].push(handler);
  }
  off<T extends string>(type: T, handler?: F.Function): void {
    if (!handler) {
      delete this.#handlers[type];
    } else {
      const typeHandlers = this.#handlers[type];
      if (typeHandlers) {
        remove(typeHandlers, handler);
      }
    }
  }
  once<T extends string>(type: T, handler: F.Function): Promise<EventTypeAndHandler[T][0]> {
    return new Promise<EventTypeAndHandler[T][0]>((resolve) => {
      const _fn = (...args: unknown[]) => {
        const result = handler.call(this, ...args);
        this.off(type, _fn);
        resolve(args[0]);
        return result;
      };
      this.on(type, _fn);
    });
  }
}
export default EventEmitter;
