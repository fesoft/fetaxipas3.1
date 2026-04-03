<template>
  <q-page padding class="docs-input row items-center justify-center">
    <div style="width: 250px; max-width: 90vw;" @keydown.enter="save">
      <q-form
      ref="myForm"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
      @submit="save"
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
          <app-input autofocus v-model="form.usuario" label="Usuário" readonly></app-input>
          <!--q-select v-model="form.recVia" label="Recuperar via" required dense options-dense stackLabel hide-bottom-space emit-value outlined :options="optionsRecVia"></q-select-->
          <app-input type="email" v-model="form.email" label="Email"></app-input>
          <!--app-input-number  v-show="form.recVia == 'Telegram @fesigBot'" v-model="form.telegram" label="Telegram @fesigBot" required></app-input-number-->
        </q-card-section>
        <q-card-actions class="justify-center">
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
import AppInputNumber from 'components/AppInputNumber.vue'
import AppCombobox from 'components/AppCombobox.vue'

export default defineComponent({
  name: 'RecoverStep1',
  components: {
    AppInput,
    AppInputNumber,
    AppCombobox
  },
  data: () => {
    return {
      title: 'Recuperar Senha',
      optionsRecVia:  ['Telegram @fesigBot', 'E-mail' ],
      form: {
        usuario: '',
        recVia: 'E-mail',
        email: '',
        telegram: ''
      },
      formDialog: false,
      isPassword: true,
    }
  },
  methods:{
    save() {
      let usuario = this.form.usuario;
      let credential = {
        usuario: usuario,
        recVia: this.form.recVia,
        email: this.form.email,
        telegram: this.form.telegram,
        tipo: process.env.APP_TIPO_LOGIN
      };
      this.$apiLogin.post(`/auth/recover_step1`, credential)
      .then(({data}) => {
        if ( data.success ) {
          storage.set('pretoken', data.user.pretoken);
          storage.set('login', data.user.login);
          this.$router.push('/auth/recoverStep2');
        }
        else {
          this.$q.notify({type: 'negative', message: data.msg})
        }
      })
    },
  },
  mounted () {
    this.form.pretoken = storage.getItem('pretoken');
    this.form.usuario = storage.getItem('login');
  }
}
)
</script>
