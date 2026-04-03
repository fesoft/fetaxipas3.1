import { storage } from 'src/modules/utils'

export const configGridsMixin = {
  methods: {
    saveConfigGrids () {
      let params = {
        TABLE_NAME: this.grid.table,
        VISIBLE_COLUMNS: this.visibleColumns,
      };
      this.$api.post('/config_grids', params)
      .then(({data}) => {
        if(data.success) {
        } else {
          this.$q.notify({type: 'negative', message: data.msg})
        }
      })
    },
    getConfigGrids () {
      let id = storage.getItem('fp_user').id
      let params ={
        _select: 'VISIBLE_COLUMNS',
        _criterio: `TABLE_NAME = '${this.grid.table}' AND USUARIO_ID= ${id}`,

      };
      if (id)
      return this.$api.get(`/config_grids`, {params})
    },
  }
}
