const sblStorageKey = Symbol('storageKey');
const sblPost = Symbol('post');
const sblTimeout = Symbol('timeout');
const sblCurrentPost = Symbol('currentPost');
const sblLogsObj = Symbol('logsObj');
const sblTimer = Symbol('timer');
const sblSetLogsObj = Symbol('setLogsObj');

export interface Response {
  code: number,
  data: any,
  message: string
}

export interface LogObj {
  stack: string,
  [any: string]: any,
}

export class LogPoster<Log extends LogObj = LogObj> {
  [sblStorageKey]: string;
  [sblPost]: (logs: Log[]) => Promise<Response>;
  [sblTimeout]: number;
  [sblCurrentPost] = Promise.resolve();
  [sblLogsObj]: { [any: string]: any } = {};
  [sblTimer] = 0;
  [sblSetLogsObj] = () => {
    this[sblLogsObj] = (this.logs).reduce((obj: { [any: string]: any }, log) => {
      obj[log.stack] = true;
      return obj;
    }, {});

    // 两秒内同样stack的错误不收集
    if (!this[sblTimer]) {
      this[sblTimer] = setTimeout(() => {
        this[sblLogsObj] = {};
        this[sblTimer] = 0;
      }, 2000);
    }
  };
  constructor({ storageKey, post }: { storageKey: string, post: (logs: Log[]) => Promise<Response> }) {
    this[sblStorageKey] = storageKey;
    this[sblPost] = post;
    const { logs } = this;
    if (logs.length) {
      this.post(logs);
    }
  }
  post(logs: Log[]) {
    this[sblCurrentPost] = this[sblCurrentPost].then(async () => {
      try {
        const res = await this[sblPost](logs);
        if (res.code === 200) {
          this.logs = [];
        }
      } catch (e) {
        console.warn(e);
      }
    });
  }
  get logs() {
    return JSON.parse(localStorage.getItem(this[sblStorageKey]) ?? '[]') as Log[];
  }
  set logs(logs: Log[]) {
    localStorage.setItem(this[sblStorageKey], JSON.stringify(logs));
  }

  push(...appendLogs: Log[]) {
    const { logs } = this;
    appendLogs.forEach((log) => {
      if (!this[sblLogsObj][log.stack]) logs.unshift(log);
    });
    if (logs.length === this.logs.length) return;

    this.logs = logs.slice(0, 30);
    this[sblSetLogsObj]();
    this.post(logs);
  }
}
export default LogPoster;
