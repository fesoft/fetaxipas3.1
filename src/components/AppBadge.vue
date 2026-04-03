<template>
  <q-badge :color="color" :label="value"></q-badge>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppDate',
  props: {
    color: String,
    value: String,
  }
}
)
</script>
