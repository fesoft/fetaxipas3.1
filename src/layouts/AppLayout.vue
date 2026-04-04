<template>
  <q-layout view="lHh Lpr fff">
    <q-header>
      <q-toolbar ref="toolbar" :class="classHeader()">
        <q-btn flat round dense icon="chevron_left" @click="$router.go(-1)"></q-btn>
        <q-btn v-if="user.grupo_id !== '2'" flat round dense icon="chevron_right" @click="$router.go(+1)"></q-btn>
        <q-toolbar class="q-mr-md q-text-h6">{{ title }}</q-toolbar>

        <q-space />
        <q-btn flat dense round icon="account_circle">
          <q-menu>
            <q-list link separator class="scroll" style="min-width: 250px">
              <q-item v-ripple>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ user.login.substring(0, 1) }}
                  </q-avatar>
                </q-item-section>
                <q-space />
                <q-item-section>{{ user.login }}</q-item-section>
              </q-item>
              <q-item clickable @click="openMenu('alterasenha')">
                <q-item-section avatar>
                  <q-avatar color="secondary" text-color="white" icon="vpn_key"></q-avatar>
                </q-item-section>
                <q-item-section>Alterar senha</q-item-section>
              </q-item>
              <q-item clickable @click="logOut">
                <q-item-section avatar>
                  <q-avatar color="secondary" text-color="white" icon="exit_to_app"></q-avatar>
                </q-item-section>
                <q-item-section>Sair</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!--q-btn v-if="user.grupo_id  !== '2'" flat dense round icon="menu" @click="rightDrawerOpen = !rightDrawerOpen" aria-label="Menu"></q-btn-->
      </q-toolbar>

    </q-header>
    <!--q-drawer v-if="user.grupo_id  !== '2'" overlay side="right"  v-model="rightDrawerOpen" :width="250" :breakpoint="500"  bordered>
    <div class="q-pa-xs" style="max-width: 250px">
      <app-menu-accordion :menus="menus"></app-menu-accordion>
    </div>
  </q-drawer-->
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import AppMenuAccordion from 'components/AppMenuAccordion.vue'
import AppSelect from 'components/AppSelect.vue'
import { storage } from 'src/modules/utils'
import { mapActions, mapWritableState, mapState } from 'pinia'
import { useAuthStore } from 'stores/auth-store'
import { useDashboardStore } from 'stores/dashboard-store'

export default defineComponent({
  name: 'AppLayout',
  components: {
    AppMenuAccordion,
    AppSelect
  },
  data: function () {
    return {
      rightDrawerOpen: false,
    }
  },
  methods: {
    ...mapActions(useDashboardStore, ['setHistory', 'removeHistory']),
    openMenu(menu) {
      let location = `/dashboard/${menu}`;
      if (this.$route.fullPath !== location) {
        this.$router.push(location);
      }
    },
    logOut(item) {
      this.$q.dialog({
        title: 'Confirmação',
        message: 'Confirma saida?',
        ok: 'Sim',
        cancel: 'Não'
      })
        .onOk(() => {
          storage.clear();
          this.$nextTick(() => this.$nextTick(() => this.$router.push({ name: 'loginUser' })));
        })
    },
    classHeader() {
      return this.$q.dark.isActive ? 'bg-dark text-grey-2' : 'bg-grey-3 text-grey-9'
    },
    classHistory() {
      return this.$q.dark.isActive ? 'bg-dark text-grey-2' : 'bg-grey-2 text-grey-9'
    }
  },
  computed: {
    ...mapState(useAuthStore, ['user', 'menus']),
    ...mapWritableState(useDashboardStore, ['history', 'cooperativa']),
    title() {
      return this.$route.meta.title || process.env.APP_TITLE
    }
  },
  mounted() {
    this.rightDrawerOpen = this.$q.screen.gt.md
    this.$q.notify.setDefaults({
      timeout: 1000
    })
    this.cooperativas = storage.getItem('Xcooperativas')

    if (this.$q.dark.isActive && this.$q.platform.is.mobile) {
      this.$q.addressbarColor.set('#121212');
    } else {
      this.$q.addressbarColor.set('#f5f5f5');
    }
  }
})
</script>
