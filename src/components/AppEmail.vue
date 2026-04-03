<template>
  <q-input
    ref="input"
    v-bind="$attrs"
    rounded
    standout
    no-error-icon
    hide-bottom-space
    unmasked-value
    v-model="internalValue"
    :label="label"
    :readonly="readonly"    
    type="text"
    :autofocus="autofocus"
    :disable="disable"
    :input-class="inputClass"
    :error="!isValid"
    :class="class"
    :rules="rules"
    :placeholder="placeholder || hintText"
    @update:model-value="handleInput"
    @blur="handleBlur"   
  >
    <template v-slot:append>
      <q-icon
        v-if="internalValue && clearable && !readonly"
        name="cancel"
        @click.stop="onClear"
        class="cursor-pointer"
      />
    </template>
  </q-input>
</template>

<script>
import { defineComponent } from 'vue'
import AppInput from './AppInput.vue'

export default defineComponent({
  name: 'AppEmail',
  inheritAttrs: false,
  components: {
    AppInput
  },
  props: {
    label: {
      type: String,
      default: 'E-mails'
    },
    hint: String,
    placeholder: String,
    inputClass: String,
    minEmails: {
      type: Number,
      default: 1
    },
    maxEmails: {
      type: Number,
      default: 5
    },
    readonly: Boolean,
    autofocus: Boolean,
    class: String,
    required: {
      type: Boolean,
      default: () => false
    },
    clearable: {
      type: Boolean,
      default: () => true
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
      type: String,
      default: ''
    },
  },
  data: () => ({
    internalValue: '',
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    lastValidationError: null
  }),
  computed: {
    hintText() {
      let hint = this.hint || ''
      if (!hint) {
        hint = `Insira até ${this.maxEmails} e-mails separados por vírgula`
      }
      return hint
    },
    rules() {
      const rules = []

      // Regra de obrigatoriedade
      if (this.required && !this.disable) {
        rules.push(val => !!val || 'Campo obrigatório')
      }

      // Regra de validação de e-mails
      if (!this.disable) {
        rules.push(val => {
          const validationResult = this.validateEmailList(val)
          return validationResult === true || validationResult
        })
      }

      return rules
    },    
  },
  methods: {
    applyValue(modelValue) {
      this.internalValue = modelValue || ''
    },

    handleInput(value) {
      this.internalValue = value
      const emails = this.parseEmails(value)
      const validatedEmails = emails.filter(email => this.emailRegex.test(email))
      const result = validatedEmails.join(', ')
      this.$emit('update:model-value', result)
      this.$emit('input', result)
    },

    handleBlur() {
      const emails = this.parseEmails(this.internalValue)
      const validatedEmails = emails.filter(email => this.emailRegex.test(email))
      const result = validatedEmails.join(', ')
      this.internalValue = result // Limpa a entrada após o blur
      this.$emit('update:model-value', result)
      this.$emit('blur', result)
    },

    onClear() {
      this.internalValue = ''
      this.$emit('update:model-value', '')
      this.$emit('clear', '')
    },

    validate() {
      return this.$refs.input?.validate() || false
    },

    resetValidation() {
      return this.$refs.input?.resetValidation()
    },

    parseEmails(value) {
      if (!value || typeof value !== 'string') return []

      return value
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0)
    },

    validateEmailList(emailString) {
      // Se não houver valor e não for obrigatório, é válido
      if (!emailString && !this.required) {
        return true
      }

      // Se for obrigatório e não houver valor, retorna erro
      if (this.required && !emailString) {
        return 'Campo obrigatório'
      }

      const emails = this.parseEmails(emailString)

      // Verifica se não há e-mails quando é obrigatório
      if (this.required && emails.length === 0) {
        return 'Pelo menos um e-mail é necessário'
      }

      // Verifica se não excede o número máximo de e-mails
      if (emails.length > this.maxEmails) {
        return `Máximo de ${this.maxEmails} e-mails permitidos (${emails.length} inseridos)`
      }

      // Verifica se atende ao número mínimo de e-mails
      if (this.required && emails.length < this.minEmails) {
        return `Mínimo de ${this.minEmails} e-mail(s) necessário(s) (${emails.length} inseridos)`
      }

      // Valida cada e-mail individualmente
      const invalidEmails = []
      const duplicateEmails = []
      const uniqueEmails = new Set()

      emails.forEach((email, index) => {
        // Valida formato do e-mail
        if (!this.emailRegex.test(email)) {
          invalidEmails.push(`"${email}"`)
        }

        // Verifica duplicatas (case insensitive)
        const emailLower = email.toLowerCase()
        if (uniqueEmails.has(emailLower)) {
          duplicateEmails.push(`"${email}"`)
        } else {
          uniqueEmails.add(emailLower)
        }
      })

      // Construir mensagens de erro
      const errors = []

      if (invalidEmails.length > 0) {
        errors.push(`E-mail(s) inválido(s): ${invalidEmails.join(', ')}`)
      }

      if (duplicateEmails.length > 0) {
        errors.push(`E-mail(s) duplicado(s): ${duplicateEmails.join(', ')}`)
      }

      if (errors.length > 0) {
        return errors.join('; ')
      }

      return true
    }
  },
  watch: {
    modelValue(newValue) {
      if (newValue !== this.internalValue) {
        this.applyValue(newValue)
      }
    },
  },
  mounted() {
    if (this.modelValue !== undefined) {
      this.applyValue(this.modelValue)
    }
  }
})
</script>
