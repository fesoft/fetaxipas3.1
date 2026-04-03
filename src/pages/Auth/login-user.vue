<template>
    <q-page padding class="docs-input row items-center justify-center">
      <div style="width: 250px; max-width: 90vw;" @keydown.enter="loginUser">
      <q-form
          ref="myForm"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
          @submit="loginUser"
        >
       <q-card>
        <q-bar class="bg-primary text-white rounded-top-bar">
          <q-space />
          <div class="text-weight-bold">
            {{title}}
          </div>
          <q-space />
        </q-bar>
          <q-card-section class="q-col-gutter-xs">
            <app-input
            autofocus
            v-model="form.usuario"
            label="Usuário"
            required
            >
          </app-input>
          </q-card-section>
          <q-card-actions class="justify-center">
            <q-btn rounded label="Continuar" type="submit" color="positive" size="sm" :disable="disable"></q-btn>
          </q-card-actions>
        </q-card>
        </q-form>
      </div>
    </q-page>
  </template>

  <script>
  import { defineComponent, ref } from 'vue'
  import AppInput from 'components/AppInput.vue'
  import { storage, token } from 'src/modules/utils'

  export default defineComponent({
    name: 'LoginUser',
    components: {
      AppInput
    },
    data: () => {
      return {
        title: process.env.APP_TITLE,
        disable: false,
        form: {
          usuario: '',
          senha: ''
        },
        formDialog: false,
        isPassword: true,
      }
    },
    methods:{
      loginUser() {
        this.disable = true;
        let usuario = this.form.usuario;
        let credential = {
          usuario: usuario,
          tipo: process.env.APP_TIPO_LOGIN
        };
        this.$apiLogin.post(`/auth/login_user`, credential)
        .then(({data}) => {
          this.disable = false;
            if ( data.success ) {
              storage.set('pretoken', data.user.pretoken);
              storage.set('login', data.user.login);
              let location = '/auth/login';
              if(this.$route.fullPath !== location) this.$router.push(location);
            }
            else {
              this.$q.notify({type: 'negative', message: data.msg})
            }
        })
      }
    },
    mounted(){
      if(token()) this.$router.replace('/dashboard/index');
    }
  }
)
</script>
