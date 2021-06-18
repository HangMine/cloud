import { ref, onBeforeUnmount } from 'vue';

export default function useCollapseChange() {
  const isCollapsed = ref(true);
  const handleCollapseStatusChange = (e) => {
    e.stopPropagation();
    isCollapsed.value = !isCollapsed.value;
  };
  const collapsePanel = () => {
    if (!isCollapsed.value) {
      isCollapsed.value = true;
    }
  };
  document.addEventListener('click', collapsePanel);
  onBeforeUnmount(() => {
    document.removeEventListener('click', collapsePanel);
  });
  return {
    isCollapsed,
    handleCollapseStatusChange,
  };
}
