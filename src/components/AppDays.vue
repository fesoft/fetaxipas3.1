<template>
  <q-date
  multiple
  mask="DD.MM.YYYY"
  v-model="model"
  :readonly="readonly"
  :disable="disable"
  @update:model-value="input"
  >
</q-date>
</template>

<script>
import { defineComponent } from 'vue'
import { clone } from 'src/modules/utils.js'
import { date } from 'quasar'

export default defineComponent({
  name: 'AppDays',
  props: {
    label: String,
    readonly: Boolean,
    autofocus: Boolean,
    clearable: {
      type: Boolean,
      default: () => false
    },
    required: {
      type: Boolean,
      default: () => false
    },
    disable: {
      type: Boolean,
      default: () => false
    },
    modelValue: {
      required: true
    },
  },
  data () {
    return {
      isValid: true,
      model: []
    }
  },
  methods: {
    validate () {
      return this.$refs.input.validate()
    },
    resetValidation () {
      return this.$refs.input.resetValidation()
    },
    onClear(){
      this.model = null;
      this.$emit('update:model-value', this.model);
      this.$emit('clear', '');
    },
    input(event) {
      let value = this.model ? this.model.filter(item => item.length > 0).sort() : this.model;
      this.$emit('update:model-value', value.join(','));
    },
  },
  watch: {
    modelValue (value) {
      let v = String(value)
      this.model = v.split(',')
    }
  },
  computed: {
    defaultYearMonth () {
      return date.formatDate(new Date(), 'YYYY/MM')
    },
    defaultYear(){
      return this.defaultYearMonth.substr(0,4)
    },
    defaultMonth(){
      return this.defaultYearMonth.substr(5,2)
    },
  },
  mounted() {
    if(this.modelValue.length > 0) this.model = this.modelValue.split(',')
  }
}
)
</script>
