export const lf2p = (v: string) => v.split('\n').map(item => `<p>${item}</p>`).join('');
export default lf2p;
