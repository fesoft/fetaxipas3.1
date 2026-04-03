import { defineStore } from 'pinia'

export const useComboStore = defineStore('combo', {
  state: () => ({
  options: {
    PASSAGEIRO: [],
    PASSAGEIRO_ID: [],
    CR_CLIENTE_ID: []
  }
  })
})
