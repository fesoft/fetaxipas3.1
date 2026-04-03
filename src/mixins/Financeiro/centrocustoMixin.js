import { clone } from 'src/modules/utils'

export const  centrocustoMixin = {
  data: () => {
    return {
      options: {
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
    }
  }
}
