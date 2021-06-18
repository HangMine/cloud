/* eslint-disable import/prefer-default-export */
import { MaterialList } from '@/models/Material';

export const checkShare = (materials: MaterialList) => {
  if (!materials.length) return false;
  const firstTag = materials[0].tag;
  return materials.every(item => item.tag === firstTag);
};
