import { clone } from 'src/modules/utils'

export const  motivoMixin = {
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
