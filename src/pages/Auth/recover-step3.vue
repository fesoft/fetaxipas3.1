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
        <q-bar v-if="!$q.platform.is.mobile" class="bg-secondary text-white">
          <div class="text-weight-bold justify-center">{{title}}</div>
        </q-bar>
        <q-card-section class="q-col-gutter-xs">
          <app-input col="12" v-model="form.usuario" readonly label="Usuário"></app-input>
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
          />
        </q-card-actions>
      </q-card>
    </q-form>
  </div>
</q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import md5 from 'md5'
import { showPasswordForce, storage } from 'src/modules/utils'
import AppInput from 'components/AppInput.vue'

export default defineComponent({
  name: 'RecoverStep3',
  components: {
    AppInput
  },
  data: () => {
    return {
      submit: false,
      title: 'Alteração de senha',
      form: {
        usuario: '',
        senha_nova: '',
        pretoken: ''
      },
      showPasswordForce
    }
  },
  methods:{
    save() {
      let forca = showPasswordForce(this.form.senha_nova);
      if(forca == 'ALTA'){
        let credential = {
          pretoken: this.form.pretoken,
          usuario: this.form.usuario,
          senha_nova: md5(this.form.senha_nova),
          senha_confirmacao: md5(this.form.senha_confirmacao)
        }
        this.$apiLogin.put(`/auth/recover_step3`, credential)
        .then(({data}) => {
          if (data.success ) {
            this.$q.notify({
              message: 'Senha alterada com sucesso',
              type: 'positive',
              onDismiss: () => {
                storage.clear();
                this.$router.push({name: 'loginUser'});
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
  mounted () {
    this.form.pretoken = storage.getItem('pretoken');
    this.form.usuario = storage.getItem('usuario');
  }
}
)
</script>
