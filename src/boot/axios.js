import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { token } from 'src/modules/utils'
import { useAuthStore } from 'stores/auth-store'
import { useDashboardStore } from 'stores/dashboard-store'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
//const api = axios.create({ baseURL: 'http://localhost/projetos/github/ferateioweb/api4/api/v1' })
//const apiLogin = axios.create({ baseURL: 'http://localhost/projetos/github/ferateioweb/api4/' })
const api = axios.create({ baseURL: `${process.env.BASE_URL}/${process.env.API_VERSION}`})
const apiLogin = axios.create({ baseURL: process.env.BASE_URL })

const store = useAuthStore()
const storeDashboard = useDashboardStore()


export default boot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
  app.config.globalProperties.$apiLogin = apiLogin

  //interceptors
  api.interceptors.request.use(function (config) {
      config.headers.Authorization = `Bearer ${token()}`;
      config.headers.Xcoop = storeDashboard.cooperativa;
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });
    api.interceptors.response.use(function (response) {
      return response;
    },
    function (error) {
      if(error.response.status == 401) {
        router.push('/auth/loginUser');
        storage.clear();
      }
      return Promise.reject(error);
    });
})

export { api }
