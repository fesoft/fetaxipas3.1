<template>
  <div class="q-pa-sm">
    <div class="row q-pa-sm  q-gutter-sm items-center justify-center">
      <q-btn v-if="config?.PASSAG_SOLICITA_VIAGEM == 'S'" label="SOLICITAR VIAGEM" to="vwprogramacaocliente" color="teal" icon="add_location" class="col-12"  rounded stack size="lg" />
      <q-btn label="MINHAS VIAGENS" to="viagens" color="teal-10" icon="directions_car" class="col-12" rounded stack size="lg" />
      <q-btn label="AUTUALIZAR ENDEREÇO" to="meusdados" color="teal-5" icon="list" rounded stack class="col-12" 
        size="lg" />
    </div>    
  <!--q-btn
    model="subscription"
    round
    color="red"
    :icon="btnPushIcon"
    :disabled="btnPushDisabled"
    @click="pushButton"
    class="fixed"
    style="left: 18px; bottom: 18px"
    ></q-btn-->
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { notificationMixin } from 'src/mixins/notificationMixin'
import { optionsMixin } from 'src/mixins/optionsMixin'
import { mapState } from 'pinia'
import { useAuthStore } from 'stores/auth-store'

export default defineComponent({
  name: 'Index',
  mixins: [ notificationMixin, optionsMixin ],
  components: {
  //
  },
  computed: {
    ...mapState (useAuthStore, [ 'user', 'config' ]),    
  },   
  mounted() {
    this.pushButton();
  }
})
</script>
