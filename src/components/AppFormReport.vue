<template>
  <q-page padding class="container justify-items-center">
    <div v-if="!$q.platform.is.mobile" class="row">
      <q-expansion-item
      v-model="expansion"
      :label="title"
      expand-icon-class="text-white text-weight-bold"
      class="bg-secondary text-white col-xs-12 col-sm-12 text-weight-bold"
      style="width: 500px; max-width: 95vw;"
      >
      <q-form
      ref="myForm"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
      >
      <q-card class="col-6">
        <q-card-section class="row q-col-gutter-xs">
          <component
          v-for="field in aFields.filter(item => item.visible == undefined || item.visible)"
          :key="field.name"
          :is="field.is"
          v-model="form[field.name]"
          :options="field.options || options[field.name]"
          v-bind="field"
          @update:model-value="formInput(field.name, form[field.name])"
          @blur="formBlur(field.name)"
          ></component>
        </q-card-section>
        <q-separator />
        <q-card-actions class="justify-center">
          <q-btn v-if="form.FORMATO.toLowerCase() == 'pdf'" type="submit" size="sm" label="Visualizar" color="positive"/>
          <q-btn size="sm" label="Baixar" color="secondary" @click="baixar"/>
          <q-btn type="reset" size="sm" label="Limpar" color="negative"/>
        </q-card-actions>
      </q-card>
    </q-form>
  </q-expansion-item>

  <div within-iframe-only class="col-xs-12 col-sm-12">
    <q-tabs
    v-model="tab"
    dense
    no-caps
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
    >
    <q-btn-group v-for="(tab, index) in tabs" :key="tab.name">
      <q-tab :name="tab.name" :label="tab.label" size="sm" />
      <q-btn flat size="sm" color="grey-8" icon="remove_circle_outline" @click="removeTab(index)"></q-btn>
    </q-btn-group>
  </q-tabs>

  <q-separator />

  <q-tab-panels  v-model="tab"  animated>
    <q-tab-panel
    v-for="tab in tabs"
    :key="tab.name"
    :name="tab.name"
    class="row q-col-gutter-xs"
    >
    <iframe
    type="application/pdf"
    width="100%"
    height="600"
    :src="tab.src"
    frameborder="0"
    allowfullscreen>
  </iframe>
</q-tab-panel>
</q-tab-panels>

</div>
</div>

<div v-if="$q.platform.is.mobile">
  <q-form
  ref="myForm"
  autocorrect="off"
  autocapitalize="off"
  autocomplete="off"
  spellcheck="false"
  @submit="onSubmit"
  class="q-gutter-md"
  >
  <q-card class="col-6">
    <q-card-section class="row q-col-gutter-xs">
      <component
      v-for="field in aFields.filter(item => item.visible == undefined || item.visible)"
      :key="field.name"
      :is="field.is"
      v-model="form[field.name]"
      :options="field.options || options[field.name]"
      v-bind="field"
      @update:model-value="formInput(field.name, form[field.name])"
      ></component>
    </q-card-section>
  </q-card>
  <q-page-sticky v-if="$q.screen.lt.sm " position="bottom-right" :offset="[18, 18]">
    <q-btn
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
import { optionsMixin } from 'src/mixins/optionsMixin'
import { clone } from 'src/modules/utils'
import AppCombobox from 'components/AppCombobox.vue'
import AppSelect from 'components/AppSelect.vue'
import AppDate from 'components/AppDate.vue'
import AppInput from 'components/AppInput.vue'
import { openODS, openPDF } from 'src/modules/utils'

export default defineComponent({
  name: 'AppFormReport',
  components: {
    AppCombobox,
    AppSelect,
    AppDate,
    AppInput
  },
  props: {
    fields: Array,
    title: String,
    module: String,
  },
  mixins: [ optionsMixin ],
  data: () => ({
    submit: false,
    aFields: [],
    expansion: true,
    dataFile: [],
    /*form: {
      FORMATO: 'PDF',
      RELATORIO: undefined
    },
    tabs: [],
    tab: '',
    */
    options: {
      RELATORIO: []
    },
  }),
  methods: {
    onSubmit(){
      this.$refs.myForm.validate()
      .then(success => {
        if (success) {
          this.build()
        }
        else {
          //
        }
      })
    },
    onReset(){
      this.form = this.cleanForm();
      this.tabs = [];
    },
    formInput(field, val){

    },
    formBlur(field){

    },
    addTab(src, titulo){
      this.tabs.push({
        name: src,
        label: titulo,
        src: src
      });
      this.tab = src;
    },
    removeTab(index){
      this.tabs.splice(index, 1)
    },
    build() {
      this.$api.get(`${this.module}`, {params:this.form})
      .then(({data}) => {
        if(data.success){
          if(this.form.FORMATO.toLowerCase() == 'pdf'){
            if(this.$q.platform.is.mobile){
              openPDF(data.tmpFileName, data.titulo)
            } else {
              this.expansion = false;
              this.addTab('data:application/pdf;base64,' + data.tmpFileName, data.titulo);
            }
          }
          else {
            openODS(data.tmpFileName, data.titulo, data.rotuloCols)
          }
        } else {
          this.$q.notify({
            message: data.msg,
            icon: 'cancel'
          })
        }
      })
    },
    baixar() {
      this.$api.get(`${this.module}`, {params:this.form})
      .then(({data}) => {
        if(data.success){
          if(this.form.FORMATO.toLowerCase() == 'pdf'){
            openPDF(data.tmpFileName, data.titulo)
          } else {
            openODS(data.tmpFileName, data.titulo, data.rotuloCols)
          }
        } else {
          this.$q.notify({
            message: data.msg,
            icon: 'cancel'
          })
        }
      })
    },
    objFields(){
      let fields = []
      this.fields.forEach((value, index, array) => {
        fields = Array.prototype.concat(fields,value)
      })
      return fields
    },
    cleanForm() {
      return this.objFields().reduce((acc, cur, i) => {
        acc[cur.name] = '';
        return acc;
      }, {})
    },
  },
  created () {
    this.aFields = clone(this.fields);
  },
})
</script>
