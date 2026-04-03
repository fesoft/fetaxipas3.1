<template>
  <q-select
  ref="appSelect"
  use-input
  options-dense
  stackLabel
  hide-bottom-space
  emit-value
  map-options
  input-debounce="0"
  no-error-icon
  :multiple="multiple"
  :use-chips="multiple"
  :autofocus="autofocus"
  :options="optionsData"
  :label="label"
  :readonly="readonly"
  :disable="disable"
  :rules="aRules"
  :option-disable="optionDisable"
  :class="class"
  :style="style"
  v-model="model"
  @update:model-value="$emit('update:model-value', model)"
  @new-value="newValue"
  @filter="filterFn"
  @keydown="selectOption"
  >
  <template v-slot:no-option>
    <q-item>
      <q-item-section class="text-grey">Nenhum resultado</q-item-section>
    </q-item>
  </template>

  <template v-if="multiple ? model.length > 0 : model" v-slot:append>
    <q-icon v-show="!readonly && clearable" name="cancel" @click.stop="clearValue" class="cursor-pointer" />
  </template>

  <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
    <q-item v-bind="itemProps">
      <q-item-section>
        <q-item-label v-html="opt.label" />
      </q-item-section>
      <q-item-section side>
        <q-item-label v-html="opt.value" />
      </q-item-section>
    </q-item>
  </template>

  <!--template v-slot:option="scope">
  <q-item
  v-bind="scope.itemProps"
  >
  <q-item-section>{{scope.opt.label}}</q-item-section>
  <q-item-section v-if="displayOptionValue" side>{{ scope.opt.value }}</q-item-section>
</q-item>
</template-->
</q-select>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppCombobox',
  data () {
    return {
      optionsData: [],
      model: this.multiple ? [] : ''
    }
  },
  inheritAttrs:false,
  props: {
    label: String,
    readonly: Boolean,
    disable: Boolean,
    autofocus: Boolean,
    class: String,
    style: String | Object,
    multiple:{
      type: Boolean,
      default: () => false
    },
    cbxNewValueInput:{
      type: Boolean,
      default: () => false
    },
    clearable:{
      type: Boolean,
      default: () => true
    },
    displayOptionValue:{
      type: Boolean,
      default: () => true
    },
    displayValue: String,
    required:{
      type: Boolean,
      default: () => false
    },
    inputType:{
      type: String,
      default: () => 'text'
    },
    modelValue: {
      required: true
    },
    options: Array,
  },
  methods: {
    optionDisable(item){
      return item.cannotSelect === undefined ? false : (item.cannotSelect == 'true' ? true : false)
    },
    validate () {
      return this.$refs.appSelect.validate()
    },
    resetValidation () {
      return this.$refs.appSelect.resetValidation()
    },
    newValue(inputValue, done){
      if(this.cbxNewValueInput){
        if(this.inputType == 'number'){
          if(!isNaN(inputValue)) done(inputValue);
        } else {
          done(inputValue)
        }
      }
    },
    selectOption(e) {
      //tecla tab
      if(e.keyCode == 9){
        if(this.optionsData.length === 1){
          this.$refs.appSelect.toggleOption(this.optionsData[0])
          this.optionsData = this.options;
        }
      }
    },
    /**
    * @param {*} value
    */
    applyValue (modelValue) {
      if (!this.multiple) {
        this.model = modelValue
        return
      }
      if(this.modelValue == undefined){
        this.model = []
      } else if (Array.isArray(modelValue)) {
        this.model = modelValue
      }
    },
    /**
    */
    clearValue () {
      this.model = this.multiple ? [] : ''
      this.$emit('update:model-value', this.model);
    },
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        //this.optionsData = this.options.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        if(this.options){
          if(Number(needle) > 0) {
            //this.optionsData = this.options.filter(v => v.value.indexOf(needle) > -1)
            this.optionsData = this.options.filter(v => v.value == needle)
          }
          else {
            this.optionsData = this.options.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
          }
        }
      })
    },
  },
  watch: {
    options (options) {
      this.optionsData = options
    },
    modelValue (modelValue) {
      this.applyValue(modelValue)
    },
  },
  computed: {
    aRules() {
      let aRules = []
      if(this.required){
        if(this.multiple){
          aRules.push(val => val.length > 0 || '')
        } else {
          aRules.push(val => !!val || '')
        }
      }
      return aRules
    }
  },
  mounted () {
    this.optionsData = this.options;
    if(this.modelValue !== undefined) {
      this.applyValue(this.modelValue)
    }
  }
}
)
</script>
