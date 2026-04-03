export const  vwtabelaprecoMixin = {
  data: () => {
    return {
      options: {}
    }
  },
  methods: {
    getTabelapreco() {
      this.$api.get('/tabela_preco')
      .then(({data}) => {
        this.form = data.resultado || {};
      })
    },
  },
  mounted () {
    this.getTabelapreco();
    this.$emitter.on('tabelapreco:after-select', this.getTabelapreco)
  },
  unmounted () {
    this.$emitter.off('tabelapreco:after-select', this.getTabelapreco)
  }
}
