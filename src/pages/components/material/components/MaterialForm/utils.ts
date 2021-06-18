/* eslint-disable import/prefer-default-export */
import { FormItem, FormItems } from '@/components/form/HForm/type';
import { Category as ApiCategory, ModelApiItem } from '@/api/material';
import { computed, ref, Ref } from 'vue';
import { MaterialDetail } from '@/models/Material';
import tryParseJson from '@4dst-saas/public-utils/dist/try-parse-json';

type ApiOptions = {
  id: string | number,
  name: string,
  children?: ApiOptions
}[];
type FormOption = {
  key: string | number,
  title: string,
  children?: FormOption[]
};
export type Category = {
  big: GetArrayItem<ApiCategory>,
  middle: GetArrayItem<ApiCategory>,
};

export const getOptions = (_options: ApiOptions) => {
  return _options.map(option => {
    const newOption: FormOption = { key: option.id, title: option.name };
    if (option.children) {
      newOption.children = getOptions(option.children);
    }
    return newOption;
  });
};

export const getYearOptions = () => {
  const currentYear = 2021;
  // const range = [-20, 50];
  // const sortNums = [...Array(range[1] - range[0])].map((_, i) => range[0] + i).sort((a, b) => Math.abs(a) - Math.abs(b));
  const afterYears = [...Array(51)].map((_, i) => currentYear + i);
  const beforeYears = [...Array(20)].map((_, i) => currentYear - i - 1);
  const years = [...afterYears, ...beforeYears].map(item => {
    const value = `${item}`;
    return {
      id: value,
      name: value,
    };
  });
  return years;
};


export const options = {
  yaer: getYearOptions(),
  isEnvironmentProtection: [{
    id: 1,
    name: '是',
  }, {
    id: 0,
    name: '否',
  }],
  environmentProtectionType: [{
    id: '<50% 回收材料',
    name: '<50% 回收材料',
  }, {
    id: '50%-100% 回收材料',
    name: '50%-100% 回收材料',
  }, {
    id: '<50% 溶液染色',
    name: '<50% 溶液染色',
  }, {
    id: '<50%-100% 溶液染色',
    name: '<50%-100% 溶液染色',
  }, {
    id: '<50% 溶剂',
    name: '<50% 溶剂',
  }, {
    id: '50-100% 溶剂',
    name: '50-100% 溶剂',
  }, {
    id: '零废物组件',
    name: '零废物组件',
  }, {
    id: '可生物降解的',
    name: '可生物降解的',
  }, {
    id: '<50% 生物基含量',
    name: '<50% 生物基含量',
  }, {
    id: '50-100% 生物基含量',
    name: '50-100% 生物基含量',
  }, {
    id: '无挥发性有机化合物',
    name: '无挥发性有机化合物',
  }, {
    id: '无DMF(富马酸二甲酯)',
    name: '无DMF(富马酸二甲酯)',
  }, {
    id: '无铬',
    name: '无铬',
  }],
  isWaterproof: [{
    id: 1,
    name: '是',
  }, {
    id: 0,
    name: '否',
  }],
  engineeringDesignMode: [{
    id: '贾卡/提花',
    name: '贾卡/提花',
  }, {
    id: '罗纹布',
    name: '罗纹布',
  }, {
    id: '摇粒绒',
    name: '摇粒绒',
  }, {
    id: '毛巾布/毛圈布',
    name: '毛巾布/毛圈布',
  }, {
    id: '特利可得',
    name: '特利可得',
  }, {
    id: '格子布',
    name: '格子布',
  }, {
    id: '人字斜纹',
    name: '人字斜纹',
  }, {
    id: '蜂巢布',
    name: '蜂巢布',
  }, {
    id: '犬牙织纹',
    name: '犬牙织纹',
  }, {
    id: '泡泡纱',
    name: '泡泡纱',
  }, {
    id: '平纹',
    name: '平纹',
  }, {
    id: '粗花呢',
    name: '粗花呢',
  }, {
    id: '斜纹布',
    name: '斜纹布',
  }, {
    id: '牛仔布',
    name: '牛仔布',
  }, {
    id: '乔其纱',
    name: '乔其纱',
  }, {
    id: '麂皮绒',
    name: '麂皮绒',
  }, {
    id: '方平组织',
    name: '方平组织',
  }, {
    id: '缎子',
    name: '缎子',
  }, {
    id: '棉缎',
    name: '棉缎',
  }, {
    id: '塔夫绸',
    name: '塔夫绸',
  }, {
    id: '其它',
    name: '其它',
  }],
  structureMode: [{
    id: '单层',
    name: '单层',
  }, {
    id: '双层',
    name: '双层',
  }, {
    id: '三明治',
    name: '三明治',
  }],
  subType: [{
    id: '单层网布',
    name: '单层网布',
  }, {
    id: '三明治网布',
    name: '三明治网布',
  }, {
    id: '两面弹网布',
    name: '两面弹网布',
  }, {
    id: '四面弹网布',
    name: '四面弹网布',
  }, {
    id: '内里',
    name: '内里',
  }, {
    id: '贾卡网布',
    name: '贾卡网布',
  }, {
    id: '提花网布',
    name: '提花网布',
  }],
  mechanicalTreatment: [{
    id: '全苯胺皮',
    name: '全苯胺皮',
  }, {
    id: '修面皮',
    name: '修面皮',
  }, {
    id: '皮草/毛皮',
    name: '皮草/毛皮',
  }, {
    id: '带毛皮',
    name: '带毛皮',
  }, {
    id: '牛巴戈/磨砂皮',
    name: '牛巴戈/磨砂皮',
  }, {
    id: '涂饰皮',
    name: '涂饰皮',
  }, {
    id: '漆皮',
    name: '漆皮',
  }, {
    id: '半苯胺皮',
    name: '半苯胺皮',
  }, {
    id: '植鞣革',
    name: '植鞣革',
  }, {
    id: '牛巴戈漆皮',
    name: '牛巴戈漆皮',
  }, {
    id: '榔皮/磨砂皮',
    name: '榔皮/磨砂皮',
  }, {
    id: '油蜡皮/变色皮',
    name: '油蜡皮/变色皮',
  }],
  textureType: [{
    id: '平滑',
    name: '平滑',
  }, {
    id: '平纹',
    name: '平纹',
  }, {
    id: '颗粒纹',
    name: '颗粒纹',
  }, {
    id: '印花',
    name: '印花',
  }, {
    id: '压花',
    name: '压花',
  }],
  chemicalTreatment: [{
    id: '抗菌',
    name: '抗菌',
  }, {
    id: '防静电',
    name: '防静电',
  }, {
    id: '持久性防泼水',
    name: '持久性防泼水',
  }, {
    id: '持久性防泼水-C6',
    name: '持久性防泼水-C6',
  }, {
    id: '持久性防泼水-F0',
    name: '持久性防泼水-F0',
  }, {
    id: '驱虫剂',
    name: '驱虫剂',
  }, {
    id: '不适用',
    name: '不适用',
  }, {
    id: '反光',
    name: '反光',
  }, {
    id: '易去污整理',
    name: '易去污整理',
  }, {
    id: '防污剂',
    name: '防污剂',
  }, {
    id: '紫外线阻滞剂 - UPF 30',
    name: '紫外线阻滞剂 - UPF 30',
  }, {
    id: '紫外线阻滞剂 - UPF 40',
    name: '紫外线阻滞剂 - UPF 40',
  }, {
    id: '紫外线阻滞剂 - UPF 50',
    name: '紫外线阻滞剂 - UPF 50',
  }, {
    id: '防泼水',
    name: '防泼水',
  }, {
    id: '防泼水-C6',
    name: '防泼水-C6',
  }, {
    id: '防泼水-F0',
    name: '防泼水-F0',
  }],
  tc: [{
    id: 'PU涂层',
    name: 'PU涂层',
  }, {
    id: 'TPU涂层',
    name: 'TPU涂层',
  }, {
    id: 'PVC涂层',
    name: 'PVC涂层',
  }, {
    id: 'PU涂层',
    name: 'PU涂层',
  }, {
    id: '绒面/仿麂皮/翻毛皮 涂层',
    name: '绒面/仿麂皮/翻毛皮 涂层',
  }, {
    id: 'TPE涂层',
    name: 'TPE涂层',
  }, {
    id: 'TPO涂层',
    name: 'TPO涂层',
  }, {
    id: 'TPR涂层',
    name: 'TPR涂层',
  }, {
    id: '硫化橡胶涂层',
    name: '硫化橡胶涂层',
  }, {
    id: '其它涂层',
    name: '其它涂层',
  }],
  isDorsum: [{
    id: 1,
    name: '是',
  }, {
    id: 0,
    name: '否',
  }],
  dorsumType: [{
    id: '不织布',
    name: '不织布',
  }, {
    id: '弹性不织布',
    name: '弹性不织布',
  }, {
    id: '高密不织布',
    name: '高密不织布',
  }, {
    id: '低密不织布',
    name: '低密不织布',
  }, {
    id: '针织',
    name: '针织',
  }, {
    id: '弹性针织',
    name: '弹性针织',
  }, {
    id: '超纤',
    name: '超纤',
  }, {
    id: '超纤不织布',
    name: '超纤不织布',
  }, {
    id: '机织/梭织',
    name: '机织/梭织',
  }, {
    id: '弹性编织/梭织',
    name: '弹性编织/梭织',
  }, {
    id: '无背底',
    name: '无背底',
  }, {
    id: '热融胶膜',
    name: '热融胶膜',
  }, {
    id: '其它',
    name: '其它',
  }],
  moldingMethod: [{
    id: '干式',
    name: '干式',
  }, {
    id: '湿式',
    name: '湿式',
  }, {
    id: '干式+湿式',
    name: '干式+湿式',
  }, {
    id: '不䢪用',
    name: '不䢪用',
  }],
  surfaceEffect: [{
    id: '珠光',
    name: '珠光',
  }, {
    id: '雾面',
    name: '雾面',
  }, {
    id: '亮面',
    name: '亮面',
  }, {
    id: '透明',
    name: '透明',
  }, {
    id: '金属效果',
    name: '金属效果',
  }, {
    id: '3M',
    name: '3M',
  }, {
    id: '反光',
    name: '反光',
  }, {
    id: '夜光',
    name: '夜光',
  }, {
    id: '其它',
    name: '其它',
  }],
  transparency: [{
    id: '0%',
    name: '0%',
  }, {
    id: '10%',
    name: '10%',
  }, {
    id: '20%',
    name: '20%',
  }, {
    id: '30%',
    name: '30%',
  }, {
    id: '40%',
    name: '40%',
  }, {
    id: '50%',
    name: '50%',
  }, {
    id: '60%',
    name: '60%',
  }, {
    id: '70%',
    name: '70%',
  }, {
    id: '80%',
    name: '80%',
  }, {
    id: '90%',
    name: '90%',
  }, {
    id: '100%',
    name: '100%',
  }],
  isInStock: [{
    id: 1,
    name: '是',
  }, {
    id: 0,
    name: '否',
  }],
  isAgain: [
    {
      id: 1,
      name: '允许分享',
    }, {
      id: 0,
      name: '不可分享',
    },
  ],
  unit: [{
    id: '码',
    name: '码',
  }, {
    id: '米',
    name: '米',
  }, {
    id: '英寸',
    name: '英寸',
  }, {
    id: '平方英尺',
    name: '平方英尺',
  }],
  averageSizeUnit: [{
    id: '平方英尺',
    name: '平方英尺',
  }],
  currency: [{
    id: '美元',
    name: '美元',
  }, {
    id: '人民币',
    name: '人民币',
  }, {
    id: '台币',
    name: '台币',
  }, {
    id: '港元',
    name: '港元',
  }, {
    id: '日元',
    name: '日元',
  }, {
    id: '韩元',
    name: '韩元',
  }, {
    id: '其它',
    name: '其它',
  }],
  priceUnit: [{
    id: '美元',
    name: '美元',
  }, {
    id: '人民币',
    name: '人民币',
  }],
  timeUnit: [{
    id: '天',
    name: '天',
  }, {
    id: '周',
    name: '周',
  }],
  season: [{
    id: '春',
    name: '春',
  }, {
    id: '夏',
    name: '夏',
  }, {
    id: '秋',
    name: '秋',
  }, {
    id: '冬',
    name: '冬',
  }],
  materialTechnology: [{
    id: '粒面皮',
    name: '粒面皮',
  }, {
    id: '修面皮',
    name: '修面皮',
  }, {
    id: '漆皮',
    name: '漆皮',
  }, {
    id: '压花皮',
    name: '压花皮',
  }, {
    id: '印花皮',
    name: '印花皮',
  }, {
    id: '磨砂皮',
    name: '磨砂皮',
  }, {
    id: '绒面皮',
    name: '绒面皮',
  }, {
    id: '摔纹皮',
    name: '摔纹皮',
  }, {
    id: '马毛皮',
    name: '马毛皮',
  }, {
    id: '其他材质',
    name: '其他材质',
  }],
  surfaceTechnology: {
    leather: [{
      id: '全水染皮 (全苯胺)',
      name: '全水染皮 (全苯胺)',
    }, {
      id: '半水染皮 (半苯胺)',
      name: '半水染皮 (半苯胺)',
    }, {
      id: '涂料皮',
      name: '涂料皮',
    }, {
      id: '重涂料皮',
      name: '重涂料皮',
    }, {
      id: '打蜡皮',
      name: '打蜡皮',
    }, {
      id: '丝绸皮',
      name: '丝绸皮',
    }, {
      id: '抛光皮',
      name: '抛光皮',
    }, {
      id: '纳帕皮',
      name: '纳帕皮',
    }, {
      id: '其他表面工艺',
      name: '其他表面工艺',
    }],
    artificialLeather: [{
      id: '哑光',
      name: '哑光',
    }, {
      id: '抛光',
      name: '抛光',
    }, {
      id: '擦胶',
      name: '擦胶',
    }, {
      id: '摸色',
      name: '摸色',
    }, {
      id: '双色',
      name: '双色',
    }, {
      id: '烫光',
      name: '烫光',
    }, {
      id: '高固',
      name: '高固',
    }, {
      id: '转印',
      name: '转印',
    }, {
      id: '烫金',
      name: '烫金',
    }, {
      id: '喷染',
      name: '喷染',
    }, {
      id: '揉纹',
      name: '揉纹',
    }, {
      id: '植绒',
      name: '植绒',
    }, {
      id: '羊巴',
      name: '羊巴',
    }],
  },
  grammageUnit: [{
    id: '平米克重',
    name: '平米克重',
  }, {
    id: '米克重',
    name: '米克重',
  }, {
    id: '码克重',
    name: '码克重',
  }, {
    id: '盎司',
    name: '盎司',
  }, {
    id: '姆米',
    name: '姆米',
  }],
  thicknessUnit: [{
    id: 'mm',
    name: 'mm',
  }],
  tanningMethod: [{
    id: '植鞣',
    name: '植鞣',
  }, {
    id: '铬鞣',
    name: '铬鞣',
  }, {
    id: '铝鞣',
    name: '铝鞣',
  }, {
    id: '油鞣',
    name: '油鞣',
  }, {
    id: '醛鞣',
    name: '醛鞣',
  }, {
    id: '结合鞣',
    name: '结合鞣',
  }, {
    id: '其它',
    name: '其它',
  }],
  oilContentUnit: [{
    id: '%',
    name: '%',
  }],
  qualityGrade: [{
    id: 'A/TR1',
    name: 'A/TR1',
  }, {
    id: 'B/TR2',
    name: 'B/TR2',
  }, {
    id: 'C/TR3',
    name: 'C/TR3',
  }, {
    id: 'D/TR4',
    name: 'D/TR4',
  }, {
    id: 'LG/Economy',
    name: 'LG/Economy',
  }, {
    id: 'AB 5050',
    name: 'AB 5050',
  }, {
    id: 'ABC 40/40/20',
    name: 'ABC 40/40/20',
  }, {
    id: 'ABC 30/40/30',
    name: 'ABC 30/40/30',
  }, {
    id: 'ABC 20/30/30/20',
    name: 'ABC 20/30/30/20',
  }, {
    id: 'BC 50/50',
    name: 'BC 50/50',
  }, {
    id: 'TR',
    name: 'TR',
  }],
  applicableProduct: [{
    id: '鞋履',
    name: '鞋履',
  }, {
    id: '服装',
    name: '服装',
  }, {
    id: '箱包',
    name: '箱包',
  }, {
    id: '其它',
    name: '其它',
  }],
  textureType_back: [{
    id: '镜面',
    name: '镜面',
  }, {
    id: '胎牛纹',
    name: '胎牛纹',
  }, {
    id: '摔牛纹',
    name: '摔牛纹',
  }, {
    id: '水纹',
    name: '水纹',
  }, {
    id: '细羊纹',
    name: '细羊纹',
  }, {
    id: '羊仔',
    name: '羊仔',
  }, {
    id: '仿布纹',
    name: '仿布纹',
  }, {
    id: '石头纹',
    name: '石头纹',
  }, {
    id: '十字纹',
    name: '十字纹',
  }, {
    id: '荔枝纹',
    name: '荔枝纹',
  }, {
    id: '蛇皮',
    name: '蛇皮',
  }, {
    id: '蜥蜴纹',
    name: '蜥蜴纹',
  }, {
    id: '鳄鱼皮',
    name: '鳄鱼皮',
  }, {
    id: '马皮',
    name: '马皮',
  }, {
    id: '鱼皮',
    name: '鱼皮',
  }],
  shape: [{
    id: '扁带',
    name: '扁带',
  }, {
    id: '圆带/椭圆带',
    name: '圆带/椭圆带',
  }, {
    id: '三角带',
    name: '三角带',
  }, {
    id: '四方带',
    name: '四方带',
  }, {
    id: '葫芦带',
    name: '葫芦带',
  }, {
    id: '珍珠带',
    name: '珍珠带',
  }, {
    id: '花边带',
    name: '花边带',
  }, {
    id: '凹凸带',
    name: '凹凸带',
  }, {
    id: '其它',
    name: '其它',
  }],
  functionPurpose: [{
    id: '运动鞋带',
    name: '运动鞋带',
  }, {
    id: '户外鞋带',
    name: '户外鞋带',
  }, {
    id: '板鞋鞋带',
    name: '板鞋鞋带',
  }, {
    id: '皮鞋鞋带',
    name: '皮鞋鞋带',
  }, {
    id: '纽扣鞋带',
    name: '纽扣鞋带',
  }, {
    id: '蝴蝶带',
    name: '蝴蝶带',
  }, {
    id: '其它',
    name: '其它',
  }],
  typeOfRawMaterial: [{
    id: '涤纶鞋带',
    name: '涤纶鞋带',
  }, {
    id: '涤棉鞋带',
    name: '涤棉鞋带',
  }, {
    id: '插金鞋带',
    name: '插金鞋带',
  }, {
    id: '其它',
    name: '其它',
  }],
  craft: [{
    id: '染纱',
    name: '染纱',
  }, {
    id: '染色',
    name: '染色',
  }, {
    id: '印花',
    name: '印花',
  }, {
    id: '蜡染',
    name: '蜡染',
  }, {
    id: '其它',
    name: '其它',
  }],
  typeOfBacking: [{
    id: 'TC十字布',
    name: 'TC十字布',
  }, {
    id: 'TC十字起毛布',
    name: 'TC十字起毛布',
  }, {
    id: '佳积布',
    name: '佳积布',
  }, {
    id: '弹力起毛布',
    name: '弹力起毛布',
  }, {
    id: '针织布',
    name: '针织布',
  }, {
    id: '水剌无纺布',
    name: '水剌无纺布',
  }, {
    id: '细平布',
    name: '细平布',
  }, {
    id: '绒布',
    name: '绒布',
  }, {
    id: '泡沫底',
    name: '泡沫底',
  }, {
    id: '棉布底',
    name: '棉布底',
  }, {
    id: '麻布底',
    name: '麻布底',
  }, {
    id: '真皮底',
    name: '真皮底',
  }, {
    id: '麂皮绒',
    name: '麂皮绒',
  }, {
    id: '超纤',
    name: '超纤',
  }, {
    id: '再生皮',
    name: '再生皮',
  }],
  widthUnit: [{
    id: 'cm',
    name: 'cm',
  }, {
    id: '英寸',
    name: '英寸',
  }],
  lengthUnit: [{
    id: '米',
    name: '米',
  }, {
    id: '英尺',
    name: '英尺',
  }],
  modeOfProduction: [{
    id: '纬编',
    name: '纬编',
  }, {
    id: '经编',
    name: '经编',
  }],
  organizationType: [{
    id: '平纹',
    name: '平纹',
  }, {
    id: '斜纹',
    name: '斜纹',
  }, {
    id: '缎纹',
    name: '缎纹',
  }, {
    id: '其他材质',
    name: '其他材质',
  }],
  physical: {
    shape: [{
      id: '扁带',
      name: '扁带',
    }, {
      id: '圆带/椭圆带',
      name: '圆带/椭圆带',
    }, {
      id: '三角带',
      name: '三角带',
    }, {
      id: '四方带',
      name: '四方带',
    }, {
      id: '葫芦带',
      name: '葫芦带',
    }, {
      id: '珍珠带',
      name: '珍珠带',
    }, {
      id: '花边带',
      name: '花边带',
    }, {
      id: '凹凸带',
      name: '凹凸带',
    }, {
      id: '其它',
      name: '其它',
    }],
    functionPurpose: [{
      id: '运动鞋带',
      name: '运动鞋带',
    }, {
      id: '户外鞋带',
      name: '户外鞋带',
    }, {
      id: '板鞋鞋带',
      name: '板鞋鞋带',
    }, {
      id: '皮鞋鞋带',
      name: '皮鞋鞋带',
    }, {
      id: '纽扣鞋带',
      name: '纽扣鞋带',
    }, {
      id: '蝴蝶带',
      name: '蝴蝶带',
    }, {
      id: '其它',
      name: '其它',
    }],
    typeOfRawMaterial: [{
      id: '涤纶鞋带',
      name: '涤纶鞋带',
    }, {
      id: '涤棉鞋带',
      name: '涤棉鞋带',
    }, {
      id: '插金鞋带',
      name: '插金鞋带',
    }, {
      id: '其它',
      name: '其它',
    }],
    craft: [{
      id: '染纱',
      name: '染纱',
    }, {
      id: '染色',
      name: '染色',
    }, {
      id: '印花',
      name: '印花',
    }, {
      id: '蜡染',
      name: '蜡染',
    }, {
      id: '其它',
      name: '其它',
    }],
  },
  other: {
    softness: [{
      id: '软',
      name: '软',
    }, {
      id: '适中',
      name: '适中',
    }, {
      id: '硬',
      name: '硬',
    }],
    airPermeability: [{
      id: '不透',
      name: '不透',
    }, {
      id: '适中',
      name: '适中',
    }, {
      id: '透气',
      name: '透气',
    }],
    wearResistance: [{
      id: '不耐磨',
      name: '不耐磨',
    }, {
      id: '适中',
      name: '适中',
    }, {
      id: '耐磨',
      name: '耐磨',
    }],
    elasticForce: [{
      id: '无弹',
      name: '无弹',
    }, {
      id: '微弹',
      name: '微弹',
    }, {
      id: '弹力',
      name: '弹力',
    }],
  },
};

// const numberReg = /^([\d]+[\d]*(\.[\d]{1,2})?)$/;
// const numberRules = [{ pattern: numberReg, message: '请输入最多保留两位的数字' }];
const unNumberReg = /[^(\d|.)]/g;
const numberEvents = {
  oninput: (e: InputEvent) => {
    const { value } = e.target as HTMLInputElement;
    const numberStr = value.replace(unNumberReg, '');
    const radix = value.split('.')[1] || '';
    const result = radix.length > 2 ? (+numberStr).toFixed(2) : numberStr;
    (e.target as HTMLInputElement).value = result;
  },
};


const addValue = (formItems: FormItems, apiParams?: Obj) => {
  if (!apiParams) return;

  formItems.forEach(item => {
    const key = item.key as string;
    const apiValue = apiParams[key] ?? '';
    // 需要处理的特殊值
    switch (key) {
      case 'applicableProduct':
        item.value = tryParseJson(apiValue) ?? [];
        break;
      case 'applicableParts':
        {
          const apiValue2FrontValue = () => {
            const _apiValue: ModelApiItem[] = apiValue;
            let frontStrArr: string[] = [];
            _apiValue.forEach(model => {
              const subModels = model.modelProp;
              subModels.forEach(subModel => {
                const modelFrontStrArr = subModel.partProp?.map(part => `${model.id},${part.code}`) || [];
                frontStrArr = [...frontStrArr, ...modelFrontStrArr];
              });
            });
            const frontValue = [...new Set(frontStrArr)].map(_item => _item.split(','));
            return frontValue;
          };
          item.value = apiValue2FrontValue();
        }
        break;
      case 'softness':
      case 'airPermeability':
      case 'wearResistance':
      case 'elasticForce':
        // 最好是后端直接返回数字,不需要前端再处理一下
        item.value = +apiValue;
        break;
      default:
        {
          const value = (item.multiple && apiValue) ? apiValue.split(',') : apiValue;
          if (value || value === 0) item.value = value;
        }
        break;
    }
  });
};

export const useFormData = (category: Ref<Category>, refApiParams?: Ref<Obj>) => {
  const baseFormData = computed(() => {
    const { big } = category.value; // 为了触发清空时重置数据,也为后面做准备
    const formItems: FormItems = [{
      key: 'name',
      title: '材料名称',
      keepVisible: true,
      rules: [{ required: true }],
    }, {
      key: 'sn',
      title: '供应商货号',
      keepVisible: true,
      rules: [{ required: true }],

    }, {
      key: 'year',
      title: '年份',
      type: 'select',
      keepVisible: true,
      options: getOptions(options.yaer),
      rules: [{ required: true }],

    }, {
      key: 'season',
      title: '季度',
      type: 'select',
      keepVisible: true,
      options: getOptions(options.season),
      multiple: true,
      rules: [{ required: true }],
    }, {
      key: 'applicableProduct',
      title: '适用产品',
      type: 'select',
      multiple: true,
      keepVisible: true,
      options: getOptions(options.applicableProduct),
      // type: 'cascader',
      // options: getOptions(options.applicableProduct),
      // props: { multiple: true },
      rules: [{ required: true }],
    }, {
      key: 'applicableParts',
      title: '公模/部位',
      keepVisible: true,
      rules: [{ required: true }],
    }, {
      key: 'series',
      title: '系列',
    }, {
      key: 'designContent',
      title: '印刷纹路和图案',
      placeholder: '按下enter生成标签',
      value: [],
      multiple: true,
    }, {
      key: 'isEnvironmentProtection',
      title: '是否环保',
      type: 'select',
      options: getOptions(options.isEnvironmentProtection),
      value: 1,
    }, {
      key: 'environmentProtectionType',
      title: '环保类型',
      type: 'select',
      options: getOptions(options.environmentProtectionType),
    }, {
      key: 'isWaterproof',
      title: '是否防水',
      type: 'select',
      options: getOptions(options.isWaterproof),
      value: 1,
    }, {
      key: 'block1',
      title: '',
      type: 'block',
    }, {
      key: 'colorRestriction',
      title: '颜色限制',
      childType: 'textarea',
      rows: 4,
      maxlength: 200,
    }, {
      key: 'note',
      title: '注意事项',
      childType: 'textarea',
      rows: 4,
      maxlength: 200,
    }];
    addValue(formItems, refApiParams?.value);
    return formItems;
  });
  const businessFormData = computed(() => {
    const { big } = category.value;// 为了触发清空时重置数据,也为后面做准备
    const formItems: FormItems = [{
      key: 'isInStock',
      title: '是否现货',
      type: 'radio',
      keepVisible: true,
      options: getOptions(options.isInStock),
      value: 1,
      rules: [{ required: true }],
    }, {
      key: 'isAgain',
      title: '是否允许被分享',
      type: 'radio',
      keepVisible: true,
      options: getOptions(options.isAgain),
      value: 1,
      rules: [{ required: true }],
    }, {
      key: 'physicalSamplePrice',
      title: '实物样品费用',
      keepVisible: true,
      formItemProps: {
        class: 'material-upload-has-unit',
      },
      rules: [{ required: true }],
      ...numberEvents,
    }, {
      key: 'physicalSamplePriceUnit',
      title: '实物样品费用单位',
      type: 'select',
      keepVisible: true,
      options: getOptions(options.priceUnit),
      value: '人民币',
    }, {
      key: 'physicalSampleLeadTime',
      title: '实物样本生产周期',
      keepVisible: true,
      formItemProps: {
        class: 'material-upload-has-unit',
      },
      rules: [{ required: true }],
      ...numberEvents,
    }, {
      key: 'physicalSampleLeadTimeUnit',
      title: '实物样本生产周期单位',
      type: 'select',
      keepVisible: true,
      options: getOptions(options.timeUnit),
      value: '天',
    }, {
      key: 'unit',
      title: '单位',
      type: 'select',
      options: getOptions(options.unit),
    }, {
      key: 'sampleMoq',
      title: '样品起订量',
      formItemProps: {
        class: 'material-upload-has-unit',
      },
      ...numberEvents,
    }, {
      key: 'sampleMoqUnit',
      title: '样品起订量单位',
      type: 'select',
      options: getOptions(options.unit),
      value: '码',
    }, {
      key: 'moq',
      title: '量产起订量',
      formItemProps: {
        class: 'material-upload-has-unit',
      },
      ...numberEvents,
    }, {
      key: 'moqUnit',
      title: '量产起订量单位',
      type: 'select',
      options: getOptions(options.unit),
      value: '码',
    }, {
      key: 'samplePrice',
      title: '样品价格',
      formItemProps: {
        class: 'material-upload-has-unit double',
      },
      ...numberEvents,
    }, {
      key: 'samplePriceCurrency',
      title: '样品价格币种',
      type: 'select',
      options: getOptions(options.priceUnit),
      value: '人民币',
    },
    {
      key: 'samplePriceUnit',
      title: '样品价格单位',
      type: 'select',
      options: getOptions(options.unit),
      value: '码',
    }, {
      key: 'price',
      title: '大货价格',
      formItemProps: {
        class: 'material-upload-has-unit double',
      },
      ...numberEvents,
    }, {
      key: 'priceCurrency',
      title: '大货价格币种',
      type: 'select',
      options: getOptions(options.priceUnit),
      value: '人民币',
    }, {
      key: 'priceUnit',
      title: '大货价格单位',
      type: 'select',
      options: getOptions(options.unit),
      value: '码',
    }, {
      key: 'developmentCycle',
      title: '开发周期',
      formItemProps: {
        class: 'material-upload-has-unit',
      },
      ...numberEvents,
    }, {
      key: 'developmentCycleUnit',
      title: '开发周期单位',
      type: 'select',
      options: getOptions(options.timeUnit),
      value: '天',
    }, {
      key: 'leadTime',
      title: '量产周期',
      formItemProps: {
        class: 'material-upload-has-unit',
      },
      ...numberEvents,
    }, {
      key: 'leadTimeUnit',
      title: '量产周期单位',
      type: 'select',
      options: getOptions(options.timeUnit),
      value: '天',
    }, {
      key: 'currency',
      title: '货币',
      type: 'select',
      options: getOptions(options.currency),
    }];
    addValue(formItems, refApiParams?.value);
    return formItems;
  });
  const featureFormData = computed(() => {
    const { big } = category.value;
    if (!big.name) return [];
    const formItems: FormItems = [
      {
        key: 'averageSize',
        title: '平均尺寸',
        formItemProps: {
          class: 'material-upload-has-unit',
        },
        show: ['皮料'].includes(big.name),
        ...numberEvents,
      }, {
        key: 'averageSizeUnit',
        title: '平均尺寸单位',
        type: 'select',
        options: getOptions(options.averageSizeUnit),
        value: '平方英尺',
        show: ['皮料'].includes(big.name),
      }, {
        key: 'component',
        title: '成分',
        show: ['纺织品'].includes(big.name),
      }, {
        key: 'yarnAndProportion',
        title: '纱线及占比',
        show: ['纺织品'].includes(big.name),
      }, {
        key: 'compositeMode',
        title: '复合方式',
        show: ['纺织品'].includes(big.name),
      }, {
        key: 'grammage',
        title: '克重',
        formItemProps: {
          class: 'material-upload-has-unit',
        },
        ...numberEvents,
        show: ['纺织品', '皮料', '人造革'].includes(big.name),
      }, {
        key: 'grammageUnit',
        title: '克重单位',
        type: 'select',
        options: getOptions(options.grammageUnit),
        value: '平米克重',
        show: ['纺织品', '皮料', '人造革'].includes(big.name),
      }, {
        key: 'thickness',
        title: '厚度',
        formItemProps: {
          class: 'material-upload-has-unit',
        },
        ...numberEvents,
        show: ['纺织品', '皮料', '人造革'].includes(big.name),
      }, {
        key: 'thicknessUnit',
        title: '厚度单位',
        type: 'select',
        options: getOptions(options.thicknessUnit),
        value: 'mm',
        show: ['纺织品', '皮料', '人造革'].includes(big.name),
      }, {
        key: 'width',
        title: '幅宽',
        formItemProps: {
          class: 'material-upload-has-unit',
        },
        show: ['纺织品', '人造革'].includes(big.name),
        ...numberEvents,
      }, {
        key: 'widthUnit',
        title: '幅宽单位',
        type: 'select',
        options: getOptions(options.widthUnit),
        value: 'cm',
        show: ['纺织品', '人造革'].includes(big.name),
      }, {
        key: 'length',
        title: '织物匹长',
        formItemProps: {
          class: 'material-upload-has-unit',
        },
        show: ['纺织品'].includes(big.name),
      }, {
        key: 'lengthUnit',
        title: '织物匹长单位',
        type: 'select',
        options: getOptions(options.lengthUnit),
        value: '米',
        show: ['纺织品'].includes(big.name),
      }, {
        key: 'tanningMethod',
        title: '鞣法',
        type: 'select',
        options: getOptions(options.tanningMethod),
        show: ['皮料'].includes(big.name),
      }, {
        key: 'oilContent',
        title: '含油量',
        formItemProps: {
          class: 'material-upload-has-unit',
        },
        show: ['皮料', '人造革'].includes(big.name),
        ...numberEvents,
      }, {
        key: 'oilContentUnit',
        title: '含油量单位',
        type: 'select',
        options: getOptions(options.oilContentUnit),
        value: '%',
        show: ['皮料', '人造革'].includes(big.name),
      }, {
        key: 'highTemperatureRange',
        title: '可承受高温范围',
        show: ['纺织品', '皮料', '人造革'].includes(big.name),
      }, {
        key: 'engineeringDesignMode',
        title: '工程设计方式',
        type: 'select',
        options: getOptions(options.engineeringDesignMode),
        show: ['纺织品'].includes(big.name),
      }, {
        key: 'structureMode',
        title: '结构方式',
        type: 'select',
        options: getOptions(options.structureMode),
        show: ['纺织品'].includes(big.name),
      }, {
        key: 'subType',
        title: '材料子类型',
        type: 'select',
        options: getOptions(options.subType),
        show: ['纺织品'].includes(big.name),
      }, {
        key: 'qualityGrade',
        title: '质量等级',
        type: 'select',
        options: getOptions(options.qualityGrade),
        show: ['皮料'].includes(big.name),
      }, {
        key: 'rawMaterialBase',
        title: '原料基地',
        show: ['皮料'].includes(big.name),
      }, {
        key: 'mechanicalTreatment',
        title: '机械处理',
        type: 'select',
        options: getOptions(options.mechanicalTreatment),
        show: ['皮料'].includes(big.name),
      }, {
        key: 'textureType',
        title: '纹理',
        type: 'select',
        options: getOptions(options.textureType),
        show: ['皮料'].includes(big.name),
      }, {
        key: 'chemicalTreatment',
        title: '化学处理',
        type: 'select',
        options: getOptions(options.chemicalTreatment),
        show: ['皮料'].includes(big.name),
      },
      {
        key: 'tc',
        title: '涂层',
        type: 'select',
        options: getOptions(options.tc),
        show: ['人造革'].includes(big.name),
      },
      // {
      //   key: 'isDorsum',
      //   title: '是否有背底',
      //   type: 'select',
      //   options: getOptions(options.isDorsum),
      //   value: 1,
      //   show: ['人造革'].includes(big.name),
      // }, {
      //   key: 'dorsumType',
      //   title: '背底类型',
      //   type: 'select',
      //   options: getOptions(options.dorsumType),
      //   show: ['人造革'].includes(big.name),
      // },
      {
        key: 'moldingMethod',
        title: '成型方式',
        type: 'select',
        options: getOptions(options.moldingMethod),
        show: ['人造革'].includes(big.name),
      }, {
        key: 'releasePaper',
        title: '离型纸',
        show: ['人造革'].includes(big.name),
      }, {
        key: 'surfaceEffect',
        title: '表面效果',
        type: 'select',
        options: getOptions(options.surfaceEffect),
        show: ['人造革'].includes(big.name),
      }, {
        key: 'transparency',
        title: '透明度',
        type: 'select',
        options: getOptions(options.transparency),
        show: ['人造革'].includes(big.name),
      }, {
        key: 'hardness',
        title: '硬度',
        show: ['其它'].includes(big.name),
      }, {
        key: 'density',
        title: '密度',
        show: ['其它'].includes(big.name),
      }];
    addValue(formItems, refApiParams?.value);
    return formItems;
  });
  const otherFormData = computed(() => {
    const { big } = category.value;
    if (!big.name || big.name === '其它') return [];
    const formItems: FormItems = [{
      key: 'softness',
      title: '柔软性',
      value: 0,
      show: ['纺织品', '皮料', '人造革'].includes(big.name),
    }, {
      key: 'airPermeability',
      title: '透气性',
      value: 0,
      show: ['纺织品', '皮料', '人造革'].includes(big.name),
    }, {
      key: 'wearResistance',
      title: '耐磨损性',
      value: 0,
      show: ['纺织品'].includes(big.name),
    }, {
      key: 'elasticForce',
      title: '弹力',
      value: 0,
      show: ['纺织品', '皮料', '人造革'].includes(big.name),
    }, {
      key: 'colorFastness',
      title: '色牢度',
      show: ['纺织品'].includes(big.name),
    }, {
      key: 'testStandardNo',
      title: '检测标准编号',
      show: ['纺织品', '皮料', '人造革'].includes(big.name),
    }];
    addValue(formItems, refApiParams?.value);
    return formItems;
  });
  return {
    baseFormData, businessFormData, featureFormData, otherFormData,
  };
};

const editFormData = useFormData(ref({ big: { id: '', level: -1, name: '1' }, middle: { id: '', level: -1, name: '1' } }));

console.log(editFormData);
export const editFormKeyMap = {
  ...Object.values(editFormData).reduce((result, subList) => {
    subList.value.forEach(item => {
      result[item.key] = item.title;
    });
    return result;
  }, {} as Obj),
  ...{
    categoryId: '材料类型',
    docs: '文档',
    videos: '视频',
    images: '图片',
    rendering: '色卡',
  },
};
