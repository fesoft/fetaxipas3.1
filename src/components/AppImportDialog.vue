<template>
  <q-dialog
  ref="dialog"
  :persistent="persistent"
  @keydown.esc="hide">
  <q-card class="q-dialog-plugin" style="width: 600px; max-width: 80vw;">
    <app-form-bar title="Importar" :handler="hide"></app-form-bar>

    <q-card-section class="row">
      <q-uploader
      field-name='file'
      auto-upload
      label= 'Arquivo'
      :url="getUrl"
      :headers="headers"
      class='col-xs-12 col-md-12'
      @uploaded="onUpload"
      >
    </q-uploader>
  </q-card-section>

  <q-card-section>
    <q-bar>
      <div class="text-weight-bold">{{title}}</div>
      <q-space />
      <q-btn size="sm" flat color="white" label="Modelo" @click="modeloCsv">
        <q-tooltip>Modelo de planilha csv</q-tooltip>
      </q-btn>
      <q-btn size="sm" flat color="positive" label="SALVAR" @click="saveLayout(table, data)">
        <q-tooltip>Salvar layout</q-tooltip>
      </q-btn>
    </q-bar>

    <q-markup-table>
      <thead>

        <tr>
          <th v-for="col in columns" :key="col.name" class="text-left">{{col.label}}</th>
        </tr>
      </thead>
      <draggable  v-model="data" tag="tbody">
        <tr v-for="row in data">
          <td v-for="col in columns" class="text-left">
            <div v-if="col.editor">
              <component :is="col.editor.is"
              :disable="row.required"
              v-model="row[col.name]"
              v-bind="col.editor"
              ></component>
            </div>
            <div v-else>
              {{format(col.name,row[col.name])}}
            </div>
          </td>
        </tr>

      </draggable>
    </q-markup-table>
  </q-card-section>
</q-card>
</q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import AppFormBar from 'components/AppFormBar.vue'
import { layoutMixin } from 'src/mixins/layoutMixin'
import { clone, openCSV } from 'src/modules/utils'
import { useAuthStore } from 'stores/auth-store'
import { VueDraggableNext } from 'vue-draggable-next'


export default defineComponent({
  name: 'AppImportDialog',
  components: {
    AppFormBar,
    Draggable: VueDraggableNext
  },
  props: {
    title: String,
    table: String,
    primaryKey: String,
    fields: Array,
    persistent: Boolean,
  },
  mixins: [ layoutMixin ],
  data: () => {
    return {
      columns: [
        {name: 'label', field: 'label', label: 'Coluna', align: 'left'},
        {name: 'type', field: 'type', label: 'Tipo', align: 'left'},
        {name: 'maxlength', field: 'maxlength', label: 'Tam. Max.', align: 'right'},
        {name: 'required', field: 'required', label: 'Obrigatório', align: 'right'},
        {name: 'import', field: 'import', label: 'Importar?', align: 'left', editor:{is: 'q-checkbox'}}
      ],
      data: [],
      token: ''
    }
  },
  methods: {
    format(col, value) {
      if(col == 'required') {
        return value ? 'Sim' : 'Não'
      }
      else if(col == 'type') {
        return  value ? this.translate(value) : 'Texto'
      }
      else if(col == 'maxlength') {
        return  value ? value : 10
      }
      return value
    },
    translate(value){
      switch (value) {
        case 'date': return 'Data (DD/MM/AAAA)'; break;
        case 'hidden': return 'Inteiro'; break;
        case 'time': return 'Hora (##:##)'; break;
        case 'money': return 'Decimal (###.##0,00)'; break;
        case 'integer': return 'Inteiro'; break;
        case 'number': return 'Número'; break;
        default: return value;
      }
    },
    getUrl (files) {
      return `${process.env.BASE_URL}/${process.env.API_VERSION}/import?_nomeTabela=${this.table}&_nomeChave=${this.primaryKey}&_fields=${JSON.stringify(this.listFields)}`
    },
    headers(){
      return [
        {name: "Authorization", value: `Bearer ${this.token}`}
      ];
    },
    modeloCsv() {
      let csv = this.data
      .filter(item => (item.import == undefined || item.import))
      .map(item => item.label)
      .reduce((acc, cur, i) => { acc[cur] = ''; return acc;}, {});

      openCSV([csv], `modeloCsv_${this.table}.csv`);
    },
    onUpload(info) {
      this.$emit('ok', JSON.parse(info.xhr.response))
    },
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    },
    onOKClick () {
      this.$emit('ok', this.selected)
      this.hide()
    },
    onCancelClick () {
      this.hide()
    }
  },
  computed: {
    objFields(){
      let fields = []
      this.fields.map((item) => item.fields)
      .forEach((value, index, array) => {
        if(!value.readonly)
        fields = Array.prototype.concat(fields,value)
      })
      return fields
    },
    listFields() {
      return this.data
      .filter(item => item.import == undefined || item.import)
      .map(item => {
        return {
          is: item.is,
          name: item.name,
          label: item.label,
          type: item.type,
          maxlength: item.maxlength,
          required: item.required,
          import: item.import
        }
      })
    }
  },
  mounted (){
    this.token = useAuthStore().token
    this.getLayout(this.table).then(({data}) => {
      if(data.success) {
        let res = data.resultado || [];
        this.data  = res.length > 0 ? JSON.parse(res[0]['IMPORT_COLUMNS']) : clone(this.objFields)
      }
    })
  }
})
</script>
