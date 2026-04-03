<template>
  <iframe
  v-if="type == 'application/pdf'"
  within-iframe-only
  type="application/pdf"
  width="100%"
  height="600"
  :src="model"
  frameborder="0"
  allowfullscreen>
</iframe>
<img v-else :src="model" width="100%"></img>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppPdfView',
  inheritAttrs: false,
  props: {
    modelValue: {
      required: true
    },
  },
  data: () => {
    return {
      model: '',
      type: ''
    }
  },
  methods: {
    applyValue (modelValue) {
      this.model = modelValue
      let t = this.model.split(';')
      t = t[0].split(':')
      this.type = t[1]
    }
  },
  watch: {
    modelValue (modelValue) {
      if(modelValue) this.applyValue(modelValue)
    },
  },
  mounted() {
    if(this.modelValue !== undefined) {
      this.applyValue(this.modelValue)
    }
  }
}
)
</script>
