<template>
  <q-page :padding="!$q.platform.is.mobile" class="docs-input row items-top justify-center">
    <div style="width: 600px; max-width: 100vw;">
      <q-form
      ref="myForm"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
      @submit="onSubmit"
      @reset="onReset"
      >

      <q-card>
        <q-bar class="bg-secondary text-white">
          <div class="text-weight-bold justify-center">{{formTitle || title}}</div>
        </q-bar>

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

        <q-card-section class="q-col-gutter-xs">
          <div v-for="(grid, index) in gridItems" :key="index">
            <component
            :is="grid.is"
            v-bind="grid.props"
            :fk="form[primaryKey]"
            :parentRow="form"
            :options="options == undefined ? {} : options"
            :readonly="readonly"
            :rows="form.items[index] ? form.items[index].rows : []"
            ></component>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions v-if="!$q.screen.lt.sm" align="center">

          <component
          v-if="buttons && !readonly"
          v-for="button in buttons"
          :key="button.name"
          :is="button.is"
          :label="button.label"
          :disable="disable"
          :color="button.color"
          @click="handler(button.name)"
          >
        </component>

        <q-btn
        v-if="!buttons && !readonly"
        type="submit"
        round
        color="positive"
        icon="save"
        :disable="disable"
        >
      </q-btn>

    </q-card-actions>

  </q-card>
  <q-page-sticky v-if="$q.screen.lt.sm " position="bottom-right" :offset="[18, 18]">
    <q-btn
    v-if="!readonly"
    type="submit"
    round
    color="positive"
    icon="save"
    >
  </q-btn>
</q-page-sticky>
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
import AppSearch from 'components/AppSearch.vue'
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
  mixins: [ formMixin, optionsMixin ],
  methods: {
    getLabel(field){
      return field.required ? field.label + '*' : field.label
    },
    formBlur(){},
    disableField(field){
      return false
    },
  },
  created () {
    this.action = this.method;
    this.aFields = clone(this.fields);
    this.aGridItems = clone(this.gridItems);
    this.aFields[0].fields[0].autofocus = !this.$q.platform.is.mobile;
  }
})
</script>
