<template>
  <q-select
  ref="appMultiSelect"
 rounded
 standout
  options-dense
  clearable
  hide-bottom-space
  emit-value
  map-options
  multiple
  no-error-icon
  :autofocus="autofocus"
  :label="label"
  :readonly="readonly"
  :options="options"
  :rules="rules"
  v-model="model"
  @update:model-value="$emit('update:model-value', JSON.stringify(model))"
  >
</q-select>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppMultiselect',
  emits: [ 'update:model-value' ],
  data () {
    return {
      model: []
    }
  },
  props: {
    label: String,
    readonly: Boolean,
    autofocus: Boolean,
    required:{
      type: Boolean,
      default: () => false
    },
    modelValue: {
      required: true
    },
    options: Array,
  },
  methods: {
    validate () {
      return this.$refs.appSelect.validate()
    },
    resetValidation () {
      return this.$refs.appSelect.resetValidation()
    },
    /**
    * @param {*} modelValue
    */
    applymodelValue (modelValue) {
      if(modelValue == '' || modelValue == undefined){
        modelValue = []
      }
      if (Array.isArray(modelValue)) {
        this.model = modelValue
      }else {
        this.model = JSON.parse(modelValue)
      }
    },
  },
  computed: {
    rules() {
      let aRules = []
      if(this.required){
        aRules.push(val => val.length > 0 || '')
      }
      return aRules
    }
  },
  watch: {
    modelValue (modelValue) {
      this.applymodelValue(modelValue)
    },
  },
  mounted () {
    if(this.modelValue)
    this.applymodelValue(JSON.parse(this.modelValue))
  }
}
)
</script>
