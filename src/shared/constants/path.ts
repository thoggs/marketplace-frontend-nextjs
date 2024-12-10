const serverUri = process.env.NEXT_SERVER_BASE_URL;
const clientUri = process.env.NEXT_PUBLIC_BASE_URL;

const buildPaths = (baseUri: string) => ({
  AUTH: {
    SIGN_IN: `${baseUri}/auth/signin`,
    SIGN_UP: `${baseUri}/auth/signup`,
    SIGN_IN_GITHUB: `${baseUri}/auth/github-signin`,
  },
  ENDPOINTS: {
    USERS: `${baseUri}/api/users`,
    PRODUCTS: `${baseUri}/api/products`,
  },
});

export const API = {
  SERVER: buildPaths(`${serverUri}`),
  CLIENT: buildPaths(`${clientUri}`),
};