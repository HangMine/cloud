import ASELoader from './ASELoader';

type AseColorItem = {
  color: [number, number, number],
  name: string
};

type AseColor = {
  colors: AseColorItem[],
  groups: unknown[],
  version: number[]
};

export const parseASE = async (file: File) => {
  const aseLoader = new ASELoader();
  const res = await aseLoader.load(file);
  return res as AseColor;
};

export default parseASE;
