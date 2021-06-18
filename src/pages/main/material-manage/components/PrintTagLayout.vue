<template>
  <!-- <div style="width: 100%; position: relative"> -->
  <div class="print-host" :style="[styles.host]">
    <div :style="[styles.wrapper, styles.headWrapper]">
      <div :style="[styles.logoWrapper]">
        <img :src="material.supplierLogo || require('@/assets/img/public/default-image.png')" :style="[styles.logo]" />
      </div>
      <div :style="[styles.headerText, ellipsisStyles.overText]">{{ material.supplierName }}</div>
    </div>
    <div :style="styles.wrapper">
      <div :style="[styles.txtWrapper]">
        <div :style="[styles.title, ellipsis ? ellipsisStyles.overText2 : {}]" class="print-material-name">
          {{ material.name }}
        </div>
        <div :style="[styles.txt, ellipsis ? ellipsisStyles.overText : {}]" class="print-material-name">
          类型：{{ material.materialTypeContent }}
        </div>
        <div :style="[styles.txt, ellipsis ? ellipsisStyles.overText : {}]" class="print-material-name">
          货号：{{ material.sn }}
        </div>
        <div :style="[styles.txt, ellipsis ? ellipsisStyles.overText : {}]" class="print-material-name">
          打印时间：{{ dayjs().format("YYYY.MM.DD") }}
        </div>
        <!-- <div :style="styles.no">{{ material.extraProperty.material_number }}</div> -->
        <!-- <div :style="styles.supplier">{{ supplierName }}</div> -->
      </div>
      <div :style="styles.imgWrapper">
        <img v-if="qrcode" :src="qrcode" :style="[styles.img]" />
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>
<script lang="ts">
import {
  defineComponent, onMounted, ref, computed, watch, Ref,
} from 'vue';
// import { QRCodeCanvas } from '@cheprasov/qrcode';
import { getMiniProgramQrCodeData } from '@/api/material';
import dayjs from 'dayjs';
// import loadImage from '@/utils/load-image';
import delay from '_/delay';

const ellipsisStyles = {
  overText2: {
    // textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  overText: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
};
// 327 164
const styles = {
  host: {
    fontSize: '5pt',
    lineHeight: '1.7',
    padding: '3.67%',
    position: 'relative',
  },
  wrapper: {
    display: 'flex',
  },
  headWrapper: {
    marginBottom: '5.5%',
    alignItems: 'center',
  },
  logoWrapper: {
    width: '6.7%',
    paddingTop: '6.7%',
    // flex: '0 0 6.7%',
    // paddingTop: '6.7%',
    position: 'relative',
    marginRight: '1.2%',
    // backgroundSize: 'cover',
    // backgroundPosition: 'center',
    borderRadius: '50%',
    border: '1px solid #EEEEEE',
    overflow: 'hidden',
    // boxSizing: 'content-box',
  },
  logo: {
    width: '100%',
    height: '100%',
    // minHeight: '100%',
    position: 'absolute',
    objectFit: 'cover',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  headerText: {
    flex: 1,
  },
  img: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  imgWrapper: {
    position: 'relative',
    width: '34%',
    paddingTop: '34%',
  },
  txtWrapper: {
    flex: 1,
    // marginTop: '2.2%',
    // marginLeft: '4.7%',
    // wordBreak: 'break-all',
  },

  title: {
    fontSize: '17pt',
    lineHeight: '1.2',
    marginBottom: '6pt',
    fontWeight: '600',
  },
  txt: {
    marginBottom: '2pt',
  },
};
export default defineComponent({
  props: {
    material: {
      type: Object as unknown as () => Obj,
      required: true,
    },
    size: {
      type: Object as unknown as () => { width: number, height: number },
      required: true,
    },
    fontSize: {
      type: Number,
      default: 12,
    },
    ellipsis: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const qrcode = ref<string>();
    console.log(props);
    const pMounted = new Promise<void>((resolve) => {
      onMounted(resolve);
    });
    // const size = computed(() => {
    //   return {
    //     // width: props.size.width + 2.6 + 0.4,
    //     width: props.size.width,
    //     height: props.size.height,
    //   };
    // });
    // const ratio = computed(() => {
    //   const vSize = size.value;
    //   console.log(size.value, vSize.height / vSize.width);
    //   return vSize.height / vSize.width;
    // });
    // const name = computed(() => {
    //   const { name: materialName } = props.material;
    //   if (materialName.length > 26) {
    //     return `${materialName.substring(0, 26)}...`;
    //   }
    //   return materialName;
    // });

    const getQrcodeImage = async () => {
      qrcode.value = await getMiniProgramQrCodeData('pages/detail/index', props.material.catalogId, 280);
      // qrcode.value = '';
    };
    return {
      styles,
      qrcode,
      // ratio,
      // name,
      // supplierName,
      ellipsisStyles,
      dayjs,
      async ready() {
        await pMounted;
        await getQrcodeImage();
        // await delay(500);
      },
    };
  },
});
</script>
<style lang="scss">
</style>
