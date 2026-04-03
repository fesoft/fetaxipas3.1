<script>
import { defineComponent, markRaw } from 'vue'
import AppCrudItemEdit from 'components/AppCrudItemEdit.vue'
import AppInput from 'components/AppInput.vue'
import AppInputNumber from 'components/AppInputNumber.vue'
import AppCombobox from 'components/AppCombobox.vue'
import AppEditableAutocomplete from 'src/components/AppEditableAutocomplete.vue'


export default defineComponent({
  name: 'programacaoitem-grid',
  extends: AppCrudItemEdit,
  components: {
    AppInput,
    AppInputNumber,
    AppCombobox,
    AppEditableAutocomplete
  },
  methods: {
       formInput(field, row) {
      if (field == 'PASSAGEIRO_ID') {
        let res = null;
        let origem = '';
        let destino = '';
        let origem_latitude = '';
        let origem_longitude = '';
        let destino_latitude = '';
        let destino_longitude = '';
        let optionLocalOrigem = this.options['CLIENTE_LOCAL_ORIGEM'].filter(item => item.value == this.parentRow.CLIENTE_LOCAL_ORIGEM)
        let optionLocalDestino = this.options['CLIENTE_LOCAL_DESTINO'].filter(item => item.value == this.parentRow.CLIENTE_LOCAL_DESTINO)
        let option = this.options['PASSAGEIRO_ID'].filter(item => item.value == row.PASSAGEIRO_ID)
        if (option.length > 0) {
          res = option[0];
          switch (this.parentRow.CLIENTE_LOCAL_ORIGEM) {
            case '1': {
              origem = res.END_COMPLETO;
              origem_latitude = res.LATITUDE;
              origem_longitude = res.LONGITUDE;
            }
              break;
            case '2': origem = ''; break;
            default: {
              origem = optionLocalOrigem[0].label;
              origem_latitude = optionLocalOrigem[0].LATITUDE;
              origem_longitude = optionLocalOrigem[0].LONGITUDE;
            }
            break;
          }
          switch (this.parentRow.CLIENTE_LOCAL_DESTINO) {
            case '1': {
              destino = res.END_COMPLETO;
              destino_latitude = res.LATITUDE;
              destino_longitude = res.LONGITUDE;
            }
              break;
            case '2': destino = ''; break;
            default: {
              destino = optionLocalDestino[0].ENDERECO;
              destino_latitude = optionLocalDestino[0].LATITUDE;
              destino_longitude = optionLocalDestino[0].LONGITUDE;
            }
              break;
          }

        row.CR_CLIENTE_ID = res.CR_CLIENTE_ID;
        row.PASSAGEIRO = res.label;
        row.ORIGEM = origem,
        row.DESTINO = destino,
        row.CELULAR = res.CELULAR;
        row.TELEGRAM = res.TELEGRAM;
        row.EMAIL = res.EMAIL;
        row.ORIGEM_LATITUDE = origem_latitude;
        row.ORIGEM_LONGITUDE = origem_longitude;
        row.DESTINO_LATITUDE = destino_latitude;
        row.DESTINO_LONGITUDE = destino_longitude;
        //row.DESCRICAO_MOTIVO = motivo;
        row.PROGRAMACAO_ID = this.fk;
      }
    }
    },
    formNew(){
      let i = this.data.length + 1;
      this.data.push({
          PROGRAMACAO_ITEM_ID: `_index${i}`,
          PASSAGEIRO_ID: '',
          PASSAGEIRO: '',
          CR_CLIENTE_ID: '',
          ORIGEM: '',
          DESTINO: '',
          EMAIL: '',
          CELULAR: '',
          TELEGRAM: '',
          DESCRICAO_MOTIVO: ''
        });
    },
  },
  computed: {
    module () {
      return this.grid.table.toLowerCase()
    },
    moduleForm () {
      return this.form.table.toLowerCase()
    }
  }
})
</script>
