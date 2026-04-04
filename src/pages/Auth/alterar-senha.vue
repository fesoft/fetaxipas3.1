<template>
  <q-page padding class="row justify-center">
    <div>
      <q-form
      ref="myForm"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
      @submit="save"
      >
      <q-card class="q-mt-md q-mr-sm">
        <q-bar v-if="!$q.platform.is.mobile" class="bg-primary text-white rounded-top-bar">
          <div class="text-weight-bold justify-center">{{title}}</div>
        </q-bar>
        <q-card-section class="q-col-gutter-xs">
          <app-input col="12" v-model="form.usuario" readonly label="Usuário"></app-input>
          <app-input col="12" autofocus v-model="form.senha" label="Senha atual" type="password" required></app-input>
          <app-input col="12" v-model="form.senha_nova" label="Nova senha" type="password" required minlength="8" maxlength="14" :hint="showPasswordForce(form.senha_nova)"></app-input>
          <app-input col="12" v-model="form.senha_confirmacao" label="Confirmação" type="password" required minlength="8" maxlength="14"></app-input>
          <div>
            <p>1 - A senha precisa conter letras maiusculas e minusculas</p>
            <p>2 - Números e pelo menos um caractere especial "[@!#$%&*+=?|-]"</p>
          </div>
        </q-card-section>
        <q-card-actions class="justify-center">
          <q-btn
          v-model="submit"
          type="submit"
          size="sm"
          label="Salvar"
          color="positive"
          placeholder
          rounded
          />
        </q-card-actions>
      </q-card>
    </q-form>
  </div>
</q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { showPasswordForce, storage } from 'src/modules/utils'
import AppInput from 'components/AppInput.vue'
import md5 from 'md5'

export default defineComponent({
  name: 'AlterarSenha',
  components: {
    AppInput
  },
  data: () => {
    return {
      submit: false,
      form: {
        usuario: '',
        senha_nova: '',
      },
      showPasswordForce
    }
  },
  methods:{
    save() {
      let forca = showPasswordForce(this.form.senha_nova);
      if(forca == 'ALTA'){
        let credential = {
          usuario: this.form.usuario,
          senha: md5(this.form.senha),
          senha_nova: md5(this.form.senha_nova),
          senha_confirmacao: md5(this.form.senha_confirmacao)
        }
        this.$api.put('/alterar_senha', credential)
        .then(({data}) => {
          if (data.success ) {
            this.$q.notify({
              message: 'Senha alterada com sucesso',
              type: 'positive',
              onDismiss: () => {
                storage.clear();
                this.$nextTick(() => this.$router.push({name: 'loginUser'}));
              }
            })
          }
          else {
            this.$q.notify({
              message: data.msg,
              type: 'negative',
            })
          }
        })
      } else {
        this.$q.notify({
          message: 'Digite uma senha forte!',
          type: 'negative',
        })
      }
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  mounted () {
    let user = storage.getItem('fp_user');
    this.form.usuario = user.login;
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
