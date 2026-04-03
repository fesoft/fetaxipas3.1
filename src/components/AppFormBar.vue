<template>
  <q-bar class="bg-secondary text-white">
    <div class="text-weight-bold">{{title}}</div>
    <q-space />
    <q-btn dense flat icon="close" @click="handler">
      <q-tooltip>Fechar</q-tooltip>
    </q-btn>
  </q-bar>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppFormBar',
  props: {
    title: String | Function,
    handler: Function
  }
})
</script>
