import { clone } from 'src/modules/utils'

export const seggrupoMixin = {
  data: () => {
    return {
      options: {}
    }
  },
  mounted () {
    if(this.method != 'new') {
      this.getRecord()
      .then((response) => {
        this.form = response.data.resultado || {}
        this.formOld = clone(this.form);
      })    
    }
  }
};
