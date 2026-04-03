<template>
  <q-card class="q-dialog-plugin">
    <q-form
    ref="myForm"
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
    @submit="$emit('submit')"
    @reset="$emit('reset')"
    >
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
        @blur="formBlur(field.name)"
        ></component>
      </q-card-section>

      <q-card-section v-show="showGridItems" class="q-col-gutter-xs">
        <div v-for="(grid, index) in aGridItems" :key="index">
          <template>
            <component
            :is="grid.is"
            v-bind="grid.props"
            :fk="form[primaryKey]"
            :parentRow="form"
            :readonly="grid.readonly === undefined ? readonly : grid.readonly"
            :p-visible-columns="visibleColumnsItems"
            :rows="form.items[index] ? form.items[index].rows : []"
            ></component>
          </template>
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
</template>

<script>
import { defineComponent } from 'vue'
import AppFormBar from 'components/AppFormBar.vue'
import AppInput from 'components/AppInput.vue'
import AppInputNumber from 'components/AppInputNumber.vue'
import AppDate from 'components/AppDate.vue'
import AppTime from 'components/AppTime.vue'
import AppSearch from 'components/AppSearch.vue'
import AppCombobox from 'components/AppCombobox.vue'
import AppSelect from 'components/AppSelect.vue'
import AppMultiselect from 'components/AppMultiselect.vue'
import AppMoney from 'components/AppMoney.vue'
import { formMixin } from 'src/mixins/formMixin.js'
import { optionsMixin } from 'src/mixins/optionsMixin.js'
import { clone } from 'src/modules/utils.js'

export default defineComponent({
  name: 'AppFormBase',
  props: {
    table: String,
    view: String,
    primaryKey: String,
    foreignKey: String,
    uniqueKey: String,
    fields: Array,
    gridItems: Array,
    buttons: Array,
    method: String,
    title: String,
    type: String,
    id: Number | String,
    form: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    },
    readonly: {
      type: Boolean,
      default: () => false
    },
    saveItems: Boolean,
    closeAfferSave: {
      type: Boolean,
      default: () => false
    }
  },
  components: {
    AppFormBar,
    AppInput,
    AppInputNumber,
    AppDate,
    AppTime,
    AppMultiselect,
    AppMoney,
    AppCombobox,
    AppSelect
  },
  dada: () => {
    return {

    }
  },
  // mixins: [ formMixin, optionsMixin ],
  methods: {
    getLabel(field){
      return field.required ? field.label + '*' : field.label
    },
    formBlur(){},
    disableField(field){
      return false
    },
  },
  watch: {
    data (value) {
      this.form = value
    },
  },
  created () {
    this.action = this.method;
    this.aFields = clone(this.fields);
    this.aGridItems = clone(this.gridItems);
    if(this.method == 'new') {
      this.onNew()
    };
    this.aFields[0].fields[0].autofocus = !this.$q.platform.is.mobile
  }
})
</script>
