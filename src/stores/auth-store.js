import { defineStore } from 'pinia'
import { storage } from 'src/modules/utils'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuth: storage.getItem('fp_token') ? true : false,
    user: storage.getItem('fp_user') || {},
    permitions: storage.getItem('fp_permitions') || {},
    menus: storage.getItem('fp_menus') || {},
    token: storage.getItem('fp_token') || {},
    config: storage.getItem('fp_config') || {},
  }),

  actions: {
    setAuth(payload) {
        this.isAuth = payload
    },
    setToken(payload) {
      this.token =  payload
    },
    setUser(payload) {
      this.user = payload
    },
    setPermitions(payload) {
      this.permitions = payload
    },
    setMenus(payload) {
      this.menus = payload
    },
    setConfig(payload) {
      this.config = payload
    }
  }
})
