export function injectStyle(doc: HTMLDocument, css: string) {
  const head = doc.getElementsByTagName('head')[0];
  const style = doc.createElement('style');
  if ('textContent' in style) {
    style.textContent = css;
  } else {
    // @ts-ignore
    style.styleSheet.cssText = css;
  }
  head.appendChild(style);
  return () => {
    head.removeChild(style);
  };
}
export default injectStyle;
