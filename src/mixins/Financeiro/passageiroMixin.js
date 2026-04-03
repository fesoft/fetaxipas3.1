import { clone } from 'src/modules/utils'

export const  passageiroMixin = {
  data: () => {
    return {
      options: {
        AREA_ID: [],
        CENTRO_CUSTO_ID: []
      }
    }
  },
  methods: {
    getPassageiro() {
      this.$api.get('/passageiro')
      .then(({data}) => {
        this.form = data.resultado[0] || [];
        this.formOld = clone(this.form);
      })
    },
  },
  mounted () {
    this.formTitle = `Meus dados`
    this.getPassageiro()
    this.getCentroCusto().then(({data}) => {
      this.options['CENTRO_CUSTO_ID'] = data.resultado || [];
    })
    this.getArea().then(({data}) => {
      this.options['AREA_ID'] = data.resultado || [];
    })
  }
}
