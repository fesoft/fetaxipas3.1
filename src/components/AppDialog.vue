<template>
  <q-dialog
  ref="dialog"
  :persistent="persistent"
  @keydown.insert="formReset"
  @keydown.esc="hide">
  <q-card class="q-dialog-plugin" style="width: 400px; max-width: 80vw;">
    <q-form
    ref="myForm"
    autofocus
    @submit="onOKClick"
    >
    <app-form-bar :title="title" :handler="hide"></app-form-bar>
    <q-card-section class="row  q-col-gutter-xs">
      <component
      v-for="field in fields"
      :key="field.name"
      :is="field.is"
      :options="options[field.name]"
      v-model="form[field.name]"
      v-bind="field"
      ></component>
    </q-card-section>

    <q-separator />
    <q-card-actions align="center">
      <q-btn type="submit" size="sm" label="OK" color="positive" />
    </q-card-actions>
  </q-form>
</q-card>

</q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import AppFormBar from 'components/AppFormBar.vue'
import AppCombobox from 'components/AppCombobox.vue'
import AppDate from 'components/AppDate.vue'
import AppInput from 'components/AppInput.vue'

export default defineComponent({
  name: 'app-dialog',
  components: {
    AppFormBar,
    AppCombobox,
    AppDate,
    AppInput
  },
  props: {
    title: String,
    fields: Array,
    persistent: Boolean,
  },
  data: () => {
    return {
      submit: false,
      form: {},
      options: {},
    }
  },
  methods: {
    formReset(){
      this.$refs.myForm.reset()
    },
    inputForm(field, val){
      //
    },
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onOKClick () {
      this.$emit('ok', this.form);
      this.hide();
    },

  },
})
</script>
