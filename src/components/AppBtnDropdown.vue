<template>
  <q-btn-dropdown split size="sm" :label="label" color="secondary">
    <q-list>
      <q-item v-for="item in items" :key="item.name" clickable v-close-popup @click="handler(item.name)">
        <q-item-section><q-item-label>{{item.label}}</q-item-label></q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppBtnDropdown',
  props: {
    label: String,
    color: String,
    items: Array,
    handler: {
      type: Function,
      required: true
    }
  }
})
</script>
