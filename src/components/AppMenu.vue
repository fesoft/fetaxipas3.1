<template>
  <div class="cursor-pointer non-selectable q-mr-sm">
    {{title}}
    <q-menu v-if="nivel == 1">
      <q-list v-for="(menu, index) in menuData" :key="index">
        <q-item v-if="menu.title != ''" dense>
          <q-item-section>{{menu.title}}</q-item-section>
        </q-item>

        <q-item
        v-for="feature in menu.features"
        :key="feature.hash"
        @click="openMenu(feature.hash)"
        clickable
        dense
        v-close-popup
        class="text-caption"
        >
        <q-item-section>{{feature.title}}</q-item-section>
      </q-item>
    </q-list>
  </q-menu>

  <q-menu v-else>
    <q-list>
      <q-item dense clickable v-for="(menu, index) in menuData" :key="index">
        <q-item-section class="text-caption">{{menu.title}}</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right" />
        </q-item-section>

        <q-menu anchor="top right" self="top left">
          <q-list dense>
            <q-item
            v-for="feature in menu.features"
            :key="feature.hash"
            @click="openMenu(feature.hash)"
            clickable
            v-close-popup
            class="text-caption"
            >
            <q-item-section>{{feature.title}}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>

    </q-item>
  </q-list>
</q-menu>
</div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppMenu',
  props: {
    title: String,
    menuData: Array,
    nivel: String
  },
  methods: {
    openMenu(menu) {
      this.$router.push(`/dashboard/${menu}`)
    }
  }
})
</script>
