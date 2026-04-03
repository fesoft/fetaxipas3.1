<script>
import { defineComponent } from 'vue'
import AppFormDialog from 'components/AppFormDialog.vue'
import { passageiroMixin } from 'src/mixins/Financeiro/passageiroMixin'

export default defineComponent({
  name: 'passageiro-form-dialog',
  extends: AppFormDialog,
  mixins: [ passageiroMixin ]
})
</script>
