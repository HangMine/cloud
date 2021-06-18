import { getContextUser } from '@/loaders/context';
import { computed, defineComponent } from 'vue';
import './index.scss';

export default defineComponent({
  name: 'User',
  components: {},
  props: {
    isDescriptionVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const user = computed(() => getContextUser());
    const userImage = computed(() => user.value?.headImg || require('@/assets/img/header/default_avatar.png'));
    const userTitle = computed(() => user.value?.name || user.value?.account || '');

    return () => (
      <div class="user-info flex-vertical-center">
        <img src={userImage.value} class="user-img"></img>
        <div class="flex-column">
          <h4 class='title'>{userTitle.value}</h4>
          { props.isDescriptionVisible && <small class="des">剩余12天</small> }
        </div>
      </div>
    );
  },
});
