<script>
import { defineComponent, markRaw } from 'vue'
import AppCrudItem from 'components/AppCrudItem.vue'
import ProgramacaodocsFormDialog from 'pages/Financeiro/programacaodocs-form-dialog.vue'
import { openFile } from 'src/modules/utils'
import { docsGridMixin } from 'src/mixins/docsGridMixin'

export default defineComponent({
  name: 'programacaodocs-grid',
  extends: AppCrudItem,
  mixins: [ docsGridMixin ],
  data: () => {
    return {
      options: {},
      startUpdate: false
    }
  },
  computed: {
      module () {
        return this.grid.table.toLowerCase()
      },
      moduleForm () {
        return this.form.table.toLowerCase()
      }
    },
    mounted () {
      this.permitions.view = true
      this.componentForm = markRaw(ProgramacaodocsFormDialog)
    }
  })
  </script>
