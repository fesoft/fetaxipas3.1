<script>
import { defineComponent } from 'vue'
import AppForm from 'components/AppForm.vue'
import { vwprogramacaoMixin } from 'src/mixins/Financeiro/vwprogramacaoMixin'
import ProgramacaoitemGrid from 'src/pages/Financeiro/programacaoitem-grid.vue'

export default defineComponent({
  name: 'vwprogramacao-form',
  extends: AppForm,
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
