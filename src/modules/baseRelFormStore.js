export const baseRelFormStore = {
  state: () => ({
    form: {
      FORMATO: 'PDF',
      RELATORIO: undefined,
    },
    tabs: [],
    tab: ''
  }),
  
  actions: {
    setForm (payload) {
      this.form = payload
    },
    setTabs (payload) {
      this.tabs = payload
    },
    setTab (payload) {
      this.tab = payload
    },
    resetAll(){
      this.$reset
    }
  }
}
