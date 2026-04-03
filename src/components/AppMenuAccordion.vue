<template>
    <q-list>
        <q-item clickable dense v-for="item in menus" :key="item.name" @click.native="openMenu(item)" replace>
          <q-item-section class="q-ml-sm text-caption">{{item.label}}</q-item-section>
        </q-item>
      </q-list>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions } from 'pinia'
import { useDashboardStore } from 'stores/dashboard-store'

export default defineComponent({
  name: 'AppMenuAccordion',
  props: {
    menus: Array,
  },
  methods: {
    ...mapActions(useDashboardStore, [ 'setHistory' ]),
    openMenu(item) {
      let location = `/dashboard/${item.name}`;
      if(this.$route.fullPath !== location) {
        this.$router.push(location);
        this.setHistory(item)
      }
    }
  }
})
</script>
