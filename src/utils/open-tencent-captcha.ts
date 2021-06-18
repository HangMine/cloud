export interface CaptchaRes {
  ret: 0 | 2, // 0：验证成功 2：用户主动关闭验证码
  ticket: string,
  randstr: string
}
declare class TencentCaptcha {
  constructor(appid: string, callback: (CaptchaRes: CaptchaRes) => void, options?: Obj): this
  show(): void
}

const APPID = '2074075744';// 测试账号:2012031361
const openTencentCaptcha = (options?: Obj): Promise<CaptchaRes> => {
  return new Promise((resolve, reject) => {
    try {
      const callback = (res: CaptchaRes) => {
        if (res.ret === 0) { resolve(res); }
      };
      const captcha = new TencentCaptcha(APPID, callback, options);
      captcha.show();
    } catch (error) {
      reject(error);
    }
  });
};

export default openTencentCaptcha;


