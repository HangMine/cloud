<template>
  <div class="detail-time-fragment" :class="{ 'is-horizatal': horizatal }">
    <ul class="flex-column">
      <li class="flex-vertical-center">
        <i class="iconfont i-r-yigeren-241" />
        <div class="flex-column">
          <div>创建者:</div>
          <div class="text-one-line">{{ userObj[creator]?.name || "" }}</div>
        </div>
      </li>
      <li class="flex-vertical-center" style="padding-top: 10px">
        <i class="iconfont i-r-shangchuan-24" />
        <div class="flex-column">
          <div>上传时间:</div>
          <time>{{ dayjs(uploaded).format("YYYY/MM/DD HH:mm") }}</time>
        </div>
      </li>
      <li class="flex-vertical-center" style="padding-top: 10px">
        <i class="iconfont i-r-shijian-24" />
        <div class="flex-column">
          <div>更新时间:</div>
          <time>{{ dayjs(updated).format("YYYY/MM/DD HH:mm") }}</time>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import useUsers from '@/utils/uses/use-users';
import {
  defineComponent,
  computed,
} from 'vue';

export default defineComponent({
  name: 'time-info',
  props: {
    creator: {
      type: String,
      default: '',
    },
    uploaded: {
      type: Number,
    },
    updated: {
      type: Number,
    },
    horizatal: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const userIds = computed(() => [props.creator] || []);
    const userObj = useUsers(userIds);
    return {
      dayjs,
      userObj,
    };
  },
});
</script>

<style lang="scss" scoped>
.detail-time-fragment {
  font-size: 12px;
  line-height: 1.5;
  padding: 30px;
  width: 100%;
  background-color: #f7f7f7;
  color: #999;
  .time {
    width: 220px;
    margin-top: 15px;
  }
  .iconfont {
    margin-right: 9px;
    font-size: 14px;
    font-weight: 500;
    color: #aeaeae;
  }
  &.is-horizatal {
    padding: 0;
    background-color: unset;
    .flex-column {
      @extend %flex-vertical-center;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
</style>
