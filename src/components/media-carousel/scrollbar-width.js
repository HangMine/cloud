/* eslint-disable*/
const getScrollbarWidth = () => {
  let outer = document.createElement('div');
  outer.className = 'el-scrollbar__wrap';
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  let widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  let inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  let widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  let scrollBarWidth = widthNoScroll - widthWithScroll;

  return scrollBarWidth;
};

export default getScrollbarWidth;