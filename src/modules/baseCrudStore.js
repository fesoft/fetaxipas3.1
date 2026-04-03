export const baseCrudStore = {
  state: () => ({
    serverPagination: {
      page: 1,
      rowsNumber: 5,
      rowsPerPage: 5,
      sortBy: undefined,
      descending: true
    },
    selected: [],
    filter: [],
    data: [],
    search: '',
  }),

  actions: {
    setSelected (payload) {
      this.selected = payload
    },
    setFilter (payload) {
      this.filter = payload
    },
    setPagination (payload) {
      this.pagination = payload
    },
    setData (payload) {
      this.data = payload
    },
    setSearch (payload) {
      this.search = payload
    }
  }
}
