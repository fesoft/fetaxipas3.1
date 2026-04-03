<template>
  <q-input
  ref="input"
  rounded
  standout
  no-error-icon
  hide-bottom-space
  v-model="model"
  :label="label"
  :input-class="inputClass"
  :rules="rules"
  :readonly="readonly"
  :disable="disable"
  :class="class"
  v-bind="attrs"
  @update:model-value = "$emit('update:model-value', value)"
  >
</q-input>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppMoney',
  inheritAttrs: false,
  emits: [ 'update:model-value' ],
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
          let negative = modelValue.substring(0,1) == '-' ? true : false;
          let onlyNumbers = modelValue.replace(/\D/gi, '') || '0'
          let int = parseInt(onlyNumbers)
          let decimal = int / Math.pow(10, this.precision)
          decimal = negative ? decimal * -1 : decimal;
          this.value = decimal
        }
    },
    rules() {
      let ret = [];
      if(this.required && !this.disable){
          ret.push( val => !(val == '0,00') || '')
      }
      return ret;
    },
    attrs() {
      const { rules, ...attrs } = this.$attrs;
      return attrs;
    },
  },
})
</script>
