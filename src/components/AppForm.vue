<template>
  <q-page :padding="!$q.platform.is.mobile" class="docs-input row items-top justify-center">
    <div style="width: 600px; max-width: 100vw;">
      <q-form ref="myForm" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false"
        @submit="onSubmit" @reset="onReset" @validation-error="onValidateError">

        <q-card>
          <q-bar v-if="!$q.platform.is.mobile" class="bg-primary text-white rounded-top-bar">
            <div class="text-weight-bold justify-center">{{ formTitle }}</div>
          </q-bar>

          <q-card-section v-for="aba in aFields" :key="aba.name" class="row q-col-gutter-xs">
            <component v-show="aba.visible || aba.visible == undefined" v-if="aba.is !== 'q-separator'" :is="aba.is"
              :title="aba.label" class="col-12 q-mb-xs"></component>
            <component v-for="field in aba.fields.filter(item => item.visible === undefined || item.visible)"
              :key="field.name" v-bind="field" :is="field.is" :ref="field.name" :value="field.model"
              :rules="field.rules || []" v-model="form[field.name]" :readonly="field.readonly || readonly"
              :options="field.options || options[field.name]" :disable="field.disable || disableField(field.name)"
              :label="getLabel(field)" @update:model-value="formInput(field.name, form[field.name])"
              @blur="formBlur(field.name, form[field.name])" @update:raw-value="formRawValue(field.name, $event)">
            </component>
          </q-card-section>

          <q-card-section class="q-col-gutter-xs">
            <div v-for="(grid, index) in gridItems" :key="index">
              <component :is="grid.is" v-bind="grid.props" :fk="form[primaryKey]" :parentRow="form"
                :options="options == undefined ? {} : options"
                :readonly="grid.readonly === undefined ? readonly : grid.readonly"
                :p-visible-columns="visibleColumnsItems" :rows="form.items[index] ? form.items[index].rows : []">
              </component>
            </div>
          </q-card-section>

          <q-separator />
          <q-card-actions v-if="!buttons && !readonly" align="center">
            <q-btn rounded v-if="!readonly" type="submit" size="sm" label="Salvar" :disable="disable" color="positive" />
            <q-btn rounded v-if="!$q.platform.is.mobile" color="primary" label="Sair" size="sm" @click="onCancelClick" />
          </q-card-actions>

          <q-card-actions v-if="buttons && method !== 'view'" align="center">
            <component v-for="button in aButtons.filter(item => item.visible)" :key="button.name" :is="button.is"
              :disable="disable" v-show="showButton[button.name] == undefined ? true : showButton[button.name]"
              v-bind="button" rounded @click="handler(button.name)">
            </component>
          </q-card-actions>
        </q-card>

      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import AppFormBar from 'components/AppFormBar.vue'
import AppInput from 'components/AppInput.vue'
import AppInputCpf from 'components/AppInputCpf.vue'
import AppInputCnpj from 'components/AppInputCnpj.vue'
import AppInputNumber from 'components/AppInputNumber.vue'
import AppDate from 'components/AppDate.vue'
import AppTime from 'components/AppTime.vue'
import AppCombobox from 'components/AppCombobox.vue'
import AppSelect from 'components/AppSelect.vue'
import AppMultiselect from 'components/AppMultiselect.vue'
import AppMoney from 'components/AppMoney.vue'
import AppFormSection from 'components/AppFormSection.vue'
import { formMixin } from 'src/mixins/formMixin.js'
import { optionsMixin } from 'src/mixins/optionsMixin.js'
import { clone } from 'src/modules/utils.js'

export default defineComponent({
  name: 'AppForm',
  components: {
    AppFormBar,
    AppFormSection,
    AppInput,
    AppInputCpf,
    AppInputCnpj,
    AppInputNumber,
    AppDate,
    AppTime,
    AppMultiselect,
    AppMoney,
    AppCombobox,
    AppSelect
  },
  mixins: [formMixin, optionsMixin],
  data: () => {
    return {
      showButton: {},
      options: {},
      aButtons: []
    }
  },
  methods: {
    getLabel(field) {
      return field.required ? field.label + '*' : field.label
    },
    formBlur() { },
    formRawValue() { },
    disableField(field) {
      return false
    },
  },
  created() {
    this.formTitle = this.title
    this.action = this.method;
    this.aFields = clone(this.fields);
    this.aGridItems = clone(this.gridItems);
    if (this.method == 'new') {
      this.onNew()
    };
    this.aFields[0].fields[0].autofocus = !this.$q.platform.is.mobile
    this.aButtons = clone(this.buttons);
  }
})
</script>
