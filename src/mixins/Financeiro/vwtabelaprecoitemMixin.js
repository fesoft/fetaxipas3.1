import { clone } from 'src/modules/utils'

export const  vwtabelaprecoitemMixin = {
  data: () => {
    return {
      options: {
        ROTEIRO_ID: [],
        TIPO: [
          {value: 'M', label: 'NFSe - Municipal'},
          {value: 'I', label: 'CTEOS - Intermunicipal'},
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
      .catch(error => {
    })
    }
    this.getRoteiro ()
    .then(({data}) => {
      this.options['ROTEIRO_ID'] = data.resultado || []
    });
  }
}
