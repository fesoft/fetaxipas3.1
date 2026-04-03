export const optionsMixin = {
  data: () => {
    return {
      optionsSimNao: [{value:'S', label:'Sim'},{value:'N', label:'Não'}],
    }
  },
  methods: {
    getTabPreco(clienteId) {
      if(cliente_id){
        let params ={
          _criterio: `TABELA_PRECO = (SELECT TABELA_PRECO_ID FROM CLIENTE WHERE CLIENTE_ID=${clienteId})`
        };
        return this.$api.get('/tabela_preco', {params})
      }
    },
    getParametros () {
      return this.$api.get('/empresa')
    },
    getEmpresa () {
      let params = {
        _select: 'COD_INTERNO_OBRIGATORIO, USA_CR, USA_MOTIVO, USA_ROTEIRO'
      };
      return this.$api.get(`/empresa_params`, {params})
    },
    getClienteVoucher () {
        return this.$api.get(`/cliente_options_voucher`)
    },
    getTabelaPreco () {
      let params ={
        _select: 'tabela_preco as "value", descricao as "label"',
        sort: 'descricao',
        dir: 'asc',
      };
      return this.$api.get(`/tabela_preco`, {params})
    },
    getCooperado () {
      let params ={
        _select: 'cooperado_id "value", nome "label"',
        sort: 'nome',
        dir: 'asc',
        _criterio:" data_afastamento is null"
      };
      return this.$api.get(`/cooperado`, {params})
    },
    getCooperadoRel () {
      let params ={
        _select: 'cooperado_id "value", nome "label"',
        sort: 'nome',
        dir: 'asc'
      };
      return this.$api.get(`/cooperado`, {params})
    },
    getVwRoteiro (clienteId) {
      if(clienteId){
        let params ={
          _select: 'roteiro_id as "value", descricao as "label", VALOR, VALOR_ADIC_VIA',
          _criterio: `CLIENTE_ID=${clienteId}`,
          sort: 'descricao',
          dir: 'asc',
        };
        return this.$api.get(`/vw_roteiro`, {params})
      }
    },
    getRoteiro () {
      let params ={
        _select: 'roteiro_id as "value", descricao as "label"',
        sort: 'descricao',
        dir: 'asc',
      };
      return this.$api.get(`/roteiro`, {params})
    },
    getMotivo () {
      let params ={
          _select: 'id as "value", descricao as "label"',
          sort: 'descricao',
          dir: 'asc',
      };
      return this.$api.get(`/motivo`, {params})
    },
    getCentroCusto () {
      let params ={
          _select: 'cr_cliente_id as "value", descricao as "label"',
          sort: 'descricao',
          dir: 'asc',
        };
        return this.$api.get(`/centrocusto`, {params})
    },
    getCentroCustoRel (params) {
      return this.$api.get(`/cliente_options_centrocusto`, {params})
    },
    getCrCliente () {
      let params ={
          _select: 'CENTRO_CUSTO_ID as "value", nome as "label"',
          sort: 'nome',
          dir: 'asc',
        };
        return this.$api.get(`/centrocusto`, {params})
    },    
    getPassageiro () {
    let params ={
        _select: 'passageiro_id as "value", nome as "label", CENTRO_CUSTO_ID AS CR_CLIENTE_ID, CELULAR, TELEGRAM,EMAIL, END_COMPLETO',
        sort: 'nome',
        dir: 'asc',
      };
      return this.$api.get(`/passageiro`, {params})
    },
    getMunicipio() {
      let params = {
        _select: 'MUNICIPIO_ID AS "value", NOME as "label"',
        sort: 'nome',
        dir: 'asc',
      };
      return this.$api.get('/municipio', {params})
    },
    getSegGrupo() {
      let params = {
        _select: 'GRUPO_ID AS "value", DESCRICAO as "label"',
        _type: 'auth',
        sort: 'descricao',
        dir: 'asc',
      };
      return this.$api.get('/seg_grupo', {params})
    },
    getRelatorio(grupo) {
      let params = {
        _select: 'CODIGO_REL AS "value", TITULO_REL as "label"',
        _criterio: `GRUPO='${grupo}'`,
        _type: 'auth',
        sort: 'ordem',
        dir: 'asc',
      };
      return this.$api.get('/dic_rel', {params})
    },
    getCreatedBy(grupo) {
      let params = {
        _select: 'DISTINCT CREATED_BY AS "value", CREATED_BY as "label"',
        _criterio: 'CREATED_BY IS NOT NULL',
        sort: 'CREATED_BY',
        dir: 'asc',
      };
      return this.$api.get('/vouche', {params})
    },
  }
}
