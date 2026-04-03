<script>
import { defineComponent, markRaw } from 'vue'
import AppCrud from 'components/AppCrud.vue'
import AppGridDialog from 'components/AppGridDialog.vue'
import AppSelect from 'components/AppSelect.vue'
import { clone, storage, formatarTempo } from 'src/modules/utils'
import { mapWritableState, mapActions } from 'pinia'
import { useVwProgramacaoStore } from 'stores/vwprogramacao-store'
import VwProgramacaoFormDialog from 'pages/Financeiro/vwprogramacao-form-dialog.vue'
import { gridMixin } from 'src/mixins/gridMixin'
import ProgramacaodocsGrid from 'pages/Financeiro/programacaodocs-grid.vue'
import { date } from 'quasar'
import AppMapRouter from 'components/AppMapRouter.vue'
import { useAuthStore } from 'src/stores/auth-store'

export default defineComponent({
  name: 'vwprogramacao-grid',
  extends: AppCrud,
  props:{
    grid: Object,
    form: Object
  },
  components: {
    AppSelect,
    AppGridDialog,
    ProgramacaodocsGrid
  },
  mixins: [ gridMixin ],
  data: () => ({
    optionsFilaTipo: [],
    formDialog: false,
    options: {
      STATUS: [
        {value: 'I', label:'Criada'},
        {value: 'V', label:'Enviada'},
        {value: 'A', label:'Confirmada'},
        {value: 'L', label:'Em andamento'},
        {value: 'E', label:'Finalizada'},
        {value: 'C', label:'Cancelada'},
        {value: '', label:'Todas'},
      ],
      NOME_ROTEIRO: [],
      NOME_COOPERADO: []
    }
  }),
  methods: {
  converterCoordenadasCustom(array, latProp = 'lat', lngProp = 'lng') {

      return array.map(item => [
        item[latProp],
        item[lngProp]
      ]);
    },
    mapaRotaViagem() {
      let selected = this.selected[0]
      if (selected.STATUS === 'E') {
         this.mapaRotaViagemFinalizada()
      } else {
        this.$q.notify({
          type: 'warning',
          message: 'Mapa disponível apenas para viagens finalizadas.'
        });
      }
    },
     mapaRotaViagemFinalizada() {
      let selected = this.selected[0]
      this.$api.get(`/programacao/dados_mapa/${selected.PROGRAMACAO_ID}`)
        .then(async ({ data }) => {
          let embarque = data.resultado.embarque || [];
          let desembarque = data.resultado.desembarque || [];
          let finalizacao = data.resultado.finalizacao || [];
          let routePoints = data.resultado.rota || [];
          let distancia = finalizacao[0].DISTANCIA_PERCORRIDA || 0;
          let tempo = finalizacao[0].TEMPO_VIAGEM * 60 * 1000;
          let dataHora = finalizacao[0]['MOT_FIN_DATA_HORA']
           tempo = tempo > 0 ? formatarTempo(tempo) : '0 minuto'

          const legendData = [
            { label: 'Passageiros', value: embarque.length },
            { label: 'Distância', value: distancia + ' Km'},
            { label: 'Tempo', value: tempo },
            { label: 'Data final', value: dataHora }
          ];

          const pickupCoords = this.converterCoordenadasCustom(embarque, 'lat', 'lng') || [];
          const desembCoords = this.converterCoordenadasCustom(desembarque, 'lat', 'lng') || [];
          const dropoffCoords = this.converterCoordenadasCustom(finalizacao, 'lat', 'lng') || [];

          const passengers = embarque || [];
          this.showMap(pickupCoords, desembCoords, dropoffCoords, routePoints, passengers, legendData);
        });
    },
    mapaRotaViagemEmAndamento() {
      let selected = this.selected[0]
      this.$api.get(`/programacao/dados_mapa/${selected.PROGRAMACAO_ID}`)
        .then(async ({ data }) => {
          let embarque = data.resultado.embarque || [];
          let desembarque = data.resultado.desembarque || [];
          let routePoints = data.resultado.rota || [];

          const legendData = [
            { label: 'Passageiros', value: embarque.length },
          ];

          const pickupCoords = this.converterCoordenadasCustom(embarque, 'lat', 'lng') || [];
          const desembCoords = this.converterCoordenadasCustom(desembarque, 'lat', 'lng') || [];
          const dropoffCoords = [];

          const passengers = embarque || [];
          this.showMap(pickupCoords, desembCoords, dropoffCoords, routePoints, passengers, legendData);
        });
    },
    showMap(pickupCoords, desembCoords, dropoffCoords, routePoints, passengers, legendData) {

      if (!pickupCoords.length ) {
        this.$q.notify({
          type: 'warning',
          message: 'Coordenadas de embarque não encontradas.'
        });
        return;
      }

      this.showMapDialog = true;
      this.$q.dialog({
        component: AppMapRouter,
        componentProps: {
          show: true,
          title: 'Rota da Viagem: ' + this.selected[0].PROGRAMACAO_ID,
          pickupCoords: pickupCoords,
          desembCoords: desembCoords,
          dropoffCoords: dropoffCoords,
          routePoints: routePoints,
          passengers: passengers,
          legendData: legendData
        }
      })
    },
    requestGrid({ pagination, filter, search, saida}) {
      this.request({
        pagination,
        filter: this.filter,
        search: this.search,
        saida
      })
      .then(({data}) => {
        this.data = data.resultado || [];
        this.total = data.summary || {};
        this.serverPagination = pagination;
        this.serverPagination.rowsNumber = data.total;
        this.loading = false;
        this.setQtdViagens(data.qtd_viagens);
        this.setQuotaMensal(data.quota_mensal);
        this.$emitter.emit('crud:after-request', '');
      })
      .catch(error =>{
        this.loading = false;
      });
    },
    onBeforeRequest() {
      this.filter.STATUS = this.tab
    },
    onDblClickEdit(props){
      if(this.permitions.edit){
        props.selected = true;
        let id = props.row[this.grid.primaryKey];
        this.editOrView('view',id)
      }
    },
    notificar (id) {
      this.$api.get(`/programacao/notificar/${id}`)
      .then(({data}) => {
        if(data.success){
          this.$q.notify({
            message: `Mensagem enviada!`,
            icon: 'done',
            type: 'positive',
            color: 'positive'
          });
          this.requestGrid({
            pagination: this.serverPagination,
            filter: this.filter,
            search: this.search
          })
        }else {
          this.$q.notify({type: 'negative', message: data.msg})
        }
      })
    },
    editOrView(action, id) {
      let now = new Date()
      let antecedencia = this.config.ANTEC_EDITAR_CANCELAR > 0 ? this.config.ANTEC_EDITAR_CANCELAR : 120
      let tNow =  date.addToDate(now, { minutes: antecedencia }).getTime()
      let aD = this.selected[0].DATA_VIAGEM.split('/');
      let dataViagem = new Date(`${aD[2]}/${aD[1]}/${aD[0]} ${this.selected[0].HORA_VIAGEM}`);
      let tHoraViagem = dataViagem.getTime()

      if(tNow > tHoraViagem && action == 'edit'){
        this.$q.notify({
          type: 'negative',
          timeout: 5000,
          message: `Somente é permitido editar a viagem com a antecedência mínima de ${antecedencia} minutos da hora da viagem`
        })
      } else {
        this.$emitter.emit('crud:before-edit', '');
        let index= this.data.indexOf(this.selected[0]);
        if(!this.$q.platform.is.mobile || this.fk){
          this.$q.dialog({
            component: this.componentForm,
            componentProps: {
              ...this.form,
              method: action,
              fk: this.fk,
              id: id,
              options: this.options,
              parentRow: this.parentRow,
              persistent: true
            }
          }).onOk((rec) => {
             this.requestGrid({
                pagination: this.serverPagination,
                filter: this.filter,
                search: this.search
              })
          }).onCancel(() => {
          })
        }
        else {
          this.$router.push(`/${this.grid.path}/${id}/${action}`)
        }
      }
    },
    cancelarProg (id) {
      let now = new Date()
      let antecedencia = this.config.ANTEC_EDITAR_CANCELAR > 0 ? this.config.ANTEC_EDITAR_CANCELAR : 120
      let tNow =  date.addToDate(now, { minutes: antecedencia }).getTime()
      let aD = this.selected[0].DATA_VIAGEM.split('/');
      let dataViagem = new Date(`${aD[2]}/${aD[1]}/${aD[0]} ${this.selected[0].HORA_VIAGEM}`);
      let tHoraViagem = dataViagem.getTime()
      if(tNow > tHoraViagem){
        this.$q.notify({
          type: 'negative',
          timeout: 5000,
          message: `Somente é permitido cancelar a viagem com a antecedência mínima de ${antecedencia} minutos da hora da viagem`
        })
      } else {
        this.$q.dialog({
          title: 'Confirmação',
          message: 'Tem certeza que quer cancelar a programação?',
          ok: 'Sim',
          cancel: 'Não'
        })
        .onOk(() => {
          this.$api.get(`/programacao/cancelar/${id}`)
          .then(({data}) => {
            if(data.success){
              this.notificar(id)
              this.selected = []
              this.$q.notify({
                message: `A programação '${id}' foi cancelada!`,
                icon: 'done',
                type: 'positive',
                color: 'positive'
              })
              this.requestGrid({
                pagination: this.serverPagination,
                filter: this.filter,
                search: this.search
              })

            }else {
              this.$q.notify({type: 'negative', message: data.msg})
            }
          })
        })
      }
    },
    onSelection(det) {
      let reg = det.rows[0];
      if(reg.STATUS == 'I' || reg.STATUS == 'V' || reg.STATUS == 'A') {
        this.buttonsTopLeft[0].visible = true; //editar
        this.buttonsTopLeft[1].visible = false; //enviar
        this.buttonsTopLeft[2].visible = true; //cancelar
        this.buttonsTopLeft[3].visible = true; //ver
      } else {
        this.buttonsTopLeft[0].visible = false;
        this.buttonsTopLeft[1].visible = false;
        this.buttonsTopLeft[2].visible = false;
        this.buttonsTopLeft[3].visible = true;
      }
      if(this.config.USA_AUTORIZACAO === 'S' && this.tab == 'I') {
        this.buttonsTopLeft[4].visible = true;
      } else {
        this.buttonsTopLeft[4].visible = false;
      }
    },
    onAfterRequest() {
      this.selected = [];
     /* if(parseInt(this.quotaMensal) > 0) {
        if(parseInt(this.qtdViagens) < parseInt(this.quotaMensal)) {
          this.buttonsTopRight[0].visible = true;
        } else {
          this.buttonsTopRight[0].visible = false;
        }
      } else {
        this.buttonsTopRight[0].visible = true;
      }
        */
    },
    ...mapActions(useVwProgramacaoStore, ['setQtdViagens', 'setQuotaMensal'])
  },
  created () {
    this.grid.filter = this.grid.columns.map(item => item.field).reduce((acc, cur, i) => {
      acc[cur] = {}; return acc;}, {})
      if(this.filter.length == 0) {
        this.filter = clone(this.grid.filter);
      }
    },
    computed: {
     config(){
      return useAuthStore().config || {};
      },
      module () {
        return this.grid.table.toLowerCase()
      },
      moduleForm () {
        return this.form.table.toLowerCase()
      },
      ...mapWritableState(useVwProgramacaoStore, [ 'data', 'serverPagination', 'selected', 'filter', 'search' , 'qtdViagens', 'quotaMensal'])
    },
    unmouted () {
      this.$emitter.off('crud:before-request', this.onBeforeRequest);
      this.$emitter.off('crud:after-request', this.onAfterRequest);
    },
    mounted () {
      //this.buttonsTopRight[0].visible = false;
      this.tab = this.config.USA_AUTORIZACAO == 'S' ? 'I' : 'V';
      this.filter.STATUS = this.tab
      this.$emitter.on('crud:before-request', this.onBeforeRequest);
      this.$emitter.on('crud:after-request', this.onAfterRequest);
      this.componentForm = markRaw(VwProgramacaoFormDialog)
      this.formDialogProps = this.form
      //this.serverPagination.sortBy = 'DATA_VIAGEM'
      //this.serverPagination.descending = false
      this.requestGrid({
        pagination: this.serverPagination,
        filter: this.filter,
        search: this.search
      });
      /*this.getVwRoteiro (clienteId).then(({data}) => {
      this.options['NOME_ROTEIRO'] = data.resultado || [];
      this.options['ROTEIRO_VIA_ID3'] = data.resultado || [];
    });
    */
  }
})
</script>
