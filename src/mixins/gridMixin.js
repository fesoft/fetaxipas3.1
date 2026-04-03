import _ from 'lodash'
import { clone } from 'src/modules/utils'

export const gridMixin = {
  data: () => ({
    record: {},
    formDialog: false,
    formDialogMethod: 'new',
    //data: [],
    //filter: [],
    //serverPagination: [],
    selection: 'single',
    loading: false,
    permitions: {},
    lockedAction: false,
    componentForm: undefined
  }),
  methods: {
    handler(action, row) {
      let records = this.selected.length >  0 ? this.selected : (row !== undefined ? [row] : []);
      let id = records.length >  0 ? records[0][this.grid.primaryKey] : undefined;
      switch (action) {
        case 'new': this.formNew(); break;
        case 'view':this.editOrView(action, id); break;
        case 'edit':this.editOrView(action, id); break;
        case 'cancel':this.editOrView(action, id); break;
        case 'delete': this.formRemove(id); break;
        case 'import': this.importData('CSV'); break;
        case 'export': this.exportData('ODS'); break;
        case 'selAplicacao': this.selAplicacao(); break;
        case 'print': this.imprimir(id); break;
        case 'enviar': this.enviarMsgProg(id); break;
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
      this.serverPagination.sortBy = params.field;
      this.serverPagination.descending = params.descending;
      this.requestGrid({
          pagination: this.serverPagination,
          filter: this.filter,
          search: this.search
        })
    },
    formNew () {
      this.record = {};
      this.$emitter.emit('crud:before-new','');
      if(!this.$q.platform.is.mobile || this.fk){
          this.$q.dialog({
          component: this.componentForm,
          componentProps: {
            ...this.form,
            fk: this.fk,
            method: 'new',
            options: this.options,
            parentRow: this.parentRow,
            persistent: true,
          }
        }).onOk((rec) => {
          this.requestGrid({
            pagination: this.serverPagination,
            filter: this.filter,
            search: this.search
          })
        }).onCancel(() => {
          this.requestGrid({
            pagination: this.serverPagination,
            filter: this.filter,
            search: this.search
          })
        })
      }
      else {
        this.$router.push(`/${this.grid.path}/new`)
      }
    },
    editOrView(action, id) {
      this.$emitter.emit('crud:before-edit', '');
      let index= this.data.indexOf(this.selected[0]);
      if(!this.$q.platform.is.mobile || this.fk){
        this.$q.dialog({
          component: this.componentForm,
          componentProps: {
            ...this.form,
            method: action,
            fk: this.fk,
            id: id,
            options: this.options,
            parentRow: this.parentRow,
            persistent: true
          }
        }).onOk((rec) => {
          this.data.splice(index, 1, rec);
          this.selected[0] = rec;
        }).onCancel(() => {
        })
      }
      else {
        this.$router.push(`/${this.grid.path}/${id}/${action}`)
      }
    },
    deleteLote(){
      //
    },
    formRemove (id) {
      this.$q.dialog({
        title: 'Confirmação',
        message: `Tem certeza que quer excluir o registro ${id}?`,
        ok: 'Sim',
        cancel: 'Não'
      })
      .onOk(() => {
        this.lockedAction = true;
        let params = {
          _softDelete: this.form.softDelete,
          _type: this.grid.type
        };
        this.$api.delete(`/${this.moduleForm}/${id}`, {params})
        .then(({data}) => {
          this.lockedAction = false;
          if(data.success){
            this.$emitter.emit('crud:after-delete',this.selected);
            this.selected = []
            this.$q.notify({
              message: `Registro '${id}' excluído com sucesso!`,
              icon: 'done',
              type: 'positive',
              color: 'positive'
            })
            this.requestGrid({
              pagination: this.serverPagination,
              filter: this.filter,
              search: this.search
            })
          }else {
            this.$q.notify({type: 'negative', message: data.msg})
          }
        })
      })
    },
    getData(value) {
      this.$emitter.emit('crud:before-request', '');
      this.request({
        pagination: this.serverPagination,
        filter: this.filter,
        search: this.search
      })
      .then(({data}) => {
        this.data = data.resultado || [];
        this.total = data.summary || {};
        this.serverPagination.rowsNumber = data.total;
        this.loading = false;
        this.$emitter.emit('crud:after-request', '');
      })
      .catch(error => {
        this.loading = false
      })
    },
    objFields(){
      let fields = []
      this.form.fields.map((item) => item.fields)
      .forEach((value, index, array) => {
        fields = Array.prototype.concat(fields,value)
      })
      return fields
    },
    requestGrid({ pagination, filter, search, saida}) {
      this.request({
        pagination,
        filter: this.filter,
        search: this.search,
        saida
      })
      .then(({data}) => {
        this.data = data.resultado || [];
        this.total = data.summary || {};
        this.serverPagination = pagination;
        this.serverPagination.rowsNumber = data.total;
        this.loading = false;
        this.$emitter.emit('crud:after-request', '');
      })
      .catch(error =>{
        this.loading = false;
      });
    },
    request ({ pagination, filter, search, saida}) {
      let aSelect = [];
      let searchFields = [];
      let limit = pagination.rowsPerPage;
      let start = (pagination.page * limit) - limit;
      let totalizar = this.grid.columns.map(col => {if(col.summary){return col.field}}).filter(item => item != null);
      if(this.$q.platform.is.mobile){
        searchFields = this.grid.columns.map(col => {if(col.type == 'text'){return col.field}}).filter(item => item != null);
      };
      if(saida == 'ODS'){
        limit = 100000;
        start = 0;
        //select = this.visibleColumns.join(',');
        this.grid.columns.forEach((value, index, array) => {
          aSelect = Array.prototype.concat(aSelect, value.name + ' as "' + value.label.substring(0,30) + '"')
        })
      };

      let dir = pagination.descending ? 'DESC' : 'ASC';
      let _criterio = this.fk ? `${this.grid.foreignKey} = ${this.fk}` : '';
      let filtro = {};
      Object.keys(filter).forEach((item, i) => {
        if(!_.isEmpty(filter[item])) filtro[item] = filter[item]
      });
      let params = {
        page: pagination.page,
        sort: pagination.sortBy,
        dir,
        start,
        limit,
        filter: filtro,
        _criterio,
        search,
        searchFields,
        _select: aSelect.length > 0 ? aSelect.join(',') : '*',
        _totalizar: totalizar,
        saida
      }
      return this.$api.get(this.module, { params })
    }
  },  
}
