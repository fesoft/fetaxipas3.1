<template>
  <q-bar>
    <q-space />
    <div class="text-weight-bold">
      {{title}}
    </div>
    <q-space />
  </q-bar>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppFormSection',
  props: {
    title: String
  }
})
</script>
