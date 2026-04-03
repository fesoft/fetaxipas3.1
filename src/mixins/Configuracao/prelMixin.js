import { clone } from 'src/modules/utils'

export const  prelMixin = {
  data: () => {
    return {
      options: {
        POSICAO: [
          {value: 'P', label: 'Postal'},
          {value: 'L', label: 'Paisagem'},
        ],
        TABELA: [
          {value: 'VW_VOUCHE', label: 'Viagem'},
          {value: 'VW_VOUCHE_CR', label: 'Viagem por centro de custo e passageiro'},
          {value: 'VW_PROGRAMACAO', label: 'Solicitação de viagem'},
        ],
      }
    }
  },
  mounted () {
    if(this.method != 'new') {
      this.getRecord()
      .then(({data}) => {
        this.form = data.resultado || [];
        this.formOld = clone(this.form);
      })
  };
  }
}
