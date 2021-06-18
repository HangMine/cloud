

export const applicableProduct = ['鞋', '服', '包'] as const;

export const designContent = ['素色', '条纹', '图形', '动物', '植物', '花纹', '其他'] as const;

export const categoryName2surfaceTechnics = {
  织物: ['染色', '印花', '水洗', '色织', '提花', '绣花', '烫金', '涂层', '压褶', '复合', '其他'] as const,
  人造革: ['纸纹', '压纹', '漆面', '磨砂', '绒面', '蜡面', '荔枝纹', '鳄鱼纹', '编织', '涂层', '贴膜', '其他'] as const,
  真皮: ['全水染皮 (全苯胺)', '半水染皮 (半苯胺)', '涂料皮', '重涂料皮', '打蜡皮', '丝绸皮', '抛光皮', '纳帕皮', '其他'] as const,
};


export const categoryName2MaterialsTechnology = {
  织物: ['平纹', '斜纹', '提花', '牛津布', '帆布', '牛仔布', '桃皮绒', '超细纤维', '仿麂皮', '双色', '格子', '条子', '格力特', '网布', '其他'] as const,
  人造革: ['油性', '水性', '无溶剂', '环保', '透明', '格力特', '网料', '其他'] as const,
  真皮: ['粒面皮', '修面皮', '漆皮', '压花皮', '印花皮', '磨砂皮', '绒面皮', '摔纹皮', '马毛皮', '其他'] as const,
};

type Item<A> = A extends readonly (infer T)[] ? T : A extends (infer T)[] ? T : never;
type Values<O> = O extends { [k in any]: infer T } ? T : never;
export type SurfaceTechnics = Item<Values<typeof categoryName2surfaceTechnics>>;
export type MaterialsTechnology = Item<Values<typeof categoryName2MaterialsTechnology>>;
export type ApplicableProductLine = Item<typeof applicableProduct>;
export type DesignContent = Item<typeof designContent>;
export type BaseCategoriesName = keyof typeof categoryName2MaterialsTechnology;


// 色卡
export interface RenderingInfoItem {
  sort: number,
  name: string,
  colorInfo: string,
  colorFamily: string,
  isDefault: number,
  isBan: number,
  fileInfo: {
    '4ddat': string
  },
  imgInfo?: Obj
  renderingInfo?: Obj
}
export type RenderingInfo = RenderingInfoItem[];

// 面料基本信息
export class MaterialAttr {
  // 基本信息
  name = ''; // 材料名
  designContent = ''; // 图案内容（印刷纹路和图案）
  sn = ''; // 编号（供货商货号）
  year = ''; // 年份
  season: string | string[] = ''; // 季节
  series = ''; // 系列
  applicableProduct: string | string[] = ''; // 适用产品线
  applicableParts: Obj[] = []; // 适用部位
  isEnvironmentProtection = ''; // 是否环保
  environmentProtectionType = ''; // 环保类型
  isWaterproof = ''; // 是否防水

  colorRestriction = ''; // 颜色限制
  note = ''; // 注意事项
  // 业务信息
  isInStock = ''; // 是否现货
  unit = ''; // 单位(沟通单位)
  sampleMoq = ''; // 样品起订量
  moq = ''; // 大货起订量（量产起订量）
  moqUnit = ''; // 大货起订量单位
  samplePrice = ''; // 样品价格
  samplePriceUnit = ''; // 样品价格单位
  samplePriceCurrency = ''; // 样品价格币种
  sampleMoqUnit = ''; // 样品起订量单位
  price = ''; // 大货价格
  priceUnit = ''; // 大货价格单位
  priceCurrency = '';// 大货价格币种
  developmentCycle = ''; // 开发周期
  developmentCycleUnit = ''; // 开发周期单位
  leadTime = ''; // 大货生产周期（量产周期）
  leadTimeUnit = ''; // 大货生产周期单位（量产周期单位）
  physicalSamplePrice = ''; // 实物样本价格
  physicalSamplePriceUnit = ''; // 实物样本价格单位
  physicalSampleLeadTime = ''; // 实物样本生产周期
  physicalSampleLeadTimeUnit = ''; // 实物样本生产周期单位
  currency = ''; // 币种

  // 特征属性
  materialTechnology: string | string[] = ''; // 材料工艺（颗粒面特征）
  surfaceTechnology: string | string[] = ''; // 表面工艺
  averagesize = ''; // 平均尺寸
  averageSizeUnit = ''; // 平均尺寸单位
  grammage = ''; // 克重
  grammageUnit = ''; // 克重单位【只是前端用到】
  thickness = ''; // 厚度
  thicknessUnit = ''; // 厚度单位
  tanningMethod = ''; // 鞣法
  oilContent = ''; // 含油量
  oilContentUnit = ''; // 含油量单位【只是前端用到】
  highTemperatureRange = ''; //  可承受高温范围
  qualityGrade = ''; // 质量等级
  rawMaterialBase = ''; // 原料基地
  texturetype = ''; // 纹理类型
  typeOfBacking = ''; // 底布类型
  width = ''; // 幅宽
  widthUnit = ''; // 幅宽单位
  modeOfProduction = ''; //  生产方式
  component = ''; // 成分
  yarnAndProportion = ''; //  纱线及占比
  compositeMode = ''; //  复合方式
  length = ''; // 匹长(纱线及匹长)
  lengthUnit = ''; // 匹长单位(米)【只是前端用到】
  organizationType = ''; // 组织类型
  squareMeterWeight = ''; //  平方米重（g/sq）
  shape = ''; // 形状
  functionPurpose = ''; // 功能用途
  typeOfRawMaterial = ''; // 原料类型
  craft = ''; // 工艺
  engineeringDesignMode = ''; // 工程设计方式
  structureMode = ''; // 结构方式
  subType = ''; // 材料子类型
  mechanicalTreatment = ''; // 机械处理
  textureType = ''; // 纹理
  chemicalTreatment = ''; // 化学处理
  isDorsum = ''; // 是否有背底
  dorsumType = ''; // 背底类型
  moldingMethod = ''; // 成型方式
  releasePaper = ''; // 离型纸
  surfaceEffect = ''; // 表面效果
  transparency = ''; // 透明度
  hardness = ''; // 硬度
  density = ''; // 密度


  // 其它属性
  softness = ''; // 柔软性
  airPermeability = ''; //  透气性
  wearResistance = ''; //  耐磨损性
  elasticForce = ''; // 弹力
  colorFastness = ''; //  色牢度
  testStandardNo = ''; //  检测标准编号


  // 未分配
  hasFile: 1 | 0 = 0; // 是否有4ddat文件
  areaCode = ''; // 区域码
  expireTime = ''; // 过期时间
  detail = ''; // 详情
  orgId = ''; // 租户id
  placeOfOrigin = ''; // 产地
  temperatureUnit = ''; // 温度单位
  countryCode = ''; // 国家码
  attribute = ''; // 额外属性
  specification = ''; // 材料规格
  originalId = ''; // 源id
  categoryId = ''; // 材料类目
}

// 面料表单信息
// export class MaterailForm extends MaterialAttr {
//   season: string[] = [];
//   applicableProduct: string[] = [];
//   surfaceTechnology: string | string[] = '';
//   materialtechnology: string[] = [];
// }

// 面料
export interface EnclosureItem {
  url: string,
  name: string
}
export class Material {
  // 色卡相关信息
  renderingInfo: RenderingInfo = [];
  // 附件信息
  enclosureInfo: {
    videos: EnclosureItem[],
    docs: EnclosureItem[],
    images: EnclosureItem[]
  } = ({
    videos: [] as unknown as EnclosureItem[],
    docs: [] as unknown as EnclosureItem[],
    images: [] as unknown as EnclosureItem[],
  });
  // 表单信息
  attributeInfo = new MaterialAttr();
}


export const materialStatus = {
  待上架: '待上架' as const,
  已上架: '已上架' as const,
  已下架: '已下架' as const,
};

export const colorFamily = {
  红色: '红色' as const,
  橙色: '橙色' as const,
  黄色: '黄色' as const,
  绿色: '绿色' as const,
  青色: '青色' as const,
  蓝色: '蓝色' as const,
  紫色: '紫色' as const,
  黑色: '黑色' as const,
  白色: '白色' as const,
  灰色: '灰色' as const,
  棕色: '棕色' as const,
  粉色: '粉色' as const,
  米色: '米色' as const,
  多色: '多色' as const,
};

export type MaterialStatus = keyof typeof materialStatus;
export const materialStatusOptions = Object.entries(materialStatus).map(([key, title]) => ({
  key,
  title,
}));

export const colorFamilyOptions = Object.entries(colorFamily).map(([key, title]) => ({
  key,
  title,
}));

interface MaterialDetailAttribute extends MaterialAttr {
  creator: string,
  gmtCreateTime: string,
  gmtModifyTime: string,
  season: string,
  applicableParts: Obj[],
  applicableProduct: string,
}
export interface MaterialDetail extends Material {
  attributeInfo: MaterialDetailAttribute
  supplierInfo: {
    supplierName: string,
    supplierLocation: string
  },
  isCollect: boolean,
  isApply: boolean, // 是否申请过样品
  originalCId: string, // 面料ID
}

export interface MaterialListItem extends MaterialAttr {
  season: string,
  applicableProduct: string,
  surfaceTechnology: string,
  materialtechnology: string,
  id: string,
  catalogId: string,
  originalCId: string,
  tag: MaterialStatus,
  creator: string,
  isAgain: number,
  isAgainText: string,
  gmtCreateTime: string,
  gmtModifyTime: string,
  renderingInfo: {
    name: RenderingInfoItem['name'],
    colorFamily: RenderingInfoItem['colorFamily'],
    materialId: string,
    isDefault: boolean,
    isBan: boolean,
    imgInfo: Obj
  }[],
  images: string[], // 附件图片列表
  supplierName?: string,
  materialTypeContent?: string, // 材料类型文本
}

export type MaterialList = MaterialListItem[];

export interface SharedMaterialItem extends MaterialListItem {
  isChecked: boolean,
  isCollect: boolean,
}

export default Material;
