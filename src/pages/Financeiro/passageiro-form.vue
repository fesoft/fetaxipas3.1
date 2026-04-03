<script>
import { defineComponent } from 'vue'
import AppForm from 'components/AppForm.vue'
import { passageiroMixin } from 'src/mixins/Financeiro/passageiroMixin'

export default defineComponent({
  name: 'passageiro-form',
  extends: AppForm,
  mixins: [ passageiroMixin ]
})
</script>
