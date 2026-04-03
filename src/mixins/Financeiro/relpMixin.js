import { useAuthStore } from 'stores/auth-store'

export const  relpMixin = {
  data: () => {
    return {
      options: {
        RELATORIO: [],
        MOTIVO_ID: [],
        CENTRO_CUSTO: [],
        FORMATO: [
          {value: 'ODS', label: 'ODS'},
          {value: 'PDF', label: 'PDF'},
        ],
        TIPO: [
          {value: 'M', label: 'NFSe - Municipal'},
          {value: 'I', label: 'CTEOS - Intermunicipal'},
        ]
      }
    }
  },
  methods: {
    getRelatorioP() {
      let params = {
        _select: 'P_REL_ID AS "value", TITULO as "label", TABELA'
      }
      return this.$api.get('/p_rel', {params})
    },
    formInput(field, val){
    },
    formBlur(field) {
      if(field == 'DATAI' || field == 'DATAF') {
        if(this.form.DATAI.length == 10 && this.form.DATAF.length == 10){
          let params = {
            'DATAI': this.form.DATAI,
            'DATAF': this.form.DATAF
          };
          this.getCentroCustoRel(params)
          .then(({data}) => {
            this.options['CENTRO_CUSTO'] = data.resultado || []
          });
        }
      }
    }
  },
  created () {
    this.form.FORMATO = 'ODS';
  },
  mounted () {
    this.getRelatorioP().then(({data}) => {
      this.options['RELATORIO'] = data.resultado || [];
      let opt = this.options['RELATORIO'].filter(v => v.value == this.form.RELATORIO);
    });
    this.getMotivo().then(({data}) => {
      this.options['MOTIVO_ID'] = data.resultado || []
    });
  }
}
