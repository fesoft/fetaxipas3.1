<template>
  <div :class="class">
    <q-file ref="input" v-bind="$attrs" name="file"  rounded standout
      no-error-icon hide-bottom-space unmasked-value max-file-size="1000000"
      hint="Documento com até 1MB" accept=".pdf, .zip, .xml, .ofx, .jpg" v-model="model" :label="label" :readonly="readonly"
      :disable="disable" :class="class" :filter="checkFileSize" @update:model-value="input" @rejected="onRejected">
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
      <template v-slot:append>
        <q-icon v-if="model" name="cancel" @click.stop.prevent="onClear" class="cursor-pointer" />
      </template>
    </q-file>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'AppFile',
  inheritAttrs: false,
  emits: ['update:model-value', 'rejected'],
  props: {
    label: String,
    class: String,
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
    modelValue: Object,
  },
  data: () => {
    return {
      model: undefined,
      dataBase64: '',
      type: ''
    }
  },
  methods: {
    getBase64(file) {
      var reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort();
          reject(new DOMException("Problem parsing input file."));
        };
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    },
    checkFileSize(files) {
      return files.filter(file => file.size < 1000000)
    },
    applyValue(modelValue) {
      this.dataBase64 = modelValue
    },
    /*input(event) {
      this.getBase64(this.model).then((file) => {
        this.dataBase64 = file;
        this.$emit('update:model-value', this.dataBase64);
      })
    },
    */
    input(event) {
      this.$emit('update:model-value', this.model);
    },
    onClear() {
      this.model = null;
      this.dataBase64 = null;
      this.$emit('update:model-value', this.model);
      this.$emit('clear', '');
    },
    onRejected(rejectedEntries) {
      this.$refs.input.error_message = 'Erro'
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
  mounted() {
    if (this.modelValue !== undefined) {
      this.applyValue(this.modelValue)
    }
  }
}
)
</script>
