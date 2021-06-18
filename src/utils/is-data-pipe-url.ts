const rDataPipe = /datapipe/;
export function isDataPipeUrl(url: string): boolean {
  return rDataPipe.test(url);
}

export default isDataPipeUrl;
