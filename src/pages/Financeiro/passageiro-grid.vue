<script>
import { defineComponent, markRaw } from 'vue'
import AppCrud from 'components/AppCrud.vue'
import PassageiroDeleteForm from 'pages/Financeiro/passageiro-delete-form.vue'
import { clone } from 'src/modules/utils'
import { mapWritableState } from 'pinia'
import { usePassageiroStore } from 'stores/passageiro-store'
import PassageiroFormDialog from 'pages/Financeiro/passageiro-form-dialog.vue'
import { passageiro } from 'src/models/Financeiro/passageiro'

export default defineComponent({
  name: 'passageiro-grid',
  extends: AppCrud,
  methods: {
    deleteLote(){
      this.$q.dialog({
        component: PassageiroDeleteForm,
        componentProps: {
          ...passageiro.formDelete,
          fk: this.fk,
          method: 'new',
          options: this.options,
          parentRow: this.parentRow,
          persistent: true,
        }
      })
      .onOk(() => {
        this.requestGrid({
          pagination: this.serverPagination,
          filter: this.filter,
          search: this.search
        })
      })
    }
  },
  created () {
    this.grid.filter = this.grid.columns.map(item => item.field).reduce((acc, cur, i) => {
        acc[cur] = {}; return acc;}, {})
    if(this.filter.length == 0) {
      this.filter = clone(this.grid.filter);
    }
  },
  computed: {
    module () {
      return this.grid.table.toLowerCase()
    },
    moduleForm () {
      return this.form.table.toLowerCase()
    },
    ...mapWritableState(usePassageiroStore, [ 'data', 'serverPagination', 'selected', 'filter', 'search' ])
  },
  mounted () {
  this.componentForm = markRaw(PassageiroFormDialog)
    this.requestGrid({
      pagination: this.serverPagination,
      filter: this.filter,
      search: this.search
    })
  }
})
</script>
