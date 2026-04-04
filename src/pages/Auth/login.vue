<template>
  <q-page padding class="docs-input row items-center justify-center">
    <div style="width: 250px; max-width: 90vw;" @keydown.enter="login">
      <q-form
      ref="myForm"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
      @submit="login"
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
          v-model="form.login"
          disable
          label="Usuário"
          >
        </app-input>
        <q-input
        autofocus
        rounded
        standout       
        hide-bottom-space
        v-model="form.senha"
        label="Senha"
        :type="isPassword ? 'password' : 'text'"
        required
        >
        <template v-slot:append>
          <q-icon
          :name="isPassword ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPassword = !isPassword"
          />
        </template>
      </q-input>
    </q-card-section>
    <q-card-actions class="justify-center row">
      <q-btn rounded label="Login" type="submit" color="positive" size="sm" class="col-12" :disable="disable"></q-btn>
      <q-btn rounded label="Recuperar Senha"  color="blue" flat no-caps size="sm" @click="recover" class="col-12"></q-btn>
    </q-card-actions>
  </q-card>
</q-form>
</div>
</q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import AppInput from 'components/AppInput.vue'
import { storage, token, showPasswordForce} from 'src/modules/utils'
import md5 from 'md5'
import { mapActions } from 'pinia'
import { useAuthStore } from 'stores/auth-store'

export default defineComponent({
  name: 'Login',
  components: {
    AppInput
  },
  data: () => {
    return {
      title: process.env.APP_TITLE,
      form: {
        login: '',
        senha: '',
        pretoken: ''
      },
      disable: false,
      formDialog: false,
      isPassword: true,
    }
  },
  methods:{
    ...mapActions(useAuthStore, ['setAuth', 'setUser', 'setPermitions', 'setMenus', 'setToken']),
    login() {
      this.disable = true;
      let force =  showPasswordForce(this.form.senha);
      let credential = {
        pretoken: this.form.pretoken,
        senha: md5(this.form.senha),
        tipo: process.env.APP_TIPO_LOGIN
      };
      this.$apiLogin.post(`/auth/login_duplo`, credential)
      .then(({data}) => {
        this.disable = false;
        if ( data.success ) {
          storage.set('fp_user', data.resultado.user);
          storage.set('fp_permitions', data.resultado.permitions);
          storage.set('fp_menus', data.resultado.menus);
          storage.set('fp_token', data.token);
          storage.set('fp_token_expire', data.token_expire);
          storage.set('Xcooperativas', data.resultado.cooperativas);
          this.setAuth(data.token ? true : false);
          this.setUser(data.resultado.user);
          this.setPermitions(data.resultado.permitions);
          this.setMenus(data.resultado.menus);
          this.setToken(data.token);
          storage.set('pretoken','');
          storage.set('login','');
          let location = force == 'ALTA' ? `/dashboard/index` : '/auth/alterasenha';
          if(this.$route.fullPath !== location) this.$router.push(location);
        }
        else {
          if(data.msg == "Expired token") {
            if(this.$route.fullPath !== '/auth/loginUser')
            this.$router.push({name: 'loginUser'});
          } else {
            this.$q.notify({type: 'negative', message: data.msg})
          }
        }
      })
    },
    recover() {
      this.$router.push('/auth/recoverStep1')
    },
  },
  mounted(){
    this.form.pretoken = storage.getItem('pretoken');
    this.form.login = storage.getItem('login');
    if(!this.form.login) this.$router.push({name: 'loginUser'});
  }
}
)
</script>

<style>
/* Modo escuro */
.body--dark input:-webkit-autofill,
.body--dark input:-webkit-autofill:hover,
.body--dark input:-webkit-autofill:focus,
.body--dark input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px #1d1d1d inset !important;
  -webkit-text-fill-color: white !important;
}

/* Modo claro */
.body--light input:-webkit-autofill,
.body--light input:-webkit-autofill:hover,
.body--light input:-webkit-autofill:focus,
.body--light input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
  -webkit-text-fill-color: #000000 !important;
}
</style>
