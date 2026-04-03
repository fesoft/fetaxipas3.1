import { storage } from 'src/modules/utils'

export const vwprogliberadaMixin = {
  data: () => {
    return {
      options: {
        CLIENTE_ID: [],
        COOPERADO_ID: [],
        MOTIVO_ID: [],
        ROTEIRO_ID: [],
        ROTEIRO_VIA_ID3: [],
        ROTEIRO_VIA_ID4: [],
        PASSAGEIRO_ID: [],
        CR_CLIENTE_ID: [],
        FILA_TIPO_ID: [],
        STATUS: [
          {value: 'L', label: 'LIBERADA'},
          {value: 'E', label: 'ENCERRADA'},
          {value: 'C', label: 'CANCELADA'}
        ],
      },
      form: {
        STATUS: '',
        items: [{rows: [], summary: {},},{rows: [], summary: {},}]
      },
      showButton: {
        save: true,
        new: true,
      },
      tabPreco: {},
      campos: [
        'VALOR',
        'VALOR_ADIC_VIA3',
        'VALOR_ADIC_VIA4',
        'VALOR_ADIC_RETORNO',
        'VALOR_ADIC_5',
        'VALOR_ADIC_6',
        'VALOR_ADIC_AR',
        'VALOR_PEDAGIO',
        'VALOR_HORAS_PARADAS',
        'VALOR_ESTACIONAMENTO',
        'VALOR_ADIC_OUTROS',
        'VALOR_KM_RODADO',
      ],
    }
  },
  methods: {
    visibleVia(bol){
      this.aFields[0].fields[13].visible = bol;
      this.aFields[0].fields[14].visible = bol;
      this.aFields[0].fields[15].visible = bol;
      this.aFields[0].fields[16].visible = bol;
    },
    visibleRoteiroExtremo(bol){
      this.aFields[0].fields[17].visible = bol;
      this.aFields[0].fields[18].visible = bol;
    },
    visibleOutroDistrito(bol){
      this.aFields[0].fields[19].visible = bol;
      this.aFields[0].fields[20].visible = bol;
    },
    visibleRetorno(bol){
      this.aFields[0].fields[21].visible = bol;
      this.aFields[0].fields[22].visible = bol;
    },
    visibleAr(bol){
      this.aFields[0].fields[23].visible = bol;
      this.aFields[0].fields[24].visible = bol;
    },
    visibleKm(bol){
      this.aFields[0].fields[25].visible = bol;
      this.aFields[0].fields[26].visible = bol;
    },
    mudaCliente(){
      this.campos.forEach((campo, i) => {
        this.form[campo] = 0;
      });
    },
    disableValor() {
      let rot = this.options['ROTEIRO_ID'].filter(row => row.value == this.form.ROTEIRO_ID);
      if(rot.length > 0){
        return rot[0].VALOR == 0 || rot[0].VALOR == '' ? false : true;
      } else {
        return true
      }
    },
    disableField(field){
      if(this.currentClient){
        switch (field) {
          //case 'VALOR': return this.disableValor(); break;
          case 'VALOR_MOTORISTA': return this.config.LOCADORA == 'S' ? false : true; break;
          case 'VALOR_PEDAGIO': return this.currentClient.USA_PEDAGIO == 'S' ? false : true; break;
          case 'VALOR_PEDAGIO2': return this.currentClient.USA_PEDAGIO2 == 'S' ? false : true; break;
          case 'QTD_PASSE_PEDAGIO': return this.currentClient.USA_PEDAGIO2 == 'S' ? false : true; break;
          case 'VALOR_MOTIVO': return this.currentClient.USA_MOTIVO == 'S' ? false : true; break;
          case 'VALOR_ESTACIONAMENTO': return this.currentClient.USA_ESTACIONAMENTO == 'S' ? false : true; break;
          case 'SOLICITANTE': return this.currentClient.USA_SOLICITANTE == 'S' ? false : true; break;
          //case 'DATA_VIAGEM': return this.currentClient.USA_DATA2 == 'S' ? false : true; break;
          case 'UNIDADE': return this.currentClient.USA_UNIDADE == 'S' ? false : true; break;
          case 'COD_INTERNO': return this.currentClient.COD_INTERNO_OBRIGATORIO == 'S' ? false : true; break;
          default: return false;
        }
      }
    },
    formInput(field, val){
      if(field == 'CLIENTE_ID') {
        let clienteId = val;
        if(clienteId > 0){
          if(this.formOld.CLIENTE_ID > 0){
            if(this.form.CLIENTE_ID !== this.formOld.CLIENTE_ID)
            this.mudaCliente()
          };
          this.getClienteVoucher(clienteId)
          .then(({data}) => {
            this.options['ROTEIRO_ID'] = data.resultado.roteiros || [];
            this.options['ROTEIRO_VIA_ID3'] = data.resultado.roteiros || [];
            this.options['ROTEIRO_VIA_ID4'] = data.resultado.roteiros || [];
            this.options['MOTIVO_ID'] = data.resultado.motivos || [];
            this.options['PASSAGEIRO_ID'] =  data.resultado.passageiros || [];
            this.options['CR_CLIENTE_ID'] =  data.resultado.cr_cliente || [];
            this.tabPreco = data.resultado.tabela_preco;
            if(this.tabPreco.VALOR_KM_RODADO > 0){
              this.visibleKm(true);
            } else {
              this.visibleKm(false);
            }
            if(this.tabPreco.PERC_ADIC_VIA > 0){
              this.visibleVia(true)
            } else {
              this.visibleVia(false)
            }
            if(this.tabPreco.PERC_ADIC_AR > 0){
              this.visibleAr(true)
            } else {
              this.visibleAr(false)
            }
            if(this.tabPreco.PERC_ADIC_5 > 0){
              this.visibleRoteiroExtremo(true)
            } else {
              this.visibleRoteiroExtremo(false)
            }
            if(this.tabPreco.PERC_ADIC_6 > 0){
              this.visibleOutroDistrito(true)
            } else {
              this.visibleOutroDistrito(false)
            }
            if(this.currentClient.USA_MOTIVO == 'S'){
              this.aFields[0].fields[27].required = true;
              this.aFields[0].fields[27].disable = false;
            } else {
              this.aFields[0].fields[27].required = false
              this.aFields[0].fields[27].disable = true;
            }
          });
        }
        this.form.ROTEIRO_ID = null;
        this.form.ROTEIRO_VIA_ID3 = null;
        this.form.ROTEIRO_VIA_ID4 = null;
        this.form.MOTIVO_ID = null;
      } else if(field == 'ROTEIRO_ID') {
        this.calcValor()
      } else if(field == 'ROTEIRO_VIA_ID3') {
        this.calcAdicVia3()
      } else if(field == 'ROTEIRO_VIA_ID4') {
        this.calcAdicVia4()
      } else if(field == 'ROTEIRO_EXTREMO') {
        this.calcAdicRoteiroExtremo()
      } else if(field == 'ADIC_6') {
        this.calcAdicOutroDistrito()
      } else if(field == 'RETORNO') {
        this.calcAdicRetorno()
      }else if(field == 'NUM_HORAS_PARADAS') {
        this.calcValorHorasParadas()
      } else if(field == 'AR') {
        this.calcAdicAr()
      } else if(field == 'KM_RODADO') {
        this.calcValorKmRodado()
      }
      this.calcTotal();
    },
    calcValor() {
      let rot = this.options['ROTEIRO_ID'].filter(row => row.value == this.form.ROTEIRO_ID);
      if(rot.length > 0){
        this.form.VALOR =  rot[0].VALOR ? rot[0].VALOR : 0;
        this.form.VALOR_MOTORISTA =  rot[0].VALOR_MOTORISTA ? rot[0].VALOR_MOTORISTA : 0;
      } else {
        this.form.VALOR = 0;
        this.form.VALOR_MOTORISTA = 0;
      }
    },
    calcValorVia(fieldRoteio,fieldvalor) {
      let rot = _.filter(this.options[fieldRoteio], {'value': this.form[fieldRoteio]});
      if(rot.length > 0){
        this.form[fieldvalor] =  rot[0].VALOR ? rot[0].VALOR : 0;
      } else {
        this.form[fieldvalor] = 0;
      }
      return parseFloat(this.form[fieldvalor]);
    },
    calcAdicVia3() {
      let rot = this.options['ROTEIRO_ID'].filter(row => row.value == this.form.ROTEIRO_VIA_ID3);
      this.form.VALOR_ADIC_VIA3 = rot.length > 0 ? rot[0].VALOR_ADIC_VIA : 0;
    },
    calcAdicVia4() {
      let rot = this.options['ROTEIRO_ID'].filter(row => row.value == this.form.ROTEIRO_VIA_ID4);
      this.form.VALOR_ADIC_VIA4 = rot.length > 0 ? rot[0].VALOR_ADIC_VIA : 0;
    },
    calcAdicRoteiroExtremo() {
      this.form.VALOR_ADIC_5 = this.form.ROTEIRO_EXTREMO == 'S' ?
      parseFloat(this.form.VALOR) * parseFloat(this.tabPreco.PERC_ADIC_5) / 100 : 0;

    },
    calcAdicOutroDistrito() {
      this.form.VALOR_ADIC_6 = this.form.ADIC_6 == 'S' ?
      parseFloat(this.form.VALOR) * parseFloat(this.tabPreco.PERC_ADIC_6) / 100 : 0;

    },
    calcAdicRetorno() {
      this.form.VALOR_ADIC_RETORNO =
      (this.form.RETORNO == 'S' && this.tabPreco.PERC_ADIC_RETORNO > 0) ?
      parseFloat(this.form.VALOR) * parseFloat(this.tabPreco.PERC_ADIC_RETORNO) / 100 : 0;
      return this.form.VALOR_ADIC_RETORNO > 0 ? this.form.VALOR_ADIC_RETORNO : 0
    },
    calcValorHorasParadas() {
      this.form.VALOR_HORAS_PARADAS = this.form.NUM_HORAS_PARADAS > 0 ?
      parseFloat(this.form.NUM_HORAS_PARADAS) * parseFloat(this.tabPreco.VALOR_HORA_PARADA) : 0;
    },
    calcValorKmRodado() {
      this.form.VALOR_KM_RODADO = this.form.KM_RODADO > 0 ?
      parseFloat(this.form.KM_RODADO) * parseFloat(this.tabPreco.VALOR_KM_RODADO) : 0;
      if(this.tabPreco.ROTEIRO_KM > 0 && this.form.KM_RODADO > 0){
        this.form.ROTEIRO_ID = this.tabPreco.ROTEIRO_KM;
        this.calcValor();
      }
    },
    calcAdicAr() {
      if(!this.form.VALOR_ADIC_VIA3) this.form.VALOR_ADIC_VIA3 = 0;
      if(!this.form.VALOR_KM_RODADO) this.form.VALOR_KM_RODADO = 0;
      this.form.VALOR_ADIC_AR = this.form.AR == 'S' ?
      (
        (parseFloat(this.form.VALOR) +
        parseFloat(this.form.VALOR_ADIC_VIA3) +
        parseFloat(this.form.VALOR_KM_RODADO)
      ) *
      this.tabPreco.PERC_ADIC_AR / 100) : 0;
    },
    calcTotal(){
      var total = 0;
      this.campos.forEach((item, i) => {
        let val = String(this.form[item]);
        val = val.replace('','0');
        val = val.replace(',','.');
        //if(!(this.form[item] == '' || this.form[item] == '0,00')){
        total = total + parseFloat(val);
        //}
      });
      this.form.TOTAL = total;
    },
    onBeforeUpdate(form) {

    },
    onAfterUpdate(form) {
     if(form.STATUS == 'E'){
       //this.enviarMsgProgEncerrada(form.PROGRAMACAO_ID)
     }
    },
    enviarMsgProgEncerrada (id) {
      this.$api.get(`/programacao/notificar_encerramento/${id}`)
      .then(({data}) => {
        if(data.success){
          this.$q.notify({
            message: `Mensagem enviada!`,
            icon: 'done',
            type: 'positive',
            color: 'positive'
          })
        }else {
          this.$q.notify({type: 'negative', message: data.msg})
        }
      })
    },
    finalizarProg(){
      if(this.form.PROGRAMACAO_ID){
        this.form.STATUS = 'E';
        this.update();
      }
    },
    formBlur(field){
      if(field == 'QTD_PASSAGEIRO'){
        this.buildRowsNew()
      }
    },
    buildRowsNew () {
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
    currentClient() {
      return this.options['CLIENTE_ID'].length == 0 ? {} :
      this.options['CLIENTE_ID']
      .filter(row => row.value == this.form.CLIENTE_ID)[0]
    },
    config(){
      return storage.getItem('fp_config');
    }
  },
  mounted () {
    if(this.method != 'new') {
      this.getRecord()
      .then(({data}) => {
        this.form = data.resultado || [];
        let clienteId = this.form.CLIENTE_ID;
        if(clienteId > 0){
          this.getClienteVoucher(clienteId)
          .then(({data}) => {
            this.options['ROTEIRO_ID'] = data.resultado.roteiros || [];
            this.options['ROTEIRO_VIA_ID3'] = data.resultado.roteiros || [];
            this.options['ROTEIRO_VIA_ID4'] = data.resultado.roteiros || [];
            this.options['MOTIVO_ID'] = data.resultado.motivos || [];
            this.options['PASSAGEIRO_ID'] =  data.resultado.passageiros || [];
            this.options['CR_CLIENTE_ID'] =  data.resultado.cr_cliente || [];
            this.tabPreco = data.resultado.tabela_preco || {};
            //if (!this.form.VALOR)
            this.calcValor();
            //if (!this.form.VALOR_ADIC_VIA3)
            this.calcAdicVia3();
            //if (!this.form.VALOR_ADIC_VIA4)
            this.calcAdicVia4();
            //if (!this.form.VALOR_ADIC_5)
            this.calcAdicRoteiroExtremo();
            //if (!this.form.VALOR_ADIC_6)
            this.calcAdicOutroDistrito();
            //if (!this.form.VALOR_HORAS_PARADAS)
            this.calcValorHorasParadas();
            //if (!this.form.VALOR_ADIC_AR)
            this.calcAdicAr();
            //if (!this.form.VALOR_ADIC_RETORNO)
            this.calcAdicRetorno();
            //if (!this.form.VALOR_KM_RODADO)
            this.calcValorKmRodado();
            this.calcTotal();
            if(this.tabPreco.VALOR_KM_RODADO > 0){
              this.visibleKm(true);
            } else {
              this.visibleKm(false);
            }
            if(this.tabPreco.PERC_ADIC_VIA > 0){
              this.visibleVia(true)
            } else {
              this.visibleVia(false)
            }
            if(this.tabPreco.PERC_ADIC_AR > 0){
              this.visibleAr(true)
            } else {
              this.visibleAr(false)
            }
            if(this.tabPreco.PERC_ADIC_5 > 0){
              this.visibleRoteiroExtremo(true)
            } else {
              this.visibleRoteiroExtremo(false)
            }
            if(this.tabPreco.PERC_ADIC_6 > 0){
              this.visibleOutroDistrito(true)
            } else {
              this.visibleOutroDistrito(false)
            }
            if(this.tabPreco.PERC_ADIC_RETORNO > 0){
              this.visibleRetorno(true)
            } else {
              this.visibleRetorno(false)
            }
            if(this.currentClient.USA_MOTIVO == 'S'){
              this.aFields[0].fields[27].required = true;
              this.aFields[0].fields[27].disable = false;
            } else {
              this.aFields[0].fields[27].required = false
              this.aFields[0].fields[27].disable = true;
            }
          });
        }
        this.formOld = clone(this.form);
      })
      .catch(error => {
      })
    }
    this.getCliente()
    .then(({data}) => {
      this.options['CLIENTE_ID'] = data.resultado || []
    });
    this.getCooperado()
    .then(({data}) => {
      this.options['COOPERADO_ID'] = data.resultado || []
    });
  }
}
