<script>
import { defineComponent } from 'vue'
import AppForm from 'components/AppForm.vue'
import { docsMixin } from 'src/mixins/docsMixin'
import AppFile from 'components/AppFile.vue'
import AppPdfView from 'components/AppPdfView.vue'

export default defineComponent({
  name: 'programacaodocs-form',
  extends: AppForm,
  mixins: [ docsMixin ],
  components: {
    AppFile,
    AppPdfView
  }
})
</script>
