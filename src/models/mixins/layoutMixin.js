export const layoutMixin = {
  methods: {
    saveLayout (table, importColums) {
      let params = {
        TABLE_NAME: table,
        IMPORT_COLUMNS: importColums
      };
      this.$api.post('/layout', params)
      .then(({data}) => {
        if(data.success) {
        } else {
          this.$q.notify({type: 'negative', message: data.msg})
        }
      })
    },
    getLayout (table) {
      let params ={
        _select: 'IMPORT_COLUMNS',
        _criterio: `TABLE_NAME = '${table}'`,

      };
      return this.$api.get(`/layout`, {params})
    },
  }
}
