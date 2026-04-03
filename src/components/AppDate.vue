<template>
  <q-input
  ref="input"
   rounded
  standout
  no-error-icon
  hide-bottom-space
  bottom-slots
  mask="##/##/####"
  v-model="model"
  :error="!isValid"
  :label="label"
  :readonly="readonly"
  :autofocus="autofocus"
  :disable="disable"
  :rules="rules"
  @update:model-value="input"
  @blur="onBlur"
  @keydown.enter="onBlur"
  v-bind="attrs"
  >
  <template v-slot:append>
    <q-icon v-if="!readonly" name="event" class="cursor-pointer">
      <q-popup-proxy ref="popup">
        <q-date
        today-btn
        :title="title"
        :subtitle="defaultYear"
        mask="DD/MM/YYYY"
        v-model="calendarModel"
        :default-year-month="defaultYearMonth"
        @update:model-value="input"
        :options="options"
        />
      </q-popup-proxy>
    </q-icon>
    <q-icon v-if="model && clearable" name="cancel" @click.stop="onClear" class="cursor-pointer" />
  </template>
</q-input>
</template>

<script>
import { defineComponent } from 'vue'
import { clone } from 'src/modules/utils.js'
import { date } from 'quasar'

export default defineComponent({
  name: 'AppDate',
  inheritAttrs: false,
  emits: [ 'update:model-value' ],
  props: {
    label: String,
    readonly: Boolean,
    autofocus: Boolean,
    options:Array|Function,
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
      model: ''
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
    onBlur(event) {
      let val = '';
      let value = clone(this.model);
      if(value){
        if (value.length > 2) {
          if(value.length === 3){
            val = value.substr(0, 2) + '/' + this.defaultMonth + '/' + this.defaultYear;
          } else if(value.length === 6){
            val = value.substr(0, 2)  + '/' + value.substr(3, 2) + '/' + this.defaultYear ;
          } else {
            val = value;
          }
        }
        let d = new Date(val.substr(6,4) + '/' + val.substr(3, 2) + '/' + val.substr(0, 2))
        this.model = date.formatDate(d, 'DD/MM/YYYY');
        this.$emit('update:model-value', this.model);
      }
    },
    input(event) {
      this.$emit('update:model-value', this.model);
    },
  },
  watch: {
    modelValue (value) {
      this.model = value
    },
  },
  computed: {
    title(){
      let aD = this.model.split('/');
      return this.model ?
      date.formatDate(new Date(aD[2], aD[1] - 1 , aD[0]), 'ddd, D MMMM') :
      date.formatDate(new Date(this.defaultYearMonth + '/01'), 'MMMM')
    },
    defaultYearMonth () {
      return date.formatDate(new Date(), 'YYYY/MM')
    },
    defaultYear(){
      return this.defaultYearMonth.substr(0,4)
    },
    defaultMonth(){
      return this.defaultYearMonth.substr(5,2)
    },
    calendarModel: {
      get: function () {
        return this.model || ''
      },
      set: function (value) {
        this.$refs.popup.hide();
        this.model = value;
        this.isValid = true;
      }
    },
    rules() {
      let ret = [];
      if(!this.disable){
        if(this.required){
          ret.push(val => !!val || '');
        }
        ret.push( v => v ? /(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/([12]\d{3})/.test(v) : true || '');
      }
      return ret;
    },
    attrs() {
      const { rules, type, ...attrs } = this.$attrs;
      return attrs;
    },
  },
  mounted() {
    if(this.modelValue !== undefined) {
      this.model = this.modelValue
    }
  }
}
)
</script>
