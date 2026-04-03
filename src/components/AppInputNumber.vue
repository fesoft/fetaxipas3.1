<template>
  <q-input
  ref="input"
  stack-label
  no-error-icon
  hide-bottom-space
  v-model="model"
  :label="label"
  :clearable="clearable"
  :readonly="readonly"
  :disable="disable"
  :rules="rules"
  :hint="hint"
  :autofocus="autofocus"
  :error="!isValid"
  :error-message="errorMessage"
  @update:model-value="input"
  :class="class"
  v-bind="attrs"
  >
</q-input>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppInputNumber',
  inheritAttrs: false,
  props: {
    label: String,
    type: String,
    hint: String,
    errorMessage: String,
    inputClass: String,
    minlength: Number | String,
    maxlength: Number | String,
    readonly: Boolean,
    disable: {
      type: Boolean,
      default: () => false
    },
    autofocus: Boolean,
    required: {
      type: Boolean,
      default: () => false
    },
    clearable: {
      type: Boolean,
      default: () => false
    },
    disable: {
      type: Boolean,
      default: () => false
    },
    isValid: {
      type: Boolean,
      default: () => true
    },
    class: String,
    modelValue: {
      required: true
    },
  },
  data: () => {
    return {
      model: '',
    }
  },
  computed: {
    attrs() {
      const { rules, ...attrs } = this.$attrs;
      return attrs;
    },
    rules() {
      let rules = [] ;
      if(!(this.model === undefined || this.model === null || this.disable)) {
        if(this.required){
          rules.push(val => !!val || '')
        }
        if(this.minlength > 0 && this.model.length > 0) {
          rules.push(val =>  val.length >= this.minlength || `Mínimo ${this.minlength} caracteres`)
        }
        if(this.maxlength > 0) {
          rules.push(val => val.length <= this.maxlength  || `Máximo ${this.maxlength} caracteres`)
        }
        rules.push(v =>  v.length > 0 ? /^[\d]+$/.test(v) || `Digite somente números` : true)
      }
      return rules
    }
  },
  methods: {
    applyValue (modelValue) {
      this.model = modelValue
    },
    input(event) {
      if(!isNaN(this.model))
      this.$emit('update:model-value', this.model);
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
  mounted() {
    if(this.modelValue !== undefined) {
      this.applyValue(this.modelValue)
    }
  }
}
)
</script>
