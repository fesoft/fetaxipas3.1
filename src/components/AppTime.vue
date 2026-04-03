<template>
  <q-input
  ref="input"
  rounded
  standout
  no-error-icon
  hide-bottom-space
  v-model="model"
  :label="label"
  :readonly="readonly"
  :rules="aRules"
  mask="##:##"
  @update:model-value="input"
  :disable="disable"
  :input-class="inputClass"
  :class="class"
  >
  <template v-slot:append>
    <q-icon v-if="!readonly"  name="access_time" class="cursor-pointer">
      <q-popup-proxy transition-show="scale" transition-hide="scale">
        <q-time v-model="model" @update:model-value="input">
          <div class="row items-center justify-end">
            <q-btn v-close-popup label="Fechar" color="primary" flat />
          </div>
        </q-time>
      </q-popup-proxy>
    </q-icon>
  </template>
</q-input>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppTime',
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
    applyValue (modelValue) {
      this.model = modelValue
    },
    input(event) {
      this.$emit('update:model-value', this.model);
    },
    validate () {
      return this.$refs.input.validate()
    },
    resetValidation () {
      return this.$refs.input.resetValidation()
    }
  },
  watch: {
    modelValue (modelValue) {
      this.applyValue(modelValue)
    },
  },
  computed: {
    aRules() {
      let ret = [];
      if(this.required && !this.disable){
        ret.push(val => !!val || '')
      }
      ret.push(v => v ? /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(v) : true || '')
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
