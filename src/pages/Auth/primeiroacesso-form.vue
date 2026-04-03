<script>
import { defineComponent } from 'vue'
import AppForm from 'components/AppForm.vue'
import md5 from 'md5'
import { date } from 'quasar'

export default defineComponent({
  name: 'passageiro-form',
  extends: AppForm,
  data: () => {
    return {
      options: {
        AREA_ID: [],
        CENTRO_CUSTO_ID: []
      }
    }
  },
  methods : {
    formInput(field, val){
      if(field == 'AREA_ID') {
        let id = this.$route.params.id
        let criterio =  `AREA_ID = ${val}`
        this.getCentroCustoPA(id, criterio).then(({data}) => {
          this.options['CENTRO_CUSTO_ID'] = data.resultado || [];
        })
      }
      if(field == 'PASSAGEIRO_ID') {
        this.form.NOME_USUARIO = `${this.form.PASSAGEIRO_ID}.${this.nomeFantasia.toLowerCase()}`;
      }
    },
    getAreaPA(id) {
      return this.$apiLogin.get(`/55TZMvT3xvzzHYfPbQSoOFIHtJRslMkRdf0QLP87X1Wr9OLu1909XEc9xNGQCeFf/${id}`)
    },
    getCentroCustoPA (id, criterio) {
      let params = {
        _criterio: criterio
      }
      return this.$apiLogin.get(`/50GenrQoc0QyYpvJW65MaDO5DqKzPnWxXbP0FZvxnsuIBUjvnBSTLxi0zuKe7aEc/${id}`, {params})
    },
    create () {
      if(this.expirado()) {
        this.$q.notify({
          message:'Link expirado!',
          type: 'negative',
        });
      } else {
        let id = this.$route.params.id;
        if(this.foreignKey && this.fk) {
          this.form[this.foreignKey] = this.fk;
        };
        var data = this.prepareFormCreate();
        this.disable = true;
        data.SENHA = md5(data.SENHA)

        this.$apiLogin.post(`/0BfDEmKwP7HWByEFeuGMWmiy3aaDfzepCRML3P3zz2iz4iyfp3eBj4gMj5I5QHJb/${id}`, data)
        .then(({data}) => {
          if(data.success) {
            let msg = '';
            this.$q.notify({
              message:'Inserido com sucesso',
              type: 'positive',
            });
            this.$router.push({name: 'loginUser'});
          }
          else {
            this.$q.notify({type: 'negative', message: data.msg});
            this.disable = false;
          }
        })
      }
    },
    expirado () {
      let expire = atob(this.$route.params.id3)
      let now = (new Date()).getTime()
      return (now > expire) ? true : false
    }
  },
  mounted () {
    this.nomeFantasia = atob(this.$route.params.id2);
    let milisegundos = atob(this.$route.params.id3) * 1
    let expira = date.formatDate(new Date(milisegundos), 'HH:mm:ss')
    this.formTitle = `${this.nomeFantasia}, expira às ${expira}`

    let msgExpira =  ` expira às ${expira}`
        if(this.expirado()){
          msgExpira = 'link expirado'
          this.$q.notify({
            message:'Link expirado!',
            type: 'negative',
          })
        }
        this.formTitle = `${this.nomeFantasia}, ${msgExpira}`


    let id = this.$route.params.id
    this.getAreaPA(id).then(({data}) => {
      this.options['AREA_ID'] = data.resultado || [];
    })
  }
})
</script>
