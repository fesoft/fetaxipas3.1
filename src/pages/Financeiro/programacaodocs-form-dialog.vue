<script>
import { defineComponent } from 'vue'
import AppFormDialog from 'components/AppFormDialog.vue'
import AppFile from 'components/AppFile.vue'
import AppPdfView from 'components/AppPdfView.vue'
import { docsMixin } from 'src/mixins/docsMixin'

export default defineComponent({
  name: 'programacaodocs-form',
  extends: AppFormDialog,
  mixins: [ docsMixin ],
  components: {
    AppFile,
    AppPdfView
  }
})
</script>
