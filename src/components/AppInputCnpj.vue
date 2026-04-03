<template>
  <q-input
  ref="input"
  stack-label
  no-error-icon
  hide-bottom-space
  unmasked-value
  v-model="model"
  mask="##.###.###/####-##"
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
  name: 'AppInputCnpj',
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
    validaCnpj(cnpj) {
      cnpj = cnpj.replace(/[^\d]+/g,'');

      if(cnpj == '') return false;

      if (cnpj.length != 14)
      return false;

      // Elimina CNPJs invalidos conhecidos
      if (cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999")
      return false;

      // Valida DVs
      let tamanho = cnpj.length - 2
      let numeros = cnpj.substring(0,tamanho);
      let digitos = cnpj.substring(tamanho);
      let soma = 0;
      let pos = tamanho - 7;
      let i = 0;
      for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
        pos = 9;
      }
      let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado != digitos.charAt(0))
      return false;

      tamanho = tamanho + 1;
      numeros = cnpj.substring(0,tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
        pos = 9;
      }
      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado != digitos.charAt(1))
      return false;

      return true;
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
        ret.push(val => val ? (this.validaCnpj(val) || 'CNPJ inválido') : true)
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
