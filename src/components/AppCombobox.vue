<template>
  <q-input
  v-if="options?.length === 0 && inputMode"
  ref="appInput"
  v-bind="$attrs"
  rounded
  standout
  no-error-icon
  hide-bottom-space
  unmasked-value
  v-model="model"
  :label="label"
  :readonly="readonly"
  :autofocus="autofocus"
  :disable="disable"
  :rules="aRules"
  :class="class"
  @update:model-value="$emit('update:model-value', model)"
  >
</q-input>
  <q-select v-if="inputMode ? !(options?.length === 0) : true" ref="appSelect" use-input  options-dense  rounded  standout
    hide-bottom-space emit-value map-options input-debounce="0" no-error-icon :multiple="multiple"
    :use-chips="multiple" :autofocus="autofocus" :options="optionsData" :label="label" :readonly="readonly"
    :disable="disable" :rules="aRules" :option-disable="optionDisable" :class="class" :maxlength="maxlength"
    :display-value="getDisplayValue()" v-model="model" @update:model-value="$emit('update:model-value', model)"
    @new-value="newValue" @filter="filterFn" @keydown="selectOption">
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">Nenhum resultado</q-item-section>
      </q-item>
    </template>

    <template v-if="multiple ? model.length > 0 : model" v-slot:append>
      <q-icon v-show="!readonly && clearable" name="cancel" @click.stop="clearValue" class="cursor-pointer" />
    </template>

    <template v-slot:option="{ itemProps, opt }">
      <q-item v-bind="itemProps">
        <q-item-section>
          <q-item-label>{{ opt.label }}</q-item-label>
        </q-item-section>
        <q-item-section side v-show="displayValue">
          <span v-if="displayValue" v-html="opt.value"></span>
        </q-item-section>
      </q-item>
    </template>

  </q-select>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppCombobox',
  data() {
    return {
      optionsData: [],
      model: this.multiple ? [] : ''
    }
  },
  inheritAttrs: false,
  emits: ['update:model-value', 'new-value', 'filter', 'keydown', 'clear'],
  props: {
    label: String,
    maxlength: Number | String,
    readonly: Boolean,
    disable: Boolean,
    autofocus: Boolean,
    class: String,
    multiple: {
      type: Boolean,
      default: () => false
    },
    cbxNewValueInput: {
      type: Boolean,
      default: () => false
    },
    inputMode: {
      type: Boolean,
      default: () => false
    },
    clearable: {
      type: Boolean,
      default: () => true
    },
    displayOptionValue: {
      type: Boolean,
      default: () => false
    },
    displayValue: {
      type: Boolean,
      default: () => true
    },
    required: {
      type: Boolean,
      default: () => false
    },
    inputType: {
      type: String,
      default: () => 'text'
    },
    modelValue: {
      required: true
    },
    options: Array,
  },
  methods: {
    getDisplayValue() {
      if (this.model && this.$refs.appSelect) {
        if (this.displayOptionValue) {
          return this.modelValue
        } else {
          return this.$refs.appSelect.getOptionLabel()
        }
      }
    },
    optionDisable(item) {
      return item.cannotSelect === undefined ? false : (item.cannotSelect == 'true' ? true : false)
    },
    validate() {
      return this.$refs.appSelect.validate()
    },
    resetValidation() {
      return this.$refs.appSelect.resetValidation()
    },
    newValue(inputValue, done) {
      if (this.cbxNewValueInput) {
        if (this.inputType == 'number') {
          if (!isNaN(inputValue)) done(inputValue);
        } else {
          done(inputValue)
        }
      }
    },
    selectOption(e) {
      //tecla tab
      if (e.keyCode == 9) {
        if (this.optionsData?.length === 1) {
          this.$refs.appSelect.toggleOption(this.optionsData[0])
          this.optionsData = this.options;
        }
      }
    },
    /**
    * @param {*} value
    */
    applyValue(modelValue) {
      if (!this.multiple) {
        this.model = modelValue
        return
      }
      if (this.modelValue == undefined) {
        this.model = []
      } else if (Array.isArray(modelValue)) {
        this.model = modelValue
      }
    },
    /**
    */
    clearValue() {
      this.model = this.multiple ? [] : ''
      this.$emit('update:model-value', this.model);
      this.$emit('clear', '');
    },
    filterFn(val, update, abort) {
      update(() => {
        // Função para remover acentos
        const removeAccents = (str) => {
          return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
        }

        const needle = removeAccents(val)
        if (this.options) {
          if (Number(needle) > 0) {
            this.optionsData = this.options.filter(v => v.value == needle)
          }
          else {
            this.optionsData = this.options.filter(v => removeAccents(v.label).includes(needle))
          }
        }
      })
    }
  },
  watch: {
    options(options) {
      this.optionsData = options
    },
    modelValue(modelValue) {
      this.applyValue(modelValue)
    },
  },
  computed: {
    rules () {
      let ret = [];
      if(this.required && !this.disable){
         ret.push(val => !!val || '')

         if(this.minlength > 0 && this.model.length > 0) {
          ret.push(val =>  val.length >= this.minlength || `Mínimo ${this.minlength} caracteres`)
        }
      }
      if(this.maxlength > 0 && this.modelValue) {
        ret.push(val => val.length <= this.maxlength || `Máximo ${this.maxlength} caracteres`)
      }
      return ret;
    },
    aRules() {
      let aRules = []
      if (this.required) {
        if (this.multiple) {
          aRules.push(val => val.length > 0 || '')
        } else {
          aRules.push(val => !!val || '')
        }
      }
      return aRules
    },

  },
  mounted() {
    this.optionsData = this.options;
    if (this.modelValue !== undefined) {
      this.applyValue(this.modelValue)
    }
  }
}
)
</script>
