import AppImportDialog from 'components/AppImportDialog.vue'
import { openODS } from 'src/modules/utils'

export const gridItemMixin = {
  data: () => ({
    record: {},
    formDialog: false,
    formDialogMethod: 'new',
    search: '',
    data: [],
    selection: 'single',
    selected: [],
    loading: false,
    serverPagination: {
      page: 1,
      rowsNumber: 10,
      descending: true
    },
    permitions: {},
    componentForm: undefined
  }),
  methods: {
    handler(action) {
      let row = this.selected.length > 0 ? this.selected[0] : undefined
      switch (action) {
        case 'new': this.formNew(); break;
        case 'view':this.editOrView(action); break;
        case 'edit':this.editOrView(action); break;
        case 'cancel':this.editOrView(action); break;
        case 'delete': this.formRemove(row); break;
        case 'import': this.importData('CSV'); break;
        case 'export': this.exportData('ODS'); break;
        case 'selAplicacao': this.selAplicacao(); break;
        case 'selDicRel': this.selDicRel(); break;
        case 'selCampos': this.selCampos(); break;
        case 'loteRateio': this.loteRateio(); break;
        case 'newProg': this.newProg(); break;
        default:
        this.$q.notify('Ação não definida')
      }
    },
    handlerCol(field, row){
      let data = {};
      let id = row[this.grid.primaryKey];
      data[field] = row[field];
      //data[this.grid.primaryKey] = row[this.grid.primaryKey];
      this.$api.put(`/${this.module}/${id}`, data)
      .then(({data}) => {
        if(data.success) {
          this.submit = true;
          this.$q.notify({
            message: 'Atualizado com sucesso',
            icon: 'done',
            type: 'positive',
            color: 'positive',
          })
        } else {
          this.$q.notify({type: 'negative', message: data.msg})
        }
      })
    },
    colSort(params) {
      this.serverPagination.sortBy = params.field
      this.serverPagination.descending = params.descending
      this.requestGrid(
        {
          pagination: this.serverPagination,
          filter: this.filter,
          search: this.search
        }
      )
    },
    formNew () {
      this.record = { };
      this.$emitter.emit('crud:before-new', '');
      this.$q.dialog({
        component: this.componentForm,
        componentProps: {
          ...this.form,
          fk: this.fk,
          data: this.parentRow,
          method: 'new',
          options: this.options,
          parentRow: this.parentRow,
          persistent: true,
        }
      })
      .onOk((record) => {
        this.rows.splice(0, 0, record);
        this.$emitter.emit('crud:after-new', '');
      })
    },
    importData () {
      this.$q.dialog({
        component: AppImportDialog,
        componentProps: {
          title: `Leiaute csv ${this.form.title}`,
          table: this.form.table,
          primaryKey: this.form.primaryKey,
          fields: this.form.fields,
          persistent: true,
        }
      })
      .onOk((data) => {
        if(data.success){
          this.requestGrid({
            pagination: this.serverPagination,
            filter: this.filter,
            search: this.search
          })
        }
        else {
          this.$q.notify({type: 'negative', message: data.msg})
        }
      })
    },
    exportData(saida){
      this.loading = true;
      this.lockedAction = true;
      openODS(this.data)
      this.lockedAction = false;
    },
    editOrView(action) {
      this.record = this.selected[0];
      let index= this.rows.indexOf(this.record);
      this.$emitter.emit('crud:before-edit', '');
      let id = this.record[this.grid.primaryKey];
      this.$q.dialog({
        component: this.componentForm,
        componentProps: {
          ...this.form,
          method: action,
          fk: this.fk,
          id: id,
          options: this.options,
          parentRow: this.parentRow,
          persistent: true,
        }
      })
      .onOk((record) => {
        this.rows.splice(index, 1, record);
        this.selected = [];
        this.$emitter.emit('crud:after-edit', '');
      })
    },
    formRemove (row) {
      if(row){
        let index = this.data.indexOf(row);
        let id = row[this.grid.primaryKey];
        if(!isNaN(id) && id > 0){
          this.$q.dialog({
            title: 'Confirmação',
            message: `Tem certeza que quer excluir o registro ${id}?`,
            ok: 'Sim',
            cancel: 'Não'
          })
          .onOk(() => {
            this.$api.delete(`/${this.module}/${id}`)
            .then(({data}) => {
              if(data.success){
                this.$emitter.emit('crud:after-delete', '');
                this.selected = []
                this.data.splice(index, 1);
                this.$q.notify({
                  message: `Registro '${id}' excluído com sucesso!`,
                  icon: 'done',
                  type: 'positive',
                  color: 'positive'
                })
              }else {
                this.$q.notify({type: 'negative', message: data.msg})
              }
            })
          })
        } else {
          this.$q.dialog({
            title: 'Confirmação',
            message: `Tem certeza que quer excluir o registro?`,
            ok: 'Sim',
            cancel: 'Não'
          })
          .onOk(() => {
            this.selected = [];
            this.data.splice(index, 1);
          })
        }
      }
    }
  },
  computed: {
    module () {
      return this.form.table.toLowerCase()
    }
  }
}
