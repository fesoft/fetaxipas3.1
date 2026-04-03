<template>
  <q-input
  ref="input"
  stack-label
  no-error-icon
  hide-bottom-space
  v-model="model"
  :label="label"
  :input-class="inputClass"
  :rules="aRules"
  :readonly="readonly"
  :disable="disable"
  :class="class"
  @update:model-value = "$emit('update:model-value', value)"
  >
</q-input>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppMoney',
  inheritAttrs: false,
  props: {
    label: String,
    type: String,
    hint: String,
    class: String,
    inputClass: String,
    minlength: Number | String,
    maxlength: Number | String,
    readonly: Boolean,
    autofocus: Boolean,
    required: Boolean,
    disable: {
      type: Boolean,
      default: () => false
    },
    precision: {
      type: Number,
      default: () => 2
    },
    inputClass: {
      type: String,
      default: () =>'text-left'
    },
    modelValue: {
      required: true
    },
  },
  data () {
    return {
      value: '',
      //precision: 2,
      style: 'currency',
      currency: 'BRL',
      locale: undefined
    }
  },
  methods: {
    generateMeta () {
      this.formatter = new Intl.NumberFormat(this.finalLocale + '-u-nu-latn', {
        //style: this.style,
        currency: this.currency,
        minimumFractionDigits: this.precision,
        maximumFractionDigits: this.precision
      })
    },
    validate () {
      return this.$refs.input.validate()
    },
    resetValidation () {
      return this.$refs.input.resetValidation()
    }
  },
  watch: {
    meta: {
      immediate: true,
      handler () {
        this.generateMeta()
      }
    }
  },
  computed: {
    defaultLocale () {
      return 'pt-BR' || navigator.locale
    },
    finalLocale () {
      return this.locale || this.defaultLocale
    },
    meta () {
      return [ this.finalLocale, this.precision, this.style, this.currency ]
    },
    model: {
      get () { return this.formatter.format(this.modelValue || 0) },
      set (modelValue) {
        let onlyNumbers = modelValue.replace(/\D/gi, '') || '0'
        let int = parseInt(onlyNumbers)
        let decimal = int / Math.pow(10, this.precision)
        this.value = decimal
        //this.$emit('update:model-value', this.value)
      }
    },
    aRules() {
      let ret = [];
      if(this.required && !this.disable){
          ret.push( val => !(val == '0,00') || '')
      }
      return ret;
    }
  },
})
</script>
