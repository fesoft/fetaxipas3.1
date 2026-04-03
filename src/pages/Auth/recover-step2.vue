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
        <q-bar class="bg-secondary text-white">
          <q-space />
          <div class="text-weight-bold">
            {{title}}
          </div>
          <q-space />
        </q-bar>
        <q-card-section class="q-col-gutter-xs">
          <app-input autofocus v-model="form.totp" label="Código" required></app-input>
        </q-card-section>
        <q-card-actions class="justify-center">
          <q-btn label="Voltar" color="positive" size="sm" @click="$router.go(-1)"></q-btn>
          <q-btn label="Continuar" type="submit" color="positive" size="sm"></q-btn>
        </q-card-actions>
      </q-card>
    </q-form>
  </div>
</q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { storage } from 'src/modules/utils'
import AppInput from 'components/AppInput.vue'

export default defineComponent({
  name: 'RecoverStep2',
  components: {
    AppInput
  },
  data: () => {
    return {
      title: 'Recuperar Senha',
      form: {
        totp: '',
        pretoken: ''
      },
      formDialog: false,
      isPassword: true,
    }
  },
  methods:{
    login() {
      let credential = {
        totp: this.form.totp,
        pretoken: storage.getItem('pretoken'),
        tipo: process.env.APP_TIPO_LOGIN
      };
      this.$apiLogin.post(`/auth/recover_step2`, credential)
      .then(({data}) => {
        if ( data.success ) {
          storage.set('pretoken', data.user.pretoken);
          storage.set('usuario', data.user.usuario);
          this.$router.push('/auth/recoverStep3');
        }
        else {
          this.$q.notify({type: 'negative', message: 'Código expirado ou inválido'})
        }
      })
    }
  }
}
)
</script>
