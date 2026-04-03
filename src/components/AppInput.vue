<template>
  <q-input ref="input" v-bind="$attrs" rounded standout
    no-error-icon hide-bottom-space unmasked-value v-model="model" :label="label" :readonly="readonly" :rules="rules"
    :type="type == 'password' ? (isPassword ? 'password' : 'text') : type" :hint="hint" :autofocus="autofocus"
    :disable="disable" :input-class="inputClass" :error="!isValid" :class="class" :placeholder="placeholder"
    @update:model-value="input" @blur="blur">
    <template v-slot:append>
      <q-icon v-if="model && clearable" name="cancel" @click.stop="onClear" class="cursor-pointer" />
      <q-icon v-if="type == 'password'" :name="isPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
        @click="isPassword = !isPassword" />
    </template>

  </q-input>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppInput',
  inheritAttrs: false,
  emits: ['update:model-value', 'blur', 'clear'],
  props: {
    label: String,
    type: {
      type: String,
      default: () => 'text'
    },
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
      isPassword: true,
    }
  },
  methods: {
    applyValue(modelValue) {
      if (this.type == 'email') {
        this.model = modelValue?.toLowerCase()
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
    onClear() {
      this.model = null;
      this.$emit('update:model-value', this.model);
      this.$emit('clear', '');
    },
    validate() {
      return this.$refs.input.validate()
    },
    resetValidation() {
      return this.$refs.input.resetValidation()
    },
  },
  watch: {
    modelValue(modelValue) {
      this.applyValue(modelValue)
    },
  },
  computed: {
    rules() {
      let ret = [];
      if (this.required && !this.disable) {
        if (this.type == 'date') {
          ret.push(val => !!val || '')
          ret.push(testPattern.date || '')
        } else {
          if (this.type == 'money') {
            ret.push(val => !val.includes('0,00', '', undefined) || '')
          } else {
            ret.push(val => !!val || '')
          }
        }
        if (this.minlength > 0 && this.model.length > 0) {
          ret.push(val => val.length >= this.minlength || `Mínimo ${this.minlength} caracteres`)
        }
      } else {
        if (this.type == 'date' && this.modelValue) {
          ret.push(testPattern.date || '')
        }
      }

      if (this.maxlength > 0 && this.modelValue) {
        ret.push(val => val.length <= this.maxlength || `Máximo ${this.maxlength} caracteres`)
      }
      if (this.type == 'email' && this.modelValue) {
        ret.push(val => ((val.indexOf('@') > 1)) || 'Email inválido')
      }
      return ret;
    },
    attrs() {
      const { rules, ...attrs } = this.$attrs;
      return attrs;
    },
  },
  mounted() {
    if (this.modelValue !== undefined) {
      this.applyValue(this.modelValue)
    }
  }
}
)
</script>

<style scoped>
:deep(.app-input) .q-field--focused .q-field__inner {
  background-color: rgba(128, 128, 128, 0.15) !important;
}
</style>

