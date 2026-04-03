<template>
  <q-dialog
  ref="dialog"
  :persistent="persistent"
  v-model="model"
  @keydown="onKeyDown"
  >
  <q-card class="q-dialog-plugin" :style="dialogStyle">
    <q-form
    ref="myForm"
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
    @submit="onSubmit"
    @reset="onReset"
    >
    <app-form-bar :title="formTitle" :handler="hide"></app-form-bar>
    <div  style="max-height: 80vh" class="scroll">
      <q-card-section v-for="aba in aFields" :key="aba.name" class="row q-col-gutter-xs">
        <component v-show="aba.visible || aba.visible == undefined" v-if="aba.is !== 'q-separator'" :is="aba.is" :title="aba.label" class="col-12 q-mb-xs"></component>
        <component
        v-for="field in aba.fields.filter(item => item.visible === undefined || item.visible)"
        :key="field.name"
        :is="field.is"
        :ref="field.name"
        :value="field.model"
        :rules="field.rules || []"
        v-model="form[field.name]"
        :readonly="field.readonly || readonly"
        :options="field.options || options[field.name]"
        :disable="field.disable || disableField(field.name)"
        :label="getLabel(field)"
        v-bind="field"
        @update:model-value="formInput(field.name, form[field.name])"
        @blur="formBlur(field.name, form[field.name])"
        ></component>
      </q-card-section>

      <q-card-section v-show="showGridItems"  class="q-col-gutter-xs">
        <div v-for="(grid, index) in aGridItems" :key="index">
          <component
          :is="grid.is"
          v-bind="grid.props"
          :fk="form[primaryKey]"
          :parentRow="form"
          :options="options == undefined ? {} : options"
          :readonly="grid.readonly === undefined ? readonly : grid.readonly"
          :p-visible-columns="visibleColumnsItems"
          :rows="form.items[index] ? form.items[index].rows : []"
          >
        </component>
      </div>
    </q-card-section>

  </div>
  <q-separator />

  <q-card-actions v-if="buttons == undefined" align="center">
    <q-btn v-if="!readonly" type="submit" size="sm" label="Salvar F9" :disable="disable" color="positive" />
    <q-btn ref="btnReset" v-if="!readonly && action == 'edit'" color="primary" label="Novo" size="sm" @click="formReset"/>
    <q-btn color="primary" label="Sair" size="sm"  @click="onCancelClick" />
  </q-card-actions>

  <q-card-actions v-if="buttons && !readonly" align="center">
    <component
    v-for="button in buttons"
    :key="button.name"
    :is="button.is"
    :disable="disable"
    v-show="showButton[button.name] == undefined ? true : showButton[button.name]"
    v-bind="button"
    @click="handler(button.name)"
    >
  </component>
  <q-btn color="primary" label="Sair" size="sm"  @click="onCancelClick" />
</q-card-actions>

</q-form>
</q-card>

</q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import AppCrudItem from 'components/AppCrudItem.vue'
import AppInput from 'components/AppInput.vue'
import AppInputCpf from 'components/AppInputCpf.vue'
import AppInputCnpj from 'components/AppInputCnpj.vue'
import AppInputNumber from 'components/AppInputNumber.vue'
import AppDate from 'components/AppDate.vue'
import AppTime from 'components/AppTime.vue'
import AppSearch from 'components/AppSearch.vue'
import AppCombobox from 'components/AppCombobox.vue'
import AppMultiselect from 'components/AppMultiselect.vue'
import AppMoney from 'components/AppMoney.vue'
import { formMixin } from 'src/mixins/formMixin.js'
import { optionsMixin } from 'src/mixins/optionsMixin.js'
import { clone } from 'src/modules/utils.js'
import AppFormBar from 'components/AppFormBar.vue'
import AppSelect from 'components/AppSelect.vue'
import AppFormSection from 'components/AppFormSection.vue'
import _ from 'lodash'

export default defineComponent({
  name: 'AppFormDialog',
  components: {
    AppCrudItem,
    AppFormBar,
    AppInput,
    AppInputCpf,
    AppInputCnpj,
    AppInputNumber,
    AppDate,
    AppTime,
    AppMultiselect,
    AppMoney,
    AppCombobox,
    AppSelect,
    AppFormSection
  },
  mixins: [ formMixin, optionsMixin ],
  props: {
    id: Number | String,
    fk: Number | String,
    record: Object,
    parentRow: {
      type: Object,
      default: () => {}
    },
    persistent: {
      type: Boolean,
      default: () => false
    },
    noResetOnSave: Boolean,
    width: {
      type: Number,
      default: () => 600
    },
    dialogStyle: {
      type: String,
      default: () => 'width: 600px; max-width: 80vw;'
    },
    componentProps: Object
  },
  data: () => {
    return {
      showButton: {},
      scrollInfo: {},
      options: {},
      model: false
    }
  },
  methods: {
    getLabel(field){
      return field.required ? `${field.label}*` : field.label
    },
    formReset(){
      this.$refs.myForm.reset()
    },
    formInput(field, val){
      //
    },
    formBlur(field){
      //
    },
    disableField(field){
      return false
    },
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      if(!_.isEqual(this.form, this.formOld) && !this.readonly) {
        this.$q.dialog({
          title: 'Confirmação',
          message: `Sair sem salvar os dados?`,
          ok: 'Sim',
          cancel: 'Não',
          persistent: true
        })
        .onOk(() => {
          this.$refs.dialog.hide()
          //this.model = false
        })
      } else {
        this.$refs.dialog.hide()
        //this.model = false
      }
    },
    onCancelClick () {
      this.hide()
    }
  },
  created () {
    this.action = this.method;
    this.aFields = clone(this.fields);
    this.aGridItems = clone(this.gridItems);
    this.aFields[0].fields[0].autofocus = !this.$q.platform.is.mobile;
  }
})
</script>
