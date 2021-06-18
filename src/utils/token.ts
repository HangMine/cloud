import Cookies from 'js-cookie';
import documentDomain from '@/utils/document-domain';

const rIpv4 = /\d+\.\d+\.\d+\.\d+/;
const TOKEN_NAME = 'u';

function getDomainConfig() {
  const path = '/';
  if (documentDomain === 'localhost' || rIpv4.test(documentDomain)) {
    return {
      path,
    };
  }

  return {
    domain: `.${documentDomain}`,
    path,
  };
}

export default {
  get(): string | undefined {
    return Cookies.get(TOKEN_NAME);
    // return localStorage.getItem(TOKEN_NAME);
  },
  set(token: string): void {
    Cookies.set(TOKEN_NAME, token, getDomainConfig());
    // localStorage.setItem(TOKEN_NAME, token);
  },
  remove(): void {
    Cookies.remove(TOKEN_NAME, getDomainConfig());
    // localStorage.removeItem(TOKEN_NAME);
  },
};
