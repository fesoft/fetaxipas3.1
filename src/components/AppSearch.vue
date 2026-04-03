<template>
  <q-input
   v-bind="attrs"
  dense
  rounded
  standout
  clearable
  debounce="500"
  hide-bottom-space
  v-model="model"
  placeholder="Pesquisar..."
  @update:model-value="input"
  style="width: 150px;"
  >
  <template v-slot:append> <q-icon name="search" /></template>
</q-input>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppSearch',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      label: String,
    }
  },
  data: () => {
    return {
      model: '',
    }
  },
  computed: {
    attrs() {
      const { ...attrs } = this.$attrs;
      return attrs;
    },
  },
  methods: {
    applyValue (value) {
      this.model = value
    },
    input(event) {
      this.$emit('update:model-value', this.model);
    },
  },
  watch: {
    value (modelValue) {
      this.applyValue(modelValue)
    },
  },
  mounted () {
    this.applyValue(this.modelValue)
  }
}
)
</script>
