<script>
import { defineComponent } from 'vue'
import AppFormDialog from 'components/AppFormDialog.vue'
import { vwprogramacaoMixin } from 'src/mixins/Financeiro/vwprogramacaoMixin'
import ProgramacaoitemGrid from 'src/pages/Financeiro/programacaoitem-grid.vue'

export default defineComponent({
  name: 'vwprogramacao-form-dialog',
  extends: AppFormDialog,
  mixins: [ vwprogramacaoMixin ],
  components: {
    ProgramacaoitemGrid
  },
  created() {
    this.$emitter.on('form:before-save', this.onBeforeSave);
    this.$emitter.on('form:after-save', this.onAfterSave);
  }
})
</script>
