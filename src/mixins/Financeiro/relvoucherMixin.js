export const  relvoucherMixin = {
  data: () => {
    return {
      options: {
        RELATORIO: [],
        CLIENTE_ID: [],
        CENTRO_CUSTO: [],
        MOTIVO_ID: [],
          FORMATO: [
          {value: 'PDF', label: 'PDF'},
          {value: 'ODS', label: 'ODS'},
        ],
        TIPO: [
          {value: 'M', label: 'NFSe - Municipal'},
          {value: 'I', label: 'CTEOS - Intermunicipal'},
        ],
      }
    }
  },
  methods: {
    formBlur(field){
      this.form.DATAI = this.form.DATAI === undefined ? '' : this.form.DATAI;
      this.form.DATAF = this.form.DATAF === undefined ? '' : this.form.DATAF;
      if(field == 'DATAI' || field == 'DATAF') {
        if(this.form.DATAI.length == 10 && this.form.DATAF.length == 10){
          let params = {
            DATAI: this.form.DATAI,
            DATAF: this.form.DATAF
          }
          this.getCentroCustoRel(params)
          .then(({data}) => {
            this.options['CENTRO_CUSTO'] = data.resultado || []
          });
        }
      }
    }
  },
  mounted () {
    this.getRelatorio('g10')
    .then(({data}) => {
      this.options['RELATORIO'] = data.resultado || [];
    });
    this.getMotivo()
    .then(({data}) => {
      this.options['MOTIVO_ID'] = data.resultado || []
    });
  }
}
