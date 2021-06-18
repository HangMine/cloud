export function isOssUrl(input: string) {
  return input.indexOf('aliyuncs.com') >= 0
    || input.search(/bucket\.[a-z-]*\.4dshoetech\.com/) >= 0
    || input.search(/sdtc-public-picture\.4dshoetech\.com/) >= 0
    || (input.search(/m\d\.model\.4dshoetech\.com/)) >= 0
    || input.search(/(&|\?)ch=1($|&)/) >= 0;
}

export function isNeedSignOssUrl(input: string) {
  return isOssUrl(input) && !input.includes('frontend') && !input.includes('sdtc-public-picture');
}

export default isOssUrl;
