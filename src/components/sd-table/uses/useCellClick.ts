import {
  onMounted, onUnmounted, SetupContext,
} from 'vue';
import { copy } from '../utils';
import { Obj } from '../type';

const useCellClick = ({ refs }: SetupContext) => {
  const cellClick = (row: Obj, column: Obj, cell: any, e: MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'I') return; // 如果点击图标则不复制
    const cellText = row[column.property].name || row[column.property];
    copy(cellText);
  };

  const handleHeaderFooterClick = (e: MouseEvent) => {
    let target = (e.target as HTMLElement);
    if (target.tagName === 'SPAN') target = target.parentElement!;
    if (target.classList.contains('is-leaf')) {
      const cellText = target.textContent;
      copy(cellText!);
    }
  };

  const headerFooterClick = () => {
    return refs.table?.$el.addEventListener('dblclick', handleHeaderFooterClick);
  };

  onMounted(() => {
    headerFooterClick();
  });

  onUnmounted(() => {
    return refs.table?.$el.removeEventListener('dbclick', handleHeaderFooterClick);
  });

  return {
    cellClick,
  };
};

export default useCellClick;
