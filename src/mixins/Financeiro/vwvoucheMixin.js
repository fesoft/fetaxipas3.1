import { storage, clone, str_pad } from 'src/modules/utils'
import { vwvouche } from 'src/models/Financeiro/vwvouche'
import { _ } from 'lodash'

export const  vwvoucheMixin = {
  data: () => {
    return {
      numeroVoucher: '',
      tabPreco: {},
      tabelaPrecoIdOld: undefined,
      camposMot: [
        'VALOR_MOTORISTA',
        'VMOT_ADIC_AR',
        'VMOT_KM_RODADO',
        'VMOT_PEDAGIO',
        'VMOT_ADIC_RETORNO',
        'VMOT_HORAS_PARADAS',
        'VMOT_ESTACIONAMENTO',
        'VMOT_ADIC_DESLOC',
        'VMOT_ADIC_VIA3',
        'VMOT_ADIC_VIA4',
        'VMOT_ADIC_5',
        'VMOT_ADIC_6'
      ],
      campos: [
        'VALOR',
        'VALOR_ADIC_AR',
        'VALOR_KM_RODADO',
        'VALOR_PEDAGIO',
        'VALOR_ADIC_RETORNO',
        'VALOR_HORAS_PARADAS',
        'VALOR_ESTACIONAMENTO',
        'VALOR_ADIC_DESLOC',
        'VALOR_ADIC_VIA',
        'VALOR_ADIC_VIA2',
        'VALOR_ADIC_VIA3',
        'VALOR_ADIC_VIA4',
        'VALOR_ADIC_5',
        'VALOR_ADIC_6'

      ],
      campos2: [
        'ROTEIRO_ID',
        'ROTEIRO_VIA_ID',
        'ROTEIRO_VIA_ID2',
        'ROTEIRO_VIA_ID3',
        'ROTEIRO_VIA_ID4',
        'MOTIVO_ID',
        'SOLICITANTE',
        'COD_INTERNO',
        'DATA',
        'DATA_VIAGEM',
        'RETORNO',
        'AR',
        'ADIC_5',
        'ADIC_6',

      ],
      campos3: [
        'QTD_PASSE_PEDAGIO',
        'QTD_PASSE_PEDAGIO3',
        'KM_RODADO',
        'NUM_HORAS_PARADAS'
      ],
      options: {
        CLIENTE_ID: [],
        COOPERADO_ID: [],
        MOTIVO_ID: [],
        ROTEIRO_ID: [],
        ROTEIRO_VIA_ID3: [],
        ROTEIRO_VIA_ID4: [],
        PASSAGEIRO_ID: [],
        CR_CLIENTE_ID: []
      },
    }
  },
  methods: {
    formInput(field, val) {
      switch (field) {
        case 'CLIENTE_ID':
        let clienteId = val;
        if(clienteId){

          /*if(this.formOld.CLIENTE_ID > 0 ){
            if(this.form.CLIENTE_ID !== this.formOld.CLIENTE_ID)
            this.mudaCliente()
          };
          */
          this.getClienteVoucher(clienteId).then(({data}) => {
            this.options['ROTEIRO_ID'] = data.resultado.roteiros || [];
            this.options['ROTEIRO_VIA_ID'] = data.resultado.roteiros_via || [];
            this.options['ROTEIRO_VIA_ID2'] = data.resultado.roteiros_via || [];
            this.options['ROTEIRO_VIA_ID3'] = data.resultado.roteiros || [];
            this.options['ROTEIRO_VIA_ID4'] = data.resultado.roteiros || [];
            this.options['MOTIVO_ID'] = data.resultado.motivos || [];
            this.options['PASSAGEIRO_ID'] = data.resultado.passageiros || [];
            this.options['CR_CLIENTE_ID'] =  data.resultado.cr_cliente || [];
            this.tabPreco = data.resultado.tabela_preco || {};
            if(data.resultado.roteiros_via.length > 0){
              this.visibleViaKm(true);
            } else {
              this.visibleViaKm(false);
            }
            if(this.tabPreco.PERC_ADIC_VIA > 0){
              this.visibleVia(true)
            } else {
              this.visibleVia(false)
            }
            if(this.tabPreco.PERC_ADIC_RETORNO > 0){
              this.visibleRetorno(true)
            } else {
              this.visibleRetorno(false)
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
            if(this.tabPreco.VALOR_KM_RODADO > 0){
              this.visibleKm(true)
            } else {
              this.visibleKm(false)
            }
            if(this.currentClient.USA_PEDAGIO2 == 'S'){
              this.visiblePedagio2(true)
            } else {
              this.visiblePedagio2(false)
            }
            if(this.config.LOCADORA == 'S'){
              this.usaMotivo(37)
            } else {
              this.usaMotivo(31)
            }

            this.form.TABELA_PRECO_ID = this.tabPreco.TABELA_PRECO
            if(this.tabelaPrecoIdOld !== undefined){
              if(this.form.TABELA_PRECO_ID !== this.tabelaPrecoIdOld) this.mudaCliente()
            }
          });
        }
        break;
        case 'ROTEIRO_ID': this.calcValor(); break;
        case 'ROTEIRO_VIA_ID': this.calcAdicVia(field,'VALOR_ADIC_VIA'); break;
        case 'ROTEIRO_VIA_ID2': this.calcAdicVia(field,'VALOR_ADIC_VIA2'); break;
        case 'ROTEIRO_VIA_ID3': this.calcAdicVia3(); break;
        case 'ROTEIRO_VIA_ID4': this.calcAdicVia4(); break;
        case 'RETORNO': this.calcAdicRetorno(); break;
        case 'ADIC_5': this.calcAdicRoteiroExtremo(); break;
        case 'ADIC_6': this.calcAdicOutroDistrito(); break;
        case 'NUM_HORAS_PARADAS': this.calcAdicHorasParadas(); break;
        case 'COOPERADO_ID': this.calcAdicHorasParadas(); break;
        case 'AR': this.calcAdicAr(); break;
        case 'KM_RODADO': this.calcAdicKm(); break;
        default:
      }
      this.calcTotal();
      if(this.config.LOCADORA == 'S') {
        if(!this.camposMot.includes(field)) this.calcAdicMot();
        this.calcTotalMot();
      }
    },
    visibleViaKm(bol){
      if(this.config.LOCADORA == 'S'){

      } else {
        this.aFields[0].fields[13].visible = bol;
        this.aFields[0].fields[14].visible = bol;
        this.aFields[0].fields[15].visible = bol;
        this.aFields[0].fields[16].visible = bol;
      }
    },
    visibleVia(bol){
      if(this.config.LOCADORA == 'S'){
        this.aFields[0].fields[13].visible = bol;
        this.aFields[0].fields[14].visible = bol;
        this.aFields[0].fields[15].visible = bol;

        this.aFields[0].fields[16].visible = bol;
        this.aFields[0].fields[17].visible = bol;
        this.aFields[0].fields[18].visible = bol;
      } else {
        this.aFields[0].fields[17].visible = bol;
        this.aFields[0].fields[18].visible = bol;
        this.aFields[0].fields[19].visible = bol;
        this.aFields[0].fields[20].visible = bol;
      }
    },
    visibleRetorno(bol){
      if(this.config.LOCADORA == 'S'){
        this.aFields[0].fields[19].visible = bol;
        this.aFields[0].fields[20].visible = bol;
        this.aFields[0].fields[21].visible = bol;
      } else {
        this.aFields[0].fields[21].visible = bol;
        this.aFields[0].fields[22].visible = bol;
      }
    },
    visibleAr(bol){
      if(this.config.LOCADORA == 'S'){
        this.aFields[0].fields[22].visible = bol;
        this.aFields[0].fields[23].visible = bol;
        this.aFields[0].fields[24].visible = bol;
      } else {
        this.aFields[0].fields[23].visible = bol;
        this.aFields[0].fields[24].visible = bol;
      }
    },
    visibleRoteiroExtremo(bol){
      if(this.config.LOCADORA == 'S'){
        this.aFields[0].fields[25].visible = bol;
        this.aFields[0].fields[26].visible = bol;
        this.aFields[0].fields[27].visible = bol;
      } else {
        this.aFields[0].fields[25].visible = bol;
        this.aFields[0].fields[26].visible = bol;
      }
    },
    visibleOutroDistrito(bol){
      if(this.config.LOCADORA == 'S'){
        this.aFields[0].fields[28].visible = bol;
        this.aFields[0].fields[29].visible = bol;
        this.aFields[0].fields[30].visible = bol;
      } else {
        this.aFields[0].fields[27].visible = bol;
        this.aFields[0].fields[28].visible = bol;
      }
    },
    visibleKm(bol){
      if(this.config.LOCADORA == 'S'){
        this.aFields[0].fields[31].visible = bol;
        this.aFields[0].fields[32].visible = bol;
        this.aFields[0].fields[33].visible = bol;
      } else {
        this.aFields[0].fields[29].visible = bol;
        this.aFields[0].fields[30].visible = bol;
      }
    },
    usaMotivo(idxField){
      if(this.currentClient.USA_MOTIVO == 'S'){
        this.aFields[0].fields[idxField].required = true;
        this.aFields[0].fields[idxField].disable = false;
      } else {
        this.aFields[0].fields[idxField].required = false
        this.aFields[0].fields[idxField].disable = true;
      }
    },
    visiblePedagio2(bol){
      if(this.config.LOCADORA == 'S'){
        //
      } else {
        this.aFields[0].fields[40].visible = bol;
        this.aFields[0].fields[41].visible = bol;
        this.aFields[0].fields[42].visible = bol;
        this.aFields[0].fields[43].visible = bol;
      }
    },
    disableValor() {
      let rot = this.options['ROTEIRO_ID'].filter(row => row.value == this.form.ROTEIRO_ID);
      if(rot.length > 0){
        return rot[0].VALOR == 0 || rot[0].VALOR == '' ? false : true;
      } else {
        return true
      }
    },
    /*disableField(field){
      if(this.currentClient){
        switch (field) {
          case 'VALOR': return this.disableValor(); break;
          case 'VALOR_MOTORISTA': return this.config.LOCADORA == 'S' ? false : true; break;
          case 'VALOR_PEDAGIO': return this.currentClient.USA_PEDAGIO == 'S' ? false : true; break;
          case 'VMOT_PEDAGIO': return this.currentClient.USA_PEDAGIO == 'S' ? false : true; break;
          case 'VALOR_PEDAGIO2': return this.currentClient.USA_PEDAGIO2 == 'S' ? false : true; break;
          case 'QTD_PASSE_PEDAGIO': return this.currentClient.USA_PEDAGIO2 == 'S' ? false : true; break;
          case 'VALOR_MOTIVO': return this.currentClient.USA_MOTIVO == 'S' ? false : true; break;
          case 'VALOR_ESTACIONAMENTO': return this.currentClient.USA_ESTACIONAMENTO == 'S' ? false : true; break;
          case 'VMOT_ESTACIONAMENTO': return this.currentClient.USA_ESTACIONAMENTO == 'S' ? false : true; break;
          case 'SOLICITANTE': return this.currentClient.USA_SOLICITANTE == 'S' ? false : true; break;
          case 'DATA': return this.currentClient.USA_DATA2 == 'S' ? false : true; break;
          case 'UNIDADE': return this.currentClient.USA_UNIDADE == 'S' ? false : true; break;
          case 'COD_INTERNO': return this.currentClient.COD_INTERNO_OBRIGATORIO == 'S' ? false : true; break;
          default: return false;
        }
      }
    },
    */
    calcValor() {
      let rot = this.options['ROTEIRO_ID'].filter(row => row.value == this.form.ROTEIRO_ID);
      if(rot.length > 0 && rot[0].VALOR > 0){
        this.form.VALOR =  rot[0].VALOR;
        if(!this.form.VALOR_MOTORISTA)
        this.form.VALOR_MOTORISTA =  rot[0].VALOR_MOTORISTA ? parseFloat(rot[0].VALOR_MOTORISTA) : 0;
      }
      this.calcAdicAr();
      this.calcAdicRoteiroExtremo();
      this.calcAdicOutroDistrito();
      this.calcAdicRetorno();
    },
    calcAdicVia(fieldRoteio,fieldvalor) {
      let rot = this.options[fieldRoteio].filter(row => row.value == this.form[fieldRoteio]);
      if(rot.length > 0){
        this.form[fieldvalor] =  rot[0].VALOR ? rot[0].VALOR : 0;
      } else {
        this.form[fieldvalor] = 0;
      }
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
      this.form.VALOR_ADIC_5 = this.form.ADIC_5 == 'S' ?
      parseFloat(this.form.VALOR) * parseFloat(this.tabPreco.PERC_ADIC_5) / 100 : 0;

    },
    calcAdicOutroDistrito() {
      this.form.VALOR_ADIC_6 = this.form.ADIC_6 == 'S' ?
      parseFloat(this.form.VALOR) * parseFloat(this.tabPreco.PERC_ADIC_6) / 100 : 0;

    },
    calcAdicHorasParadas() {
      let mot = this.options['COOPERADO_ID'].filter(row => row.value == this.form.COOPERADO_ID);
      let valor_hora = (mot[0].VEICULO_TIPO == 'M') ? this.tabPreco.VALOR_HORA_PARADA_MOTO : this.tabPreco.VALOR_HORA_PARADA;
      this.form.VALOR_HORAS_PARADAS = this.form.NUM_HORAS_PARADAS > 0 ? parseFloat(this.form.NUM_HORAS_PARADAS) * parseFloat(valor_hora) : 0;
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
    calcAdicKm() {
      this.form.VALOR_KM_RODADO = this.form.KM_RODADO > 0 ?
      parseFloat(this.form.KM_RODADO) * parseFloat(this.tabPreco.VALOR_KM_RODADO) : 0;
    },
    calcAdicRetorno() {
      this.form.VALOR_ADIC_RETORNO =
      (this.form.RETORNO == 'S' && this.tabPreco.PERC_ADIC_RETORNO > 0) ?
      parseFloat(this.form.VALOR) * parseFloat(this.tabPreco.PERC_ADIC_RETORNO) / 100 : 0;
    },
    calcTotal(){
      var total = 0;
      this.campos.forEach((item, i) => {
        let val = String(this.form[item]);
        val = val.replace('','0');
        val = val.replace(',','.');
        total = total + parseFloat(val);
      });
      this.form.TOTAL = total;
    },
    calcAdicMot(){
      var total = 0;
      let perc = parseFloat(this.config.MOT_PERCENTUAL);
      if(perc > 0){
        this.camposMot.forEach((item, i) => {
          if(item !== 'VALOR_MOTORISTA'){
            let field = item.replace('VMOT_', 'VALOR_');
            let val = String(this.form[field]);
            val = val.replace('','0');
            val = val.replace(',','.');
            val = parseFloat(val);
            let v = val > 0 ? val - (val * perc/100) : 0;
            this.form[item] = v.toFixed(2);
          }
        })
      }
      this.form.VMOT_PEDAGIO = this.form.VALOR_PEDAGIO;
      this.form.VMOT_ESTACIONAMENTO = this.form.VALOR_ESTACIONAMENTO;
    },
    calcTotalMot(){
      var total = 0;
      this.camposMot.forEach((item, i) => {
        let val = String(this.form[item]);
        val = val.replace('','0');
        val = val.replace(',','.');
        total = total + parseFloat(val);
      });
      this.form.VMOT_TOTAL = total;
    },
    formBlur(field){
      switch (field) {
        case 'QTD_PASSAGEIROS': this.buildRowsNew(); break;
        case 'NUMERO': this.voucherExiste(false); break;
        case 'DATA_VIAGEM': this.$nextTick(() => this.copiaData()); break;
        default:
      }
    },
    copiaData(){
      let dia_inicio_fatura  = this.currentClient.DIA_INICIO_FATURA;
      let d = this.form.DATA_VIAGEM.split('/');
      let dia = Number(d[0])
      let mes = Number(d[1])
      let ano = Number(d[2])

      if (dia_inicio_fatura > 1) {
      if (dia >= dia_inicio_fatura) {
          dia = 1;
        if (mes < 12){
            mes = mes + 1;
        } else {
          mes = 1;
          ano = ano + 1;
        }

        this.form.DATA = `${str_pad(dia,2,'0', 'STR_PAD_LEFT')}/${str_pad(mes,2,'0', 'STR_PAD_LEFT')}/${ano}`;
      } else {
        this.form.DATA = this.form.DATA_VIAGEM;
      }
    } else {
      this.form.DATA = this.form.DATA_VIAGEM;
    }
    },
    buildRowsNew(){
      var i;
      let rows = this.form.items[0].rows;
      if(this.form.QTD_PASSAGEIROS > 0){
        let qtd = this.form.QTD_PASSAGEIROS - rows.length
        for (i = 0; i < qtd; i++) {
          rows.push({
            VOUCHER_CR_ID: `_index${i}`,
            VOUCHE_ID: '',
            PASSAGEIRO_ID: '',
            PASSAGEIRO: '',
            CR_CLIENTE_ID: '',
            ORIGEM: '',
            DESTINO: '',
            DESCRICAO_MOTIVO: ''
          })
        };
      }
    },
    onNew(){
      this.form = {
        ... this.cleanForm(),
        items: [{rows:[]}]
      };
      this.action = 'new';
      if(this.formOld.CLIENTE_ID) this.form.CLIENTE_ID = this.formOld.CLIENTE_ID;
      if(this.config.FIXAR_DATA_VOUCHER == 'S' && this.formOld.DATA_VIAGEM) this.form.DATA_VIAGEM = this.formOld.DATA_VIAGEM;
      if(this.config.FIXAR_MOTIVO_VOUCHER == 'S' && this.formOld.MOTIVO_ID) this.form.MOTIVO_ID = this.formOld.MOTIVO_ID;
    },
    voucherExiste(flag){
      if(this.form.NUMERO > 0 && this.$refs.NUMERO){
        if(flag || (this.numeroVoucher !== this.form.NUMERO)) {
          this.aFields[0].fields[3].isValid = true;
          this.aFields[0].fields[3].errorMessage = '';
          let criterio = !this.form.VOUCHE_ID ? `NUMERO=${this.form.NUMERO}` : `NUMERO=${this.form.NUMERO} AND VOUCHE_ID <> ${this.form.VOUCHE_ID}`;
          let params ={_select:'COUNT(NUMERO) AS CONT',_criterio: criterio};
          this.$api.get(`/vouche`, {params})
          .then(({data}) => {
            if(data.resultado[0]['CONT'] > 0){
              this.numeroVoucher = this.form.NUMERO;
              this.$refs.NUMERO[0].$refs.input.focus()
              this.aFields[0].fields[3].autofocus = true;
              this.aFields[0].fields[3].isValid = false;
              this.aFields[0].fields[3].errorMessage = 'Voucher já existe';
              /*this.$q.notify({
              message: `O Voucher ${this.form.NUMERO} já está lançado'`,
              type: 'negative',
            });
            */
          }
        });
      }
    }
  },
  mudaCliente(){
      this.campos.forEach((campo, i) => {
        this.form[campo] = 0;
      });
      this.campos2.forEach((campo, i) => {
        this.form[campo] = '';
      });
      this.campos3.forEach((campo, i) => {
        this.form[campo] = 0;
      });
      //this.options['ROTEIRO_ID'] = [];
      //this.options['ROTEIRO_VIA_ID3'] = [];
    //  this.options['ROTEIRO_VIA_ID4'] = [];
  },
  save() {
    if(_.isEqual(this.form, this.formOld)) {
      this.$q.notify({
        message: 'Nenhum dado para salvar!',
        type: 'warning',
      });
    } else {
      this.$emit('form:before-save', this.form);
      if(this.validaDados()){
        if(this.action == 'new'){
          return this.create()
        } else {
          return this.update()
        }
      }
    }
  },
  validaDados(){
    let cli =  this.currentClient;
    let rows = this.form.items[0].rows;
    if(!this.form.QTD_PASSAGEIROS) this.form.QTD_PASSAGEIROS = '1';
    if (cli) {
      if(cli.CC_OBRIGATORIO == 'S' && this.form.QTD_PASSAGEIROS != rows.length){
        this.$q.notify({
          message: 'Centro de custo é obrigatório. Qtd. de passageiros precisa corresponder ao número de linhas',
          type: 'negative'
        });
        return false;
      }
    }
    return true
  }
},
computed: {
  currentClient() {
    return this.options['CLIENTE_ID'].length == 0 ? {} :
    this.options['CLIENTE_ID']
    .filter(row => row.value == this.form.CLIENTE_ID)[0]
  },
  visibleColumnsItems () {
    let ret  = [];
    if(this.currentClient){
      if(this.currentClient.USA_CR == 'S') ret.push('CR_CLIENTE_ID');
      if(this.currentClient.USA_MAT_PASSAGEIRO == 'S') ret.push('PASSAGEIRO_ID');
      if(this.currentClient.USA_NOME_PASSAGEIRO == 'S') ret.push('PASSAGEIRO');
      if(this.currentClient.USA_ORIGEM == 'S') ret.push('ORIGEM');
      if(this.currentClient.USA_DESTINO == 'S') ret.push('DESTINO');
      if(this.currentClient.USA_DESCRICAO_MOTIVO == 'S') ret.push('DESCRICAO_MOTIVO');
    }
    return ret;
  },
  readonly () {
    return this.method == 'view' ? true : false
  },
  config(){
    return storage.getItem('fp_config');
  }
},
mounted () {
  let fieldNumHorasParadas = 32
  this.aFields[0].fields[fieldNumHorasParadas].precision = this.config.DECIMAIS_NUM_HORAS_PARADAS ? Number(this.config.DECIMAIS_NUM_HORAS_PARADAS) : 2;//NUM_HORAS_PARADAS
  if(this.method != 'new') {
    this.getRecord()
    .then(({data}) => {
      this.form = data.resultado || [];
      let clienteId = data.resultado.CLIENTE_ID;
      if(clienteId > 0){
        this.getClienteVoucher(clienteId)
        .then(({data}) => {
          this.options['ROTEIRO_ID'] = data.resultado.roteiros || [];
          this.options['ROTEIRO_VIA_ID'] = data.resultado.roteiros_via || [];
          this.options['ROTEIRO_VIA_ID2'] = data.resultado.roteiros_via || [];
          this.options['ROTEIRO_VIA_ID3'] = data.resultado.roteiros || [];
          this.options['ROTEIRO_VIA_ID4'] = data.resultado.roteiros || [];
          this.options['MOTIVO_ID'] = data.resultado.motivos || [];
          this.options['PASSAGEIRO_ID'] = data.resultado.passageiros || [];
          this.options['CR_CLIENTE_ID'] =  data.resultado.cr_cliente || [];
          this.tabPreco = data.resultado.tabela_preco || {};

          if(data.resultado.roteiros_via.length > 0){
            this.visibleViaKm(true);
          } else {
            this.visibleViaKm(false);
          }
          if(this.tabPreco.PERC_ADIC_VIA > 0){
            this.visibleVia(true)
          } else {
            this.visibleVia(false)
          }
          if(this.tabPreco.PERC_ADIC_RETORNO > 0){
            this.visibleRetorno(true)
          } else {
            this.visibleRetorno(false)
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
          if(this.tabPreco.VALOR_KM_RODADO > 0){
            this.visibleKm(true)
          } else {
            this.visibleKm(false)
          }
          if(this.currentClient.USA_PEDAGIO2 == 'S'){
            this.visiblePedagio2(true)
          } else {
            this.visiblePedagio2(false)
          }
          if(this.config.LOCADORA == 'S'){
            this.usaMotivo(37)
          } else {
            this.usaMotivo(31)
          }
          this.form.TABELA_PRECO_ID = this.currentClient.TABELA_PRECO_ID
          });
      }
      this.formOld = clone(this.form);
      this.tabelaPrecoIdOld = this.currentClient.TABELA_PRECO_ID
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
