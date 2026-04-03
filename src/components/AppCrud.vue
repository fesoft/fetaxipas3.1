<template>
  <div class="q-pa-xs">
    <app-form-section :title="grid.title" v-show="showTitle"/>
    <div class="row q-pb-xs q-gutter-xs">
      <app-grid-actions-bar
      v-if="selected.length > 0 &&  !$q.screen.xs"
      :permitions="permitions"
      :buttons="buttonsTopLeft"
      :handler="handler"
      >
    </app-grid-actions-bar>
    <app-grid-actions-bar
    v-if="!readonly"
    v-show="selected.length == 0"
    :permitions="permitions"
    :buttons="buttonsTopRight"
    :handler="handler"
    >
  </app-grid-actions-bar>
  <q-space v-if="$q.platform.is.mobile"/>


<q-space v-if="!$q.platform.is.mobile"/>
<q-select
v-show="showComboColumns"
v-if="!$q.screen.xs"
v-model="visibleColumns"
multiple
dense
options-dense
:display-value="$q.lang.table.columns"
emit-value
map-options
rounded
standout
:options="aColumns"
option-value="name"
options-cover
@update:model-value="saveConfigGrids"
style="min-width: 150px">
</q-select>

</div>
  <div class="q-gutter-xs col-xs-12 col-sm-6">
    <app-tabs
    v-for="field in grid.searchComponent"
    :key="field.name" :is="field.is"
    :options="options[field.name]"
    v-model="tab"
    @update:model-value="getData"
    >
  </app-tabs>
</div>
<q-table
ref="myTable"
color="primary"
tabindex="0"
:class="tableClass"
separator="cell"
:grid="$q.screen.xs"
:table="grid.table"
:dense="!$q.platform.is.mobile"
:primaryKey="grid.primaryKey"
:rows="data"
:columns="aColumns"
:selection="selection"
v-model:selected="selected"
:visible-columns="visibleColumns"
:row-key="grid.primaryKey"
v-model:pagination="serverPagination"
:hide-pagination="grid.hidePagination ? true : false"
:loading="loading"
:rows-per-page-options="rowsPerPageOptions"
@selection="onSelection"
@request="requestGrid"
@focusin="activateNavigation"
@focusout="deactivateNavigation"
@keydown="onKey"
>
<template v-slot:top>
</template>

<template v-slot:header="props" v-if="grid.customHeader">
  <q-tr :props="props">
    <q-td auto-width>
      <q-checkbox
      dense
      v-if="props.multipleSelect"
      v-model="props.selected"
      @click="props.selected = !props.selected"/>
    </q-td>
    <q-td v-for="col in props.cols" :key="col.name" :props="props" :filter="filter">
      <q-btn-dropdown
      :ref="col.field"
      flat
      size="sm"
      :align="col.align"
      :label="col.label"
      no-wrap
      padding="0px 0px 0px 0px"
      menu-self="bottom left"
      menu-anchor="top left"
      class="q-pa-none full-width"
      :color="btnColor(col)"
      >
      <q-list :dense="!$q.platform.is.mobile" style="min-width: 230px max-width: 330px">
        <q-item clickable  v-close-popup>
          <q-item-section @click="colSort({field: col.field, descending:false})">Ordem crescente</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section @click="colSort({field: col.field, descending:true})">Ordem decrescente</q-item-section>
        </q-item>
        <q-item  v-if="col.type == 'text'">
          <q-item-section class="q-col-gutter-xs">
            <app-input clearable v-model="filter[col.field]['lk']" label="Contendo" @clear="onRequest(col.field)" @keyup.enter="onRequest(col.field)"></app-input>
            <q-btn flat size="sm" color="grey-7" label="Preencher e Enter" icon="search" :disable="btnDisable(col)" @click="onRequest(col.field)"></q-btn>
          </q-item-section>
        </q-item>
        <q-item  v-if="col.type == 'integer' || col.type == 'money'">
          <q-item-section class="q-col-gutter-xs">
            <app-input type="number" label="=" clearable v-model="filter[col.field]['eq']" @clear="onRequest(col.field)" @keyup.enter="onRequest(col.field)"></app-input>
            <app-input type="number" label=">" clearable v-model="filter[col.field]['gt']" @clear="onRequest(col.field)" @keyup.enter="onRequest(col.field)"></app-input>
            <app-input type="number" label="<" clearable v-model="filter[col.field]['lt']" @clear="onRequest(col.field)" @keyup.enter="onRequest(col.field)"></app-input>
            <q-btn flat size="sm" color="grey-7" label="Preencher e Enter" icon="search" :disable="btnDisable(col)" @click="onRequest(col.field)"></q-btn>
          </q-item-section>
        </q-item>
        <q-item  v-if="col.type == 'date'">
          <q-item-section class="q-col-gutter-xs">
            <app-date label="Inicial" clearable v-model="filter[col.field]['ini']" @clear="clearfilter(col.field,'ini')"></app-date>
            <app-date label="Final" clearable v-model="filter[col.field]['fin']" @clear="clearfilter(col.field,'fin')" @keyup.enter="onRequest(col.field)"></app-date>
            <q-btn flat size="sm" color="grey-7" label="Preencher e Enter" icon="search" :disable="btnDisable(col)" @click="onRequest(col.field)"></q-btn>
          </q-item-section>
        </q-item>
        <q-item  v-if="col.type == 'dateTime'">
          <q-item-section class="q-col-gutter-xs">
            <app-date-time label="Inicial" clearable v-model="filter[col.field]['ini']" @clear="clearfilter(col.field,'ini')"></app-date-time>
            <app-date-time label="Final" clearable v-model="filter[col.field]['fin']" @clear="clearfilter(col.field,'fin')" @keyup.enter="onRequest(col.field)"></app-date-time>
            <q-btn flat size="sm" color="grey-7" label="Preencher e Enter" icon="search" :disable="btnDisable(col)" @click="onRequest(col.field)"></q-btn>
          </q-item-section>
        </q-item>
        <q-item  v-if="col.type == 'select'">
          <q-item-section class="q-col-gutter-xs">
            <app-combobox cbxNewValueInput inputType="number" clearable v-model="filter[col.fieldFilter || col.field]['eq']" label="Filtrar" :options="options[col.field]" @clear="onRequest(col.field)" @update:model-value="onRequest(col.field)"></app-combobox>
            <!--q-btn flat size="sm" color="grey-7" label="Preencher e Enter" icon="search":disable="btnDisable(col)" @click="onRequest(col.field)"></q-btn-->
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </q-td>
</q-tr>
</template>

<template v-slot:body="props">
  <q-tr :props="props"  @dblclick="onDblClickEdit(props) ">
    <q-td auto-width>
      <q-checkbox dense v-model="props.selected" @click="props.selected = !props.selected"/>
      <q-btn v-if="showExpandButton(props.row)" size="xs" round flat :icon="props.expand ? 'remove' : 'add'" @click="props.expand = !props.expand" />
    </q-td>
    <q-td v-for="col in props.cols" :key="col.name" :props="props">
      <div v-if="col.editor && col.editor.is == 'q-input'">
        <component
        :is="col.editor.is"
        ref="input"
        v-model="props.row[col.field]"
        v-bind="col.editor"
        :hint="showEditorHint ? 'Salvar com enter' : ''"
        @focus="showEditorHint = !showEditorHint"
        @keyup.enter="handlerCol(col.field, props.row)">
      </component>
    </div>
    <div v-else-if="col.editor && col.editor.is != 'q-input'">
      <component
      :is="col.editor.is"
      v-model="props.row[col.field]"
      :color="props.row[col.editor.fieldColor]"
      v-bind="col.editor"
      label=""
      :options="options[col.field]"
      @update:model-value="handlerCol(col.field, props.row)">
    </component>
  </div>
  <div v-else>
    <span class="text-caption">{{cell(props.row,col)}}</span>
  </div>
</q-td>
</q-tr>

<template v-if="gridItems">
  <q-tr v-show="props.expand" :props="props">
    <q-td colspan="100%">
      <div class="text-left row q-col-gutter-xs window-width">
        <component
        v-for="(item, index) in gridItems"
        :key="index"
        :is="item.is"
        :fk="props.key"
        :parent-row="props.row"
        v-bind="item.props"
        :rows="props.row.items[index].rows"
        :summary="props.row.items[index].summary"
        :class="item.class"></component>
      </div>
    </q-td>
  </q-tr>
</template>
</template>

<template v-slot:item="props">
  <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
    <q-card flat>
      <q-card-actions >
        <q-space />
        <app-grid-actions-bar
        v-if="props.selected"
        :permitions="permitions"
        :buttons="buttonsTopLeft"
        :handler="handler">
      </app-grid-actions-bar>
    </q-card-actions>
    <q-list dense  @click="props.selected = !props.selected">
      <q-item v-for="(col, index) in props.cols.filter(item => !(item.value == '0,00' | item.value == '' |  item.value == null))" :key="col.name">

        <q-item-section>
          <q-item-label caption>{{ col.label }}</q-item-label></q-item-section>
          <q-item-section caption><q-item-label class="text-caption">
            <div v-if="col.editor">
              <component
              :is="col.editor.is"
              v-model="props.row[col.field]"
              :color="props.row[col.editor.fieldColor]"
              v-bind="col.editor"
              :options="options[col.field]"
              @update:model-value="handlerCol(col.field, props.row)">
            </component>
          </div>
          <div v-else>
            {{cell(props.row,col)}}
          </div>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</q-card>
<q-separator />
</div>
</template>

<template v-slot:no-data="scope">
  <div>{{scope.message}}</div>
  <q-space/>
  <q-btn
  icon="update"
  color="secondary"
  round
  dense
  flat
  @click="getData"
  />
</template>
<template v-slot:bottom-row="props">
  <q-tr v-if="grid.summary" class="text-weight-medium">
    <q-td>Total</q-td>
    <q-td v-for="col in props.cols" :key="col.name"
    class="text-right">{{money(total[col.name]) }}
  </q-td>
</q-tr>
</template>

<template v-slot:pagination="scope">
  <q-btn
  icon="update"
  color="secondary"
  round
  dense
  flat
  @click="getData"
  />
  <q-btn
  v-if="scope.pagesNumber > 2"
  icon="first_page"
  color="grey-8"
  round
  dense
  flat
  :disable="scope.isFirstPage"
  @click="scope.firstPage"
  />

  <q-btn
  icon="chevron_left"
  color="grey-8"
  round
  dense
  flat
  :disable="scope.isFirstPage"
  @click="scope.prevPage"
  />

  <q-btn
  icon="chevron_right"
  color="grey-8"
  round
  dense
  flat
  :disable="scope.isLastPage"
  @click="scope.nextPage"
  />

  <q-btn
  v-if="scope.pagesNumber > 2"
  icon="last_page"
  color="grey-8"
  round
  dense
  flat
  :disable="scope.isLastPage"
  @click="scope.lastPage"
  />
  <span v-if="scope.pagesNumber > 1"> Página {{scope.pagination.page}} / {{scope.pagesNumber}} de {{scope.pagination.rowsNumber}} registros</span>
</template>

</q-table>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import AppCrudExpand from 'components/AppCrudExpand.vue'
import AppCrudItem from 'components/AppCrudItem.vue'
import AppFormSection from 'components/AppFormSection.vue'
import AppGridActionsBar from 'components/AppGridActionsBar.vue'
import AppTabs from 'components/AppTabs.vue'
import AppMenuContext from 'components/AppMenuContext.vue'
import AppImportDialog from 'components/AppImportDialog.vue'
import AppFormDialog from 'components/AppFormDialog.vue'
import { gridMixin } from 'src/mixins/gridMixin.js'
import { optionsMixin } from 'src/mixins/optionsMixin.js'
import { configGridsMixin } from 'src/mixins/configGridsMixin.js'
import { money, clone, openODS, storage } from 'src/modules/utils.js'
import AppInput from 'components/AppInput.vue'
import AppDate from 'components/AppDate.vue'
import AppDateTime from 'components/AppDateTime.vue'
import AppCombobox from 'components/AppCombobox.vue'
import AppSelect from 'components/AppSelect.vue'
import { useAuthStore } from 'stores/auth-store'

export default defineComponent({
  name: 'AppCrud',
  mixins: [ gridMixin , optionsMixin, configGridsMixin ],
  components: {
    AppCrudExpand,
    AppCrudItem,
    AppFormSection,
    AppGridActionsBar,
    AppTabs,
    AppMenuContext,
    AppImportDialog,
    AppFormDialog,
    AppInput,
    AppDate,
    AppDateTime,
    AppCombobox,
    AppSelect
  },
  inheritAttrs: true,
  props: {
    grid: {
      title: String,
      table: String,
      primaryKey: String,
      foreignKey: String,
      columns: Array,
      menuContext: Array,
      visibleColumns: Array,
      formName: '',
      customHeader: {
        type: Boolean,
        default: () => true
      },
      summary: {
        type: Boolean,
        default: () => false
      },
      path: String,
      id: Number | String
    },
    form: {
      title: String,
      table: String,
      primaryKey: String,
      uniqueKey: String,
      fields: Object,
    },
    id: Number | String,
    fk: Number | String,
    parentRow: {
      type: Object,
      default: () => {}
    },
    readonly: Boolean,
    showTitle: {
      type: Boolean,
      default: () => false
    },
    showComboColumns: {
      type: Boolean,
      default: () => true
    },
  },
  data: () => {
    return {
      tab: '',
      navigationActive: false,
      selection: 'single',
      searchCustom: [],
      visibleColumns: [],
      aColumns: [],
      gridItems: [],
      total: {},
      money,
      evtStarted: Boolean,
      buttonsTopLeft: [],
      buttonsTopRight: [],
      showEditorHint: false
    }
  },
  methods: {
    hideCol(col){
      this.$refs[col][0].hide()
    },
    onRequest(col){
      this.getData()
      this.hideCol(col);
    },
    clearfilter(col, op){
      if(op == 'ini' || op == 'fin'){
        this.filter[col]['ini'] = '';
        this.filter[col]['fin'] = '';
      } else {
        this.filter[col][op] = '';
      }
      this.getData();
      this.hideCol(col);
    },
    btnColor(col) {
      let bgC = this.$q.dark.isActive ? 'grey-1' : 'grey-10';
      if(this.filter[col.field]){
        if(col.type == 'date' || col.type == 'dateTime'){
          return (this.filter[col.field].ini || this.filter[col.field].fin) ? 'accent' : bgC
        }
        else if(col.type == 'multiselect'){
          return (this.filter[col.field]['in'] !== undefined ? this.filter[col.field]['in'].length > 0 : false) ? 'accent' : bgC
        }
        else if (col.type == 'integer' || col.type == 'money') {
          return (this.filter[col.field].eq || this.filter[col.field].gt || this.filter[col.field].lt) ? 'accent' : bgC
        }
        else {
          return (this.filter[col.field].lk || this.filter[col.fieldFilter || col.field].eq ? 'accent' : bgC)
        }
      }
    },
    btnDisable(col) {
      if(this.filter[col.field]){
        if(col.type == 'date' || col.type == 'dateTime'){
          return (this.filter[col.field].ini && this.filter[col.field].fin) ? false : true
        }
        else if (col.type == 'integer' || col.type == 'money') {
          return (this.filter[col.field].eq || this.filter[col.field].gt || this.filter[col.field].lt) ? false : true
        }
        else {
          return (this.filter[col.field].lk || this.filter[col.field].st ? false : true)
        }
      }
    },
    importData () {
      this.$q.dialog({
        component: AppImportDialog,
        componentProps: {
          title: `Leiaute ${this.form.title}`,
          table: this.form.table,
          saveLote: this.form.saveLote ? this.form.saveLote : false,
          primaryKey: this.form.primaryKey,
          fields: this.form.fields,
          persistent: true,
        }
      })
      .onOk((data) => {
         if(data.success){
          this.$api.post('import', {
            nomeTabela: this.form.table,
            nomeChave: this.form.primaryKey,
            saveLote: this.form.saveLote,
            data: JSON.stringify(data.resultado),
            fields: JSON.stringify(data.fields),
          })
          .then(({data}) => {
             if(data.success){
              this.$q.notify({type: 'positive', timeout: 10000, message: data.msg})
              this.getData()
            } else {
              this.$q.notify({type: 'negative', timeout: 10000, message: data.msg})
            }
          })
        } else {
          this.$q.notify({type: 'negative', timeout: 10000, message: data.msg})
        }
      })
    },
    exportData(saida){
      this.loading = true;
      this.lockedAction = true;
      this.request({
        pagination: this.serverPagination,
        filter: this.filter,
        search: this.search,
        saida: saida
      }).then(({data}) => {
        this.lockedAction = false;
        this.loading = false;
        if(data.success){
          if(data.resultado.length > 0){
            openODS(data.resultado, data.titulo)
          } else {
            this.$q.notify({
              message: 'Sem dados para exportar',
              color: 'positive',
              icon: 'cancel'
            })
          }
        }else {
          this.$q.notify({
            message: data.msg,
            icon: 'cancel'
          })
        }
      })
    },
    showExpandButton(row){
      return this.grid.gridItems ? true : false
    },
    onDblClickEdit(props){
      if(this.permitions.edit){
        props.selected = true;
        let id = props.row[this.grid.primaryKey];
        this.editOrView('edit',id)
      }
    },
    onF9(){
      if(this.selected.length > 0 && this.permitions.edit) this.editOrView('edit', this.selected[0][this.grid.primaryKey]);
    },
    onRowClick(props){
      if(!this.grid.rowReorder){
        //
      }
    },
    onSelection(det) {},
    onSearch(field, arquments) {},
    cell(row,col) {
      if(col.format && row[col.field]) {
        return  col.format(row[col.field],row)
      }
      return row[col.field]
    },
    activateNavigation () {
      this.navigationActive = true
    },
    deactivateNavigation () {
      this.navigationActive = false
    },
    onKey (evt) {
      if (
        this.navigationActive !== true ||
        [120, 33, 34, 35, 36, 38, 40 ].indexOf(evt.keyCode) === -1 ||
        this.$refs.myTable === void 0
      ) {
        return
      }

      evt.preventDefault()

      const { computedRowsNumber, computedRows } = this.$refs.myTable

      if (this.data.length === 0) {
        return
      }

      const currentIndex = this.selected.length > 0 ? this.data.indexOf(this.selected[0]) : -1
      const currentPage = this.serverPagination.page
      const rowsPerPage = this.serverPagination.rowsPerPage === 0 ? computedRowsNumber : this.serverPagination.rowsPerPage
      const lastIndex = this.data.length - 1
      const lastPage = Math.ceil(computedRowsNumber / rowsPerPage)

      let index = currentIndex
      let page = currentPage

      switch (evt.keyCode) {
        case 120: // F9
        this.onF9();
        break
        case 36: // Home
        page = 1;
        index = 0;
        this.$refs.myTable.firstPage();
        break
        case 35: // End
        page = lastPage;
        index = rowsPerPage - 1;
        this.$refs.myTable.lastPage();
        break
        case 33: // PageUp
        page = currentPage <= 1 ? lastPage : currentPage - 1;
        if (index < 0) {
          index = 0
        };
        this.$refs.myTable.prevPage();
        break
        case 34: // PageDown
        page = currentPage >= lastPage ? 1 : currentPage + 1;
        if (index < 0) {
          index = rowsPerPage - 1;
        }
        this.$refs.myTable.nextPage();
        break
        case 38: // ArrowUp
        if (currentIndex <= 0) {
          page = currentPage <= 1 ? lastPage : currentPage - 1;
          index = rowsPerPage - 1;
          this.$refs.myTable.prevPage();
        }
        else {
          index = currentIndex - 1;
          this.selected = [ this.data[index] ];
        }
        break
        case 40: // ArrowDown
        if (currentIndex >= lastIndex) {
          page = currentPage >= lastPage ? 1 : currentPage + 1;
          index = 0;
          this.$refs.myTable.nextPage();
        }
        else {
          index = currentIndex + 1;
          this.selected = [ this.data[index] ];
        }
        break
      }
    }
  },
  computed: {
    rowsPerPageOptions(){
      return this.$q.screen.xs ?
      [5] :
      (this.grid.rowsPerPageOptions ? this.grid.rowsPerPageOptions : [5,10,15,20])
    },
    tableClass () {
      return this.navigationActive === true ? 'no-outline' : void 0
    },
  },
  mounted () {
    if(this.buttonsTopLeft.length == 0) this.buttonsTopLeft = clone(this.grid.buttonsTopLeft);
    if(this.buttonsTopRight.length == 0) this.buttonsTopRight = clone(this.grid.buttonsTopRight);
    this.gridItems = clone(this.grid.gridItems);
    if(!this.$q.platform.is.mobile){
      this.getConfigGrids().then(({data}) => {
        if(data.success) {
          if(data.total > 0){
            this.visibleColumns = JSON.parse(data.resultado[0]['VISIBLE_COLUMNS'])
          } else {
            this.visibleColumns = this.grid.visibleColumnsMobile ? this.grid.visibleColumnsMobile : this.grid.visibleColumns;
          }
        }
      })
      .catch(error =>{
      });
    };
    if(this.serverPagination.sortBy == undefined) {
      this.serverPagination.sortBy =  this.grid.primaryKey
    };
    if(useAuthStore().isAuth){
      this.permitions = clone(useAuthStore().permitions.filter(
        obj => obj.table == this.grid.table ? obj.permitions : null
      ).map(item => item.permitions)[0] || {})
    };

    if(this.$q.platform.is.mobile) {
      this.permitions.import = false
      this.selection = 'single';
      this.visibleColumns = this.grid.visibleColumnsMobile ? this.grid.visibleColumnsMobile : this.grid.visibleColumns;
    }
    if(this.summary) {
      this.total = this.summary
    }
    //this.permitions.view = !this.permitions.edit
    this.permitions.imprimir = this.permitions.export
    this.aColumns = clone(this.grid.columns)
  }
})
</script>
