<template>
  <q-dialog
    ref="dialog"
    :persistent="persistent"
    @keydown.esc="hide">
    <q-card class="q-dialog-plugin" style="width: 600px; max-width: 80vw;">
      <app-form-bar title="Importar" :handler="hide"></app-form-bar>

      <q-card-section>
        <q-file v-model="file" ref="input" v-bind="$attrs" name="file" stack-label :dense="!$q.platform.is.mobile"
          :filled="!$q.platform.is.mobile" no-error-icon hide-bottom-space unmasked-value accept=".ods, .xlsx, .csv"
          :filter="checkFileSize" @update:model-value="loadfile"
          @rejected="onRejected">
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
          <template v-slot:append>
            <q-icon v-if="file" name="cancel" @click.stop.prevent="onClear" class="cursor-pointer" />
          </template>
        </q-file>

      </q-card-section>

      <q-card-section>
        <q-bar>
          <div class="text-weight-bold">{{title}}</div>
          <q-space />
          <div class="q-gutter-xs">
            <q-btn rounded size="sm" color="secondary" label="Modelo" @click="modeloOds">
              <q-tooltip>Modelo de planilha csv</q-tooltip>
            </q-btn>
            <q-btn rounded size="sm" color="positive" label="SALVAR" @click="saveLayout(table, data)">
              <q-tooltip>Salvar layout</q-tooltip>
            </q-btn>
            <q-btn rounded size="sm" color="negative" label="RESET" @click="resetLayout()">
              <q-tooltip>Reset layout</q-tooltip>
            </q-btn>
          </div>
        </q-bar>

        <q-markup-table>
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.name" class="text-left">{{col.label}}</th>
            </tr>
          </thead>
          <draggable :list="data" tag="tbody">
            <tr v-for="(row, index) in data" :key="index">
              <td v-for="col in columns" :key="`${index}-${col.name}`" class="text-left">
                <div v-if="col.editor">
                  <component :is="col.editor.is"
                    :disable="row.required"
                    v-model="row[col.name]"
                    v-bind="col.editor">
                  </component>
                </div>
                <div v-else>
                  {{format(col.name, row[col.name])}}
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
import { defineComponent } from 'vue';
import AppFormBar from 'components/AppFormBar.vue';
import AppCombobox from 'components/AppCombobox.vue';
import { layoutMixin } from 'src/mixins/layoutMixin';
import { clone, SheetToJsonNode, getFileArrayBuffer } from 'src/modules/utils';
import { useAuthStore } from 'stores/auth-store';
import { VueDraggableNext } from 'vue-draggable-next';
import XLSX from 'xlsx';

export default defineComponent({
  name: 'AppImportDialog',
  components: {
    AppFormBar,
    AppCombobox,
    Draggable: VueDraggableNext
  },
  props: {
    title: String,
    table: String,
    saveLote: {
      type: Boolean,
      default: () => false
    },
    primaryKey: String,
    fields: Array,
    persistent: Boolean,
  },
  mixins: [layoutMixin],
  data: () => {
    return {
      columns: [
        { name: 'label', field: 'label', label: 'Coluna', align: 'left' },
        { name: 'type', field: 'type', label: 'Tipo', align: 'left' },
        { name: 'maxlength', field: 'maxlength', label: 'Tam. Max.', align: 'right' },
        { name: 'required', field: 'required', label: 'Obrigatório', align: 'right' },
        { name: 'import', field: 'import', label: 'Importar?', align: 'left', editor: { is: 'q-checkbox' } }
      ],
      data: [],
      token: '',
      id: undefined,
      separador: ';',
      options: [
        { value: ';', label: 'Ponto e vírgula' },
        { value: ',', label: 'Vírgula' },
        { value: '|', label: 'Pipe' }
      ],
      file: undefined,
      dataJson: undefined
    }
  },
  methods: {
    getFileType(file) {
      if (file) {
        if (file.type === 'application/vnd.oasis.opendocument.spreadsheet') {
          return 'ods';
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          return 'xlsx';
        } else if (file.type === 'text/csv') {
          return 'csv';
        }
      }
      return '';
    },
    async importarPlanilha(file) {
      if (file) {
        try {
          const arrayBuffer = await getFileArrayBuffer(file);
          const jsonData = SheetToJsonNode({ buffer: arrayBuffer }, this.getFileType(file));
          return JSON.stringify(jsonData);
        } catch (error) {
          console.error('Erro ao importar planilha:', error);
          throw new Error('Erro ao importar planilha');
        }
      }
    },
    async loadfile(file) {
      if (file) {
        try {
           this.file = file;
           this.dataJson = await this.importarPlanilha(file);
           let result = {
              success: true,
              resultado: JSON.parse(this.dataJson),
              fields: this.listFields,
              msg: 'Arquivo importado com sucesso'
           }
           this.$emit('ok', result);
         } catch (error) {
          this.$q.notify({
            message: error.message,
            color: 'negative',
            position: 'top'
          });
          let result = {
            success: false,
            msg: error.message
          }
          this.$emit('ok', result);
        }
      }
    },
    onClear() {
      this.file = undefined;
    },
    onRejected() {
     this.$q.notify({
            message: 'Formato de arquivo inválido. Use .ods, .xlsx ou .csv',
            color: 'negative',
            position: 'top'
          });
      this.$emit('update:model-value', undefined);
    },
    checkFileSize(files) {
      return files.filter(file => file.size < 1000000);
    },
    format(col, value) {
      if (col == 'required') {
        return value ? 'Sim' : 'Não';
      } else if (col == 'type') {
        return value ? this.translate(value) : 'Texto';
      } else if (col == 'maxlength') {
        return value ? value : 10;
      }
      return value;
    },
    translate(value) {
      switch (value) {
        case 'date': return 'Data (DD/MM/AAAA)'; break;
        case 'hidden': return 'Inteiro'; break;
        case 'hora': return 'Hora (##:##)'; break;
        case 'money': return 'Decimal (###.##0,00)'; break;
        case 'integer': return 'Inteiro'; break;
        case 'number': return 'Inteiro'; break;
        default: return value;
      }
    },
    getLabel(item) {
      let tam = item.maxlength > 0 ? item.maxlength : 10;
      let obrigatorio = item.required ? '*' : '';
      return `${item.label}(${tam})${obrigatorio}`;
    },
    modeloOds() {
      let data = this.data
        .filter(item => (item.import == undefined || item.import))
        .map(item => this.getLabel(item));

      let ws = XLSX.utils.aoa_to_sheet([data]);
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Modelo");

      XLSX.writeFile(wb, `modeloOds_${this.table}.ods`);
    },
    onUpload(info) {
      this.$emit('ok', JSON.parse(info.xhr.response));
    },
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onDialogHide() {
      this.$emit('hide');
    },
    onOKClick() {
      this.$emit('ok', this.selected);
      this.hide();
    },
    onCancelClick() {
      this.hide();
    }
  },
  computed: {
    objFields() {
      let fields = [];
      this.fields.map((item) => item.fields)
        .forEach((value, index, array) => {
          if (!value.readonly)
            fields = Array.prototype.concat(fields, value);
        });
      return fields.filter(item => item.showImport == undefined || item.showImport);
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
          };
        });
    }
  },
  mounted() {
    this.token = useAuthStore().token;
    this.getLayout(this.table).then(({ data }) => {
      if (data.success) {
        let res = data.resultado || [];
        this.id = res.length > 0 ? data.resultado[0]['ID'] : 0;
        this.data = res.length > 0 ? JSON.parse(res[0]['IMPORT_COLUMNS']) : clone(this.objFields);
      }
    });
  }
});
</script>
