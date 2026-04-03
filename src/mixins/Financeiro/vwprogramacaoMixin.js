import { clone } from 'src/modules/utils'
import { useAuthStore } from 'stores/auth-store'
import { useDashboardStore } from 'stores/dashboard-store'
import { date } from 'quasar'

export const  vwprogramacaoMixin = {
  data: () => {
    return {
      options: {
        CLIENTE_ID: [],
        MOTIVO_ID: [],
        ROTEIRO_ID: [],
        ROTEIRO_VIA_ID3: [],
        ROTEIRO_VIA_ID4: [],
        PASSAGEIRO_ID: [],
        CR_CLIENTE_ID: [],
        LOCAL_ORIGEM: [
          {value: 'R', label: 'Residencia'},
          {value: 'F', label: 'Fabrica'},
          {value: 'O', label: 'Outro local'},
        ],
      },
      tabPreco: {},
      parEmpresa: {},
      showButton: {
        save: true,
        new: true,
      }
    }
  },
  methods: {
    create () {
      let today = new Date();
      let aD = this.form.DATA_VIAGEM.split('/');
      let dataViagem = new Date(`${aD[2]}/${aD[1]}/${aD[0]} ${this.form.HORA_VIAGEM}`);
      if(dataViagem.getTime() < today.getTime()){
        this.$q.notify({
          type: 'negative',
          message: 'Data e hora da viagem não podem ser retroativas'
        })
      } else {
        this.$api.post('/programacao', this.form)
        .then(({data}) => {
          if(data.success) {
            this.form['PROGRAMACAO_ID'] = data.resultado['PROGRAMACAO_ID']
            this.submit = true
            this.$emitter.emit('form:after-save', data.resultado)
            this.$emit('ok', data.resultado);
            this.formOld = clone(this.form);
            this.$q.notify({
              message:'Inserido com sucesso',
              type: 'positive',
            });
            this.disable = false;
          }
          else {
            this.$q.notify({type: 'negative', message: data.msg})
          }
        })
      }
    },
    disableField (campo) {
    },
    visibleVia(bol){
      this.aFields[0].fields[8].visible = bol;
      this.aFields[0].fields[9].visible = bol;
    },
    visibleChamado(bol){
      this.aFields[0].fields[5].visible = bol;
    },
    visibleRoteiro(bol){
      this.aFields[0].fields[6].visible = bol;
    },
    visibleMotivo(bol){
      this.aFields[0].fields[7].visible = bol;
    },
    notificar (id) {
      this.$api.get(`/programacao/notificar/${id}`)
      .then(({data}) => {
        if(data.success){
          this.$emit('ok', data.resultado);
          this.$q.notify({
            type: 'positive',
            message: `Mensagem enviada!`,
          });
        }else {
          this.$q.notify({type: 'negative', message: data.msg})
        }
      })
    },
    onBeforeSave(form){
      form.STATUS = 'I'
    },
    onAfterSave(row){
      let cooperativa = useDashboardStore().cooperativa
      let id = row[this.primaryKey];
      if(row.STATUS == 'I'){
        if(this.$q.platform.is.mobile){
          this.notificar(id)
        } else {
          this.$q.dialog({
            title: 'Confirmação',
            message: `Enviar a solicitação ${id} para a ${cooperativa}?`,
            ok: 'Sim',
            cancel: 'Não'
          })
          .onOk(() => {
            this.notificar(id)
          })
        }
      }
    },
    showGrid(){
      return true
    },
    formInput(field, val){
      if (field == 'LOCAL_ORIGEM'){
        switch (this.form.LOCAL_ORIGEM) {
          case 'F': this.form.LOCAL_DESTINO = 'R'; break;
          case 'R': this.form.LOCAL_DESTINO = 'F'; break;
          case 'O': this.form.LOCAL_DESTINO = 'O'; break;
        }
      }
    },
    formBlur(field){
      if(field == 'QTD_PASSAGEIRO'){
        this.buildRowsNew()
      }
    },
    buildRowsNew(){
      var i;
      let rows = this.form.items[0].rows;
      if(this.form.QTD_PASSAGEIRO > 0){
        let qtd = this.form.QTD_PASSAGEIRO - rows.length
        for (i = 0; i < qtd; i++) {
          rows.push({
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
          })
        };
      }
    },
  },
  computed: {
    showGridItems () {
      return true
    },
    readonly () {
      return this.method == 'view' ? true : false
    },
    user () {
      return useAuthStore().user
    }
  },
  mounted () {
    this.form.SOLICITANTE = this.user.login
    this.form.DATA_VIAGEM = date.formatDate(new Date(), 'DD/MM/YYYY');
    this.getEmpresa().then(({data}) => {
      this.parEmpresa = data.resultado
      if(this.parEmpresa.USA_CHAMADO == 'S'){
        this.visibleChamado(true)
      } else {
        this.visibleChamado(false)
      }
      if(this.parEmpresa.USA_ROTEIRO == 'S'){
        this.visibleRoteiro(true)
      } else {
        this.visibleRoteiro(false)
      }
      if(this.parEmpresa.USA_MOTIVO == 'S'){
        this.visibleMotivo(true)
      } else {
        this.visibleMotivo(false)
      }
    });
    //this.form.CLIENTE_ID = clienteId;
    this.form.QTD_PASSAGEIRO = '1';
    this.options.LOCAL_DESTINO = this.options.LOCAL_ORIGEM;

    this.getPassageiro().then(({data}) => {
      this.options['PASSAGEIRO_ID'] = data.resultado || [];
    })
    this.getCentroCusto().then(({data}) => {
      this.options['CR_CLIENTE_ID'] = data.resultado || [];
    })
    this.getMotivo().then(({data}) => {
      this.options['MOTIVO_ID'] = data.resultado || [];
    })

  this.getClienteVoucher().then(({data}) => {
    this.options['ROTEIRO_ID'] = data.resultado.roteiros || [];
    this.options['ROTEIRO_VIA_ID3'] = data.resultado.roteiros || [];
    this.options['ROTEIRO_VIA_ID4'] = data.resultado.roteiros || [];
    //this.options['MOTIVO_ID'] = data.resultado.motivos || [];
    //this.options['PASSAGEIRO_ID'] = data.resultado.passageiros || [];
    //this.options['CR_CLIENTE_ID'] = data.resultado.cr_cliente || [];
    this.tabPreco = data.resultado.tabela_preco;
    if(this.tabPreco.PERC_ADIC_VIA > 0){
      this.visibleVia(true)
    } else {
      this.visibleVia(false)
    }
  });

  if(this.method != 'new') {
    this.getRecord()
    .then(({data}) => {
      this.form = data.resultado || [];
      this.formOld = clone(this.form);
    })
    .catch(error => {
    })
  }
}
}
