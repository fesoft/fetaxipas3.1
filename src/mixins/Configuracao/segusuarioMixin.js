import { clone } from 'src/modules/utils'
import MD5 from 'md5'

export const segusuarioMixin = {
  data: () => {
    return {
      options: {
        GRUPO_ID: [],
        AREA_ID: [],
        ATIVO: [
          {value: 'S', label: 'Sim'},
          {value: 'N', label: 'Não'},
        ]
      }
    }
  },
  methods: {
    onBeforeSave(form) {
      form.SENHA = form.SENHA.length < 32 ? MD5(form.SENHA) : form.SENHA;
      delete(form['items']);
    },
    formInput(field, val){
    },
  },
  mounted () {
    this.$emitter.on('form:before-save', this.onBeforeSave);
    if(this.method != 'new') {
      this.getRecord()
      .then((response) => {
        this.form = response.data.resultado || {}
        this.formOld = clone(this.form);
      })
      .catch(error => {
    })
    }
    this.getSegGrupo (1).then(({data}) => {
      this.options['GRUPO_ID'] = data.resultado || []
    });
    this.getArea().then(({data}) => {
      this.options['AREA_ID'] = data.resultado || []
    });
  },
  unmounted () {
    this.$emitter.off('form:before-save', this.onBeforeSave);
  },
}
