/* eslint-disable*/
import envs from './envs';
import isDataPipeUrl from './is-data-pipe-url';
import {
  isOssUrl, signUrl, isNeedSignOssUrl, getUrlPrefix, thumb,
} from './oss/utils';

export type Material = {
  materialID?: string,
  id?: string,
  materialName?: string
  imgJson?: { [x in PropertyKey]: any }
  imgInfo?: { [x in PropertyKey]: any }
  renderingInfo: any,
  renderArguments: any,
  renderingJson: any,
};

type Component = {
  modelId: string,
  ctmId: string,
  ctmName: string,
  ctmPath: string,
  mapSec: string,
  url: string,
  materialId: string | null,
  material: Material | null,
  additionalJson: any,
};

// 渲染数据结构调整适配Viewer
export async function normalizeComponent(component: Component, thumbOptions = { style: 'web512' }, urlPrefix ?: string) {
  const result = await _normalizeComponent(component);
  if (result.material) {
    result.material = await normalizeIdeationMaterial(result.material, thumbOptions, urlPrefix);
  }
  return result;
}

async function _normalizeComponent(component: Component) {
  let { material, materialId } = component;
  if (component.materialId === 'basic' || component.materialId === '1') {
    materialId = null;
    material = null;
  }
  const result = {
    ...component,
    shoeId: component.modelId,
    material,
    componentID: component.ctmId,
    componentName: component.ctmName,
    materialId: material?.id ?? material?.materialID ?? materialId,
    url: component.ctmPath,
    withCredentials: false,
  };
  await Promise.all([
    (async () => {
      if (result.ctmPath) {
        const ctmPath = await normalizeRendererImgUrl(component.ctmPath);
        result.ctmPath = ctmPath;
        result.url = ctmPath;
        result.withCredentials = isDataPipeUrl(ctmPath);
      }
    })(),
  ]);
  return result;
}

export async function normalizeRendererImgUrl(imgPath: string, thumbOptions?: any, urlPrefix ?: string) {
  if (imgPath.search(/https?:/) === -1) {
    urlPrefix = urlPrefix ?? await getUrlPrefix();
    imgPath = `${urlPrefix}${imgPath.replace(/^\.\/?/, '')}`;
  }
  // Need VUE_APP_OSS_SIGN ?
  const _isOssUrl = isOssUrl(imgPath);
  const _isDatapileUrl = isDataPipeUrl(imgPath);
  const _isNeedSign = isNeedSignOssUrl(imgPath);
  // 摊牌了,材料平台不压材质图(效果优先)
  // if ((_isOssUrl || _isDatapileUrl) && thumbOptions) {
  //   imgPath = thumb(imgPath, thumbOptions);
  // }
  if (_isNeedSign) {
    imgPath = await signUrl(imgPath);
  }
  return imgPath;
}

export async function normalizeIdeationMaterial(material: Material, thumbOptions = { style: 'web512' }, urlPrefix ?: string) {
  const id = material.materialID ?? material.id;
  const name = material.materialName;
  const parsedMaterial = {
    ...material,
    materialId: id,
    materialID: id,
    materialName: name,
    name,
  };
  const parsedRenderingJson = tryParseRenderingJson(material.renderArguments ?? material.renderingJson);
  const imgJson = parsedMaterial.imgJson || parsedMaterial.imgInfo || {};
  await Promise.all(Object.keys(parsedRenderingJson).map(async (k) => {
    if (k.endsWith('Map') && parsedRenderingJson[k]) {
      const kWithoutMap = k.substring(0, k.length - 3);
      const renderArgumentMapKey2imgJsonKey = {
        diffuse: 'color',
        glossiness: 'gloss',
      } as Record<string, string>;
      parsedRenderingJson[k] = imgJson[k]
        || imgJson[kWithoutMap]
        || imgJson[renderArgumentMapKey2imgJsonKey[kWithoutMap]]
        || parsedRenderingJson[k];
      parsedRenderingJson[k] = await normalizeRendererImgUrl(parsedRenderingJson[k], thumbOptions, urlPrefix);
      parsedRenderingJson[`${k}CrossOrigin`] ??= envs.VUE_APP_IS_REMOTE && isDataPipeUrl(parsedRenderingJson[k]) ? 'use-credentials' : 'anonymous';
    }
  }));
  parsedMaterial.renderArguments = parsedRenderingJson;
  return parsedMaterial;
}

export async function normalizeMaterial(material: any, thumbOptions = { style: 'web512' }, urlPrefix ?: string) {
  const { id, name, imgInfo = {}, renderingInfo = {} } = material;
  const textureKeyMaps = {
    diffuse: 'color',
    normal: 'normal',
    glossiness: 'gloss',
    specular: 'specular',
    metallic: 'metallic',
    roughness: 'roughness',
    alpha: 'alpha',
  } as Record<string, string>;
  const materialData = renderingInfo.materials[0];
  const textures = materialData?.textures || [];
  const parsedMaterialInfo = {
    materialId: id,
    materialID: id,
    materialName: name,
    name,
    renderArguments: {}
  } as any;
  await Promise.all(Object.keys(textures).map(async (key) => {
    const path = textures[key].path;
    const absolutePath = imgInfo[path];
    if (absolutePath) {
      Object.keys(textureKeyMaps).map(async (name) => {
        let value = textureKeyMaps[name];
        if (key.toLocaleLowerCase().includes(value)){
          // 生成外层的map字段
          parsedMaterialInfo.renderArguments[`${name}Map`] = await normalizeRendererImgUrl(absolutePath, thumbOptions, urlPrefix);
          parsedMaterialInfo.renderArguments[`${name}MapCrossOrigin`] ??= envs.VUE_APP_IS_REMOTE && isDataPipeUrl(absolutePath) ? 'use-credentials' : 'anonymous';
        }
      });
    }
  }));
  parsedMaterialInfo.renderArguments.sddat = renderingInfo;
  return parsedMaterialInfo;
}

function tryParseRenderingJson(renderArguments: any) {
  let parsedRenderArguments: any;
  if (typeof renderArguments === 'string') {
    try {
      parsedRenderArguments = JSON.parse(renderArguments);
    } catch (e) {
      parsedRenderArguments = {};
    }
  } else {
    parsedRenderArguments = { ...renderArguments };
  }
  return parsedRenderArguments;
}