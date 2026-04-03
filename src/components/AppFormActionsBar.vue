<template>
  <q-card-actions class="justify-center">
    <q-btn
    v-if="readonly === false"
    v-model="submit"
    size="sm"
    label="Salvar"
    color="positive"
    placeholder
    rounded
    @click="$emit('save')"
    ></q-btn>
    <q-btn
    size="sm"
    dense
    color="primary"
    label="Fechar"
    rounded
    v-close-popup
    ></q-btn>
  </q-card-actions>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppFormActionsBar',
  props: {
    readonly: Boolean,
    submit: Boolean
  }
})
</script>
