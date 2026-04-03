<template>
  <q-input
  ref="input"
  stack-label
  no-error-icon
  hide-bottom-space
  unmasked-value
  v-model="model"
  mask="###.###.###-##"
  :label="label"
  :readonly="readonly"
  :rules="aRules"
  :hint="hint"
  :autofocus="autofocus"
  :disable="disable"
  :error="!isValid"
  :class="class"
  @update:model-value="input"
  @blur="blur"
  >
</q-input>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppInputCpf',
  inheritAttrs: false,
  props: {
    label: String,
    type: String,
    hint: String,
    placeholder: String,
    inputClass: String,
    minlength: Number | String,
    maxlength: Number | String,
    readonly: Boolean,
    autofocus: Boolean,
    class: String,
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
    modelValue: {
      required: true
    },
  },
  data: () => {
    return {
      model: '',
    }
  },
  methods: {
    validaCpf (cpf) {
      cpf = cpf.replace(/[^\d]+/g, '')
      var ttcaracters = cpf.length

      if (cpf === '') return false
      if (ttcaracters !== 11 || cpf === '00000000000' || cpf === '11111111111' || cpf === '22222222222' || cpf === '33333333333' || cpf === '44444444444' || cpf === '55555555555' || cpf === '66666666666' || cpf === '77777777777' || cpf === '88888888888' || cpf === '99999999999') return false
      if (ttcaracters !== 11 || /([0]{11})|([1]{11})|([2]{11})|([3]{11})|([4]{11})|([5]{11})|([6]{11})|([7]{11})|([8]{11})|([9]{11})/.test(cpf)) return false

      const m1 = Array.from({ length: 11 }, (k, v) => v)
      .reverse()
      .slice(0, 9)
      const m2 = Array.from({ length: 12 }, (k, v) => v)
      .reverse()
      .slice(0, 10)

      let tempCpf
      let soma
      let resto
      let digito

      tempCpf = cpf.substring(0, 9)
      soma = 0

      for (let i = 0; i < 9; i++) soma += parseInt(tempCpf[i].toString()) * m1[i]

      resto = soma % 11
      resto = resto >= 2 ? 11 - resto : 0

      digito = resto.toString()
      tempCpf = tempCpf + digito

      soma = 0
      for (let i = 0; i < 10; i++) soma += parseInt(tempCpf[i].toString()) * m2[i]

      resto = soma % 11
      resto = resto >= 2 ? 11 - resto : 0

      digito = digito + resto.toString()

      return cpf.endsWith(digito)
    },
    applyValue (modelValue) {
      this.model = modelValue
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
    },

  },
  watch: {
    modelValue (modelValue) {
      this.applyValue(modelValue)
    },
  },
  computed: {
    aRules () {
      let ret = [];
      if(!this.disable){
        ret.push(val => val ? (this.validaCpf(val) || 'Cpf inválido') : true)
      }
      return ret;
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
