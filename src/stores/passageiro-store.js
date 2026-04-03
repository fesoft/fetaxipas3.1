import { defineStore } from 'pinia'
import { clone } from 'src/modules/utils'
import { baseCrudStore } from 'src/modules/baseCrudStore'

export const usePassageiroStore = defineStore('passageiro', clone(baseCrudStore))
