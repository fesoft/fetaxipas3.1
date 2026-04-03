import _ from 'lodash'
import { clone } from 'src/modules/utils'

export const formMixin = {
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
    data: {
      type: Object,
      default: () => {}
    },
    saveItems: Boolean,
    closeAfferSave: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => {
    return {
      disable: false,
      formTitle: String,
      aFields: [],
      aGridItems: [],
      action: '',
      options: {
        type: Object,
        default: () => {}
      },
      form: {
        items: [{
          rows: [],
          summary: {},
        }]
      },
      formOld: {
        items: [{
          rows: [],
          summary: {},
        }]
      },
    }
  },
  methods: {
    handler(action) {
      switch (action) {
        case 'submit': /**/break;
        case 'reset': this.formNew(); break;
        case 'deleteLote': this.deleteLote(); break;
      }
    },
    onKeyDown(event){
      switch (event.keyCode) {
        case 27: this.hide(); break;
        case 45: this.formReset(); break;
        case 120: this.onSubmit(); break;
        default:
      }
    },
    onSubmit(){
      this.$refs.myForm.validate().then(success => {
        if (success) {
          this.save();
        } else {
          this.$q.notify({
            message: 'Existe(m) campo(s) inválido(s)',
            type: 'negative'
          })
        }
      })
    },
    onNew(){
      this.form = {
        ... this.cleanForm(),
        items: [{rows:[]}]
      };
      this.action = 'new';
      this.formOld = clone(this.form);
    },
    onReset(){
      if(!_.isEqual(this.form, this.formOld)) {
        this.$q.notify({
          message: 'Salve os dados antes de continuar',
          type: 'negative'
        })
      } else {
        this.onNew();
        this.$refs.myForm.focus();
      }
    },
    formInput(field, val){
      //
    },
    create () {
      this.$emitter.emit('form:before-create', this.form);
      if(this.foreignKey && this.fk) {
        this.form[this.foreignKey] = this.fk;
      };
      if(this.saveItems) {
        let items = [];
        this.form.items.forEach((item, i) => {
          items.push({'rows': this.prepareRows(item.rows, i)})
        });
        var data = {
          ...this.prepareFormCreate(),
          items
        }
      } else {
        var data = this.prepareFormCreate();
      };
      this.disable = true;

      this.$api.post(this.module, data)
      .then(({data}) => {
        if(data.success) {
          this.action = 'edit';
          let msg = '';
          this.form[this.primaryKey] = data.resultado[this.primaryKey];
          this.formOld = clone(this.form);
          if(!this.noResetOnSave && !this.$q.platform.is.mobile && !this.closeAfferSave) this.formReset();
          this.$q.notify({
            message:'Inserido com sucesso',
            type: 'positive',
          });
          this.disable = false;
          if(this.closeAfferSave){
            if(this.$q.platform.is.mobile){
              this.$router.go(-1);
            } else {
              this.hide();
            }
          }
        }
        else {
          this.$q.notify({type: 'negative', message: data.msg});
          this.disable = false;
        }
      })
    },
    update () {
      let id = this.form[this.primaryKey];
      if(this.saveItems) {
        let items = [];
        this.form.items.forEach((item, i) => {
          items.push({'rows': this.prepareRows(item.rows, i)})
        });
        var data = {
          ...this.prepareForm(),
          items
        }
      } else {
        var data = this.prepareForm();
      };
      this.$emitter.emit('form:before-update', data);
      let formUpdate = {};
      Object.keys(data).forEach((item, i) => {
        if(data[item] !== this.formOld[item]) formUpdate[item] = data[item]
      });
      formUpdate[this.primaryKey] = this.form[this.primaryKey];
      this.$api.put(`${this.module}/${id}`, formUpdate)
      .then(({data}) => {
        if(data.success) {
          this.formOld = clone(this.form);
          let msg = '';
          this.action = 'edit';
          msg = 'Atualizado com sucesso';
          //this.$emit('ok', data.resultado);
          this.$q.notify({
            message: msg,
            type: 'positive',
          });
          this.disable = false;
          if(this.$q.platform.is.mobile) {
            this.$router.go(-1);
          } else {
            if(this.closeAfferSave) this.hide();
          }
        }
        else {
          this.$q.notify({type: 'negative', message: data.msg});
          this.disable = false;
        }
      })
      /*.catch(({data}) => {
      this.disable = false;
      this.$q.notify({
      message: 'Erro desconhecido',
      type: 'negative'
    })
  })
  */
},
objFields(){
  let fields = []
  this.aFields.map((item) => item.fields)
  .forEach((value, index, array) => {
    fields = Array.prototype.concat(fields,value)
  })
  return fields
},
objFieldsItems(index){
  let fields = []
  this.gridItems[index].props.form.fields.map((item) => item.fields)
  .forEach((value, index, array) => {
    fields = Array.prototype.concat(fields,value)
  })
  return fields
},
prepareForm() {
  return this.objFields().reduce((acc, cur, i) => {
    if(!cur.readonly) acc[cur.name] = this.form[cur.name];
    return acc;
  }, {})
},
prepareFormCreate() {
  return this.objFields().reduce((acc, cur, i) => {
    if(!cur.readonly && this.form[cur.name]) acc[cur.name] = this.form[cur.name];
    return acc;
  }, {})
},
prepareRow(row, index) {
  return this.objFieldsItems(index).reduce((acc, cur, i) => {
    if(!cur.readonly) acc[cur.name] = row[cur.name];
    return acc;
  }, {})
},
prepareRows(rows, index){
  return rows.map(item => this.prepareRow(item, index))
},
/*prepareRows(rows, index){
let ret = [];
rows.forEach((item, i) => {
if(!_.isEqual(item,this.formOld.items[0].rows[i]))
ret.push(this.prepareRow(item, index))
});
return ret;
},
*/
readonlyFields() {
  return this.objFields().reduce((acc, cur, i) => {
    if(cur.readonly) acc[i] = cur.name;
    return acc;
  }, {})
},
cleanForm() {
  return this.objFields().reduce((acc, cur, i) => {
    if(!cur.readonly) acc[cur.name] = '';
    return acc;
  }, {})
},
save() {
  if(_.isEqual(this.form, this.formOld)) {
    this.$q.notify({
      message: 'Nenhum dado para salvar!',
      type: 'warning',
    });
  } else {
    this.$emitter.emit('form:before-save', this.form);
    if(this.action == 'new'){
      return this.create()
    } else {
      return this.update()
    }
  }
},
getRecord() {
  let id = this.id || this.$route.params.id;
  return this.$api.get(`${this.module}/${id}`)
},
showGrid () {
  return this.form[this.primaryKey] ? true : false
}
},
watch: {
  method (value) {
    this.action = value
  },
},
computed: {
  module () {
    return this.table.toLowerCase()
  },
  readonly () {
    return this.method == 'view' ? true : false
  },
  tableNameItem () {
    return this.gridItems ? this.gridItems.props.grid.table : ''
  },
  nomeChaveItem () {
    return this.gridItems ? this.gridItems.props.grid.primaryKey : ''
  },
  foreignKeyItem () {
    return this.gridItems ? this.gridItems.props.grid.foreignKey : ''
  },
  showGridItems () {
    return this.aGridItems ? true : false
  },
  visibleColumnsItems () {
    //
  },
},
}
