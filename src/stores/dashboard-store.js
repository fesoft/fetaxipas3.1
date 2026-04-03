import { defineStore } from 'pinia'


const homeLink = {name:'index', label:'Home'};

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    history: [homeLink],
    cooperativa: ''
  }),

  actions: {
    setHistory(payload) {
      if(payload != ''){
        if(this.history.filter(item => item.name == payload.name) > -1)
        this.history.push(payload)
      }
      else{
        this.history = []
        this.history.push(homeLink)
      }
    },
    removeHistory(index) {
      if (index > 0) {
        this.history.splice(index, 1);
      }
    }
  }
})
