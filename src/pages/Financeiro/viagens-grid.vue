<template>
  <div class="q-pa-xs">
    <div class="row q-gutter-xs">
      <q-card flat  v-for="(row, index) in this.data" :key="index" >
        <q-list dense>
          <q-item>
            <q-item-section><q-item-label caption>Viagem</q-item-label></q-item-section>
            <q-item-section><q-item-label class="text-h6">{{row.PROGRAMACAO_ID}}</q-item-label></q-item-section>
          </q-item>
          <q-item>
            <q-item-section><q-item-label caption>Data/Hora viagem</q-item-label></q-item-section>
            <q-item-section><q-item-label class="text-subtitle1">{{formatDate(row.DATA_VIAGEM)}} - {{row.HORA_VIAGEM}}</q-item-label></q-item-section>
          </q-item>
          <q-item>
            <q-item-section><q-item-label caption>Motorista</q-item-label></q-item-section>
            <q-item-section><q-item-label class="text-subtitle1">{{row.MOT_NOME}}</q-item-label></q-item-section>
          </q-item>
          <q-item>
            <q-item-section><q-item-label caption>Celular motorista</q-item-label></q-item-section>
            <q-item-section><q-item-label class="text-subtitle1">{{row.MOT_CELULAR}}  {{row.MOT_TELEGRAM}}</q-item-label></q-item-section>
          </q-item>
          <q-item>
            <q-item-section><q-item-label caption>Origem</q-item-label></q-item-section>
            <q-item-section><q-item-label class="text-body1">{{row.ORIGEM}}</q-item-label></q-item-section>
          </q-item>
          <q-item>
            <q-item-section><q-item-label caption>Destino</q-item-label></q-item-section>
            <q-item-section><q-item-label class="text-body1">{{row.DESTINO}}</q-item-label></q-item-section>
          </q-item>
          <q-item>
            <q-item-section><q-item-label caption>Senha para assinar viagem</q-item-label></q-item-section>
            <q-item-section><q-item-label class="text-h6">{{row.FIN_TOKEN_GERADO}}</q-item-label></q-item-section>
          </q-item>
        </q-list>
        <q-card-actions align="center">
          <qrcode-vue :value="row.FIN_TOKEN_GERADO" :size="250" margin="2"></qrcode-vue>
        </q-card-actions>
      </q-card>
      <q-page-sticky position="bottom-left" :offset="[12, 12]">
        <q-btn
        icon="update"
        color="secondary"
        round
        @click="getList()"
        >
      </q-btn>
    </q-page-sticky>
  </div>

</div>
</template>
<script>

import { defineComponent } from 'vue'
import { gridMixin } from 'src/mixins/gridMixin.js'
import { formatDate } from 'src/modules/utils'
import QrcodeVue from 'qrcode.vue'

export default defineComponent({
  name: 'viagens-grid',
  components: {
    QrcodeVue
  },
  props: {
    grid: {
      title: String,
      table: String,
      primaryKey: String,
      foreignKey: String,
      columns: Array,
      menuContext: Array,
      visibleColumns: Array,
      formName: '',
      customHeader: {
        type: Boolean,
        default: () => true
      },
      summary: {
        type: Boolean,
        default: () => false
      },
      path: String,
      id: Number | String
    },
    form: {
      title: String,
      table: String,
      primaryKey: String,
      uniqueKey: String,
      fields: Object,
    },
    id: Number | String,
    fk: Number | String,
    parentRow: {
      type: Object,
      default: () => {}
    },
    readonly: Boolean,
    showTitle: {
      type: Boolean,
      default: () => false
    },
    showComboColumns: {
      type: Boolean,
      default: () => true
    },
  },
  mixins: [ gridMixin ],
  data: () => {
    return {
      tab: 1,
      data: [],
      abas: [
        {value: 1, label:'hoje'},
        {value: 2, label:'anteriores'},
        {value: 3, label:'Próximas'}
      ],
      formatDate
    }
  },
  methods: {
    getList() {
      return this.$api.get(`/vw_programacao_pas/${this.tab}`)
      .then(({data}) => {
        this.data = data.resultado || [];
      })
      .catch(error =>{
        this.loading = false;
      });
    },
  },
  mounted () {
    this.getList()
  }
})
</script>
