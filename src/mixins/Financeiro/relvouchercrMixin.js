export const  relvouchercrMixin = {
  data: () => {
    return {
      options: {
        RELATORIO: [],
        CLIENTE_ID: [],
        COOPERADO_ID: [],
        MOTIVO_ID: [],
        CC: [],
        FILTRAR_POR: [
          {value: 'DATA', label: 'Data da viagem'},
          {value: 'DATA_LANCAMENTO', label: 'Data lançamento'},
        ],
        FORMATO: [
          {value: 'PDF', label: 'PDF'},
          {value: 'ODS', label: 'ODS'},
        ],
        TIPO: [
          {value: 'M', label: 'NFSe - Municipal'},
          {value: 'I', label: 'CTEOS - Intermunicipal'},
        ],
        TIPO_PLACA: [
          {value: 'V', label: 'Vermelha'},
          {value: 'C', label: 'Cinza'},
        ],
      }
    }
  },
  methods: {
    formInput(field, val){
      if(field == 'CLIENTE_ID') {
        let clienteId = val;
        if(clienteId){
          this.getMotivo(clienteId)
          .then(({data}) => {
            this.options['MOTIVO_ID'] = data.resultado || []
          });
          if(this.form.DATAI.length == 10 && this.form.DATAF.length == 10){
            let params = {
              'CLIENTE_ID': clienteId,
              'DATAI': this.form.DATAI,
              'DATAF': this.form.DATAF
            };
            this.getCentroCustoRel(params)
            .then(({data}) => {
              this.options['CC'] = data.resultado || []
            });
            this.visibleCc();
          }
        }
      }
    },
    formBlur(field){
      if(field == 'DATAI' || field == 'DATAF') {
        if(this.form.CLIENTE_ID > 0 && this.form.DATAI.length == 10 && this.form.DATAF.length == 10){
          let params = {
            'CLIENTE_ID': this.form.CLIENTE_ID,
            'DATAI': this.form.DATAI,
            'DATAF': this.form.DATAF
          };
          this.getCentroCustoRel(params)
          .then(({data}) => {
            this.options['CC'] = data.resultado || []
          });
        }
      }
    },
    visibleCc(){
      if(this.form.CLIENTE_ID){
        if(this.form.DATAI && this.form.DATAF) {
          this.aFields[6].visible = true;
        }
        this.aFields[7].visible = true;
      } else {
        this.aFields[6].visible = false;
        this.aFields[7].visible = false;
      }
    },
  },
  mounted () {
    let clienteId = this.form.CLIENTE_ID;
    this.getRelatorio('g2')
    .then(({data}) => {
      this.options['RELATORIO'] = data.resultado || [];
    });
    if(clienteId){
      this.getMotivo(clienteId)
      .then(({data}) => {
        this.options['MOTIVO_ID'] = data.resultado || []
      });
      let params = {
        'CLIENTE_ID': clienteId,
        'DATAI': this.form.DATAI,
        'DATAF': this.form.DATAF
      };
      this.getCentroCustoRel(params)
      .then(({data}) => {
        this.options['CC'] = data.resultado || []
      });
    }; 
  }
}
