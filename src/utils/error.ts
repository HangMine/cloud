
// import { instance as history } from './history';

import ErrorLike from '@/typings/error-like.d';


export default class AppError extends Error implements ErrorLike {
  message = '';

  name: string;

  position?: string;

  code?: number;

  level?: number;

  data?: unknown;

  redirect?: any;

  type?: string;

  muted?: boolean;

  instance?: unknown;

  isFECodeError?: boolean;

  [otherProps: string]: any

  constructor();
  constructor(mixin: Object);
  constructor(message: string, mixin: Object);
  constructor(mixinOrMessage?: Object | string, mixin?: Object) {
    super();
    if (typeof mixinOrMessage === 'string') {
      mixin = {
        message: mixinOrMessage,
        ...mixin,
      };
    } else {
      mixin = {
        ...mixinOrMessage,
        ...mixin,
      };
    }
    if (!mixin) {
      mixin = {
        message: 'Error! Something bad happened...',
      };
    }
    Object.assign(this, mixin);
    this.name = this.constructor.name;
  }

  static CODE_USER_ABORT = 499 as const;

  static CODE_AUTH_ERROR = 100403 as const;

  static CODE_NEED_LOGIN = 100401 as const;

  static CODE_EMPTY = 100404 as const;

  static CODE_UNKNOWN_ERROR = 100500 as const;


  static Muted(message = 'Unknow Error') {
    return new AppError(message, {
      muted: true,
    });
  }

  static Abort(message = 'User Abort') {
    return new AppError(message, {
      code: AppError.CODE_USER_ABORT,
      level: -2,
      muted: true,
    });
  }

  static Auth(message = `CODE:${AppError.CODE_AUTH_ERROR}`) {
    return new AppError(message, {
      code: AppError.CODE_AUTH_ERROR,
      level: -1,
    });
  }


  static NeedLogin(message = `CODE:${AppError.CODE_NEED_LOGIN}`) {
    return new AppError(message, {
      code: AppError.CODE_NEED_LOGIN,
      level: -1,
    });
  }

  static AuthMuted(message = `CODE:${AppError.CODE_AUTH_ERROR}`) {
    return new AppError(message, {
      code: AppError.CODE_AUTH_ERROR,
      level: -1,
      muted: true,
    });
  }

  static Empty(message = `CODE:${AppError.CODE_AUTH_ERROR}`) {
    return new AppError(message, {
      code: AppError.CODE_EMPTY,
      level: -2,
      muted: true,
    });
  }

  static Unknown(message = `CODE:${AppError.CODE_UNKNOWN_ERROR}`) {
    return new AppError(message, {
      code: AppError.CODE_UNKNOWN_ERROR,
    });
  }

  static get abort() {
    return this.Abort();
  }

  static get auth() {
    return this.Auth();
  }

  static get muted() {
    return this.Muted();
  }

  static get authMuted() {
    return this.AuthMuted();
  }

  static get needLogin() {
    return this.NeedLogin();
  }

  static get empty() {
    return this.Empty();
  }

  static get unknown() {
    return this.Unknown();
  }

  static LEVELS = {
    INFO: -2,
    WARN: -1,
    ERROR: 0,
    DANGER: 1,
  };
}
