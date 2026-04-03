<template>
  <div class="q-pa-sm">
    <div class="row q-pa-sm  items-center justify-center">
      <q-btn label="MINHAS VIAGENS" to="viagens" color="secondary" icon="directions_car" class="col-12" square stack size="lg" />
      <q-btn label="MEUS DADOS" to="meusdados" color="primary" icon="list" class="col-12" square stack
        size="lg" />
    </div>    
  <q-btn
    model="subscription"
    round
    color="red"
    :icon="btnPushIcon"
    :disabled="btnPushDisabled"
    @click="pushButton"
    class="fixed"
    style="left: 18px; bottom: 18px"
    ></q-btn>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { notificationMixin } from 'src/mixins/notificationMixin'
import { optionsMixin } from 'src/mixins/optionsMixin'
import { mapState } from 'pinia'
import { useAuthStore } from 'stores/auth-store'
import { useDashboardStore } from 'stores/dashboard-store'

export default defineComponent({
  name: 'Index',
  mixins: [ notificationMixin, optionsMixin ],
  components: {
  //
  },
  computed: {
    ...mapState (useAuthStore, [ 'user' ]),
    ...mapState (useDashboardStore, [ 'cooperativa' ]),
  },
  mounted() {

  }
})
</script>
