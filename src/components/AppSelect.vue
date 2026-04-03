<template>
  <q-select
  ref="input"
  v-bind="$attrs"
  rounded
  standout
  options-dense
  hide-bottom-space
  emit-value
  map-options
  input-debounce="0"
  no-error-icon
  :rules="aRules"
  :autofocus="autofocus"
  :options="options"
  :label="label"
  :readonly="readonly"
  :disable="disable"
  v-model="model"
  @update:model-value="input"
  :class="class"
  :style="style"
  >
</q-select>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppSelect',
  inheritAttrs: false,
  emits: [ 'update:model-value', 'blur', 'clear' ],
  props: {
    label: String,
    readonly: Boolean,
    disable: Boolean,
    autofocus: Boolean,
    options: Array,
    class: String,
    style: {
      type: String,
      default: () => 'width: 100'
    },
    required: {
      type: Boolean,
      default: () => false
    },
    modelValue: {
      required: true
    }
  },
  data: () => {
    return {
      model: ''
    }
  },
  methods: {
    applyValue (modelValue) {
      if(this.type == 'email'){
        this.model = modelValue.toLowerCase()
      } else {
        this.model = modelValue
      }
    },
    input(event) {
      this.$emit('update:model-value', this.model);
    },
    blur(event) {
      this.$emit('blur', this.model);
    },
    onClear(){
      this.model = null;
      this.$emit('update:model-value', this.model);
      this.$emit('clear', '');
    },
    validate () {
      return this.$refs.input.validate()
    },
    resetValidation () {
      return this.$refs.input.resetValidation()
    }
  },
  watch: {
    modelValue (modelValue) {
      this.applyValue(modelValue)
    },
  },
  computed: {
    aRules() {
      let aRules = []
      if(this.required){
          aRules.push(val => !!val || '')
      }
      return aRules
    }
  },
  mounted() {
    if(this.modelValue !== undefined) {
      this.applyValue(this.modelValue)
    }
  }
}
)
</script>
