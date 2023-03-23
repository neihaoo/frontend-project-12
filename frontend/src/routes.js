const apiPath = '/api/v1';

const routes = {
  dataPath: () => [apiPath, 'data'].join('/'),
  loginPath: () => [apiPath, 'login'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  chatPagePath: () => '/',
  loginPagePath: () => '/login',
  signupPagePath: () => '/signup',
};

export default routes;
