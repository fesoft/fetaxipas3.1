<template>
  <q-menu touch-position context-menu>
    <q-list dense style="min-width: 100px q-gutter-md">
      <q-item
      clickable
      v-close-popup
      v-for="button in buttons"
      :key="button.name"
      @click.stop="handler(button.name,row)">
      <q-item-section avatar v-if="button.icon"><q-icon :name="button.icon" /></q-item-section>
      <q-item-section>{{button.label}}</q-item-section>
    </q-item>
  </q-list>
</q-menu>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppMenuContext',
  props: {
    permitions: {
      type: Object
    },
    buttons: Array,
    row: Object,
    handler: {
      type: Function,
      required: true
    }
  }
})
</script>
