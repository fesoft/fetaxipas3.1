<template>
  <div v-show="fk > 0">
    <q-bar class="text-weight-bold">
      <q-space />
      <div class="justify-center">{{grid.title}}</div>
      <q-space />
    </q-bar>

    <div class="row q-gutter-sm" style="height:45px">
      <app-grid-actions-bar v-if="selected.length > 0 && !$q.platform.is.mobile"
        :permitions="permitions"
        :buttons="buttonsTopLeft"
        :handler="handler">
      </app-grid-actions-bar>

      <app-grid-actions-bar
      v-show="selected.length == 0 && !readonly"
      :permitions="permitions"
      :buttons="buttonsTopRight"
      :handler="handler">
    </app-grid-actions-bar>

    <component v-for="field in grid.searchComponent"
    :key="field.name"
    :is="field.is"
    :label="field.label"
    :stack-label="false"
    :options="field.options || options[field.name]"
    v-model="grid.filter[field.name]"
    @update:model-value="getData"
    borderless
    filled
    style="width: 150px">
  </component>
  <q-space />
  <app-search v-if="selected.length == 0 && !grid.searchComponent"
  v-model="filter"
  borderless
  filled
  style="width: 150px;height:30px;">
</app-search>
</div>

<q-markup-table>
  <thead>
    <tr>
      <th auto-width></th>
      <th v-for="col in grid.columns" :key="col.name" this="col">{{col.label}}</th>
    </tr>
  </thead>
<draggable  v-model="data" tag="tbody" @change="reorder">
  <q-tr v-for="row in data"  :key="row[grid.primaryKey]" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-1'">
    <q-td auto-width>
      <q-checkbox
      v-show="grid.fieldShowCheckBox ? !row[grid.fieldShowCheckBox] > 0 : true"
      dense
      v-model="row._selected"
      @click="btnSelected(row)"
      :disable="readonly" />
    </q-td>
    <q-td v-for="col in grid.columns"
    :key="col.name"
    :style="col.style">
    <div v-if="col.editor && !readonly">
      <component
      :is="col.editor.is"
      :options="col.editor.options || options[col.name]"
      v-model="row[col.field]"
      v-bind="col.editor"
      @update:model-value="handlerCol(col.field, row)">
    </component>
  </div>
  <div v-else>{{cell(row,col)}}</div>
</q-td>
</q-tr>
</draggable>
</q-markup-table>

<!--template v-slot:item="props">
<div
class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
:style="props.selected ? 'transform: scale(0.95);' : ''"
>
<q-card>
<q-card-actions  @click="props.selected = !props.selected">
<q-checkbox
dense
v-model="props.selected"
:label="row.name" />
<q-space />
<app-grid-actions-bar
v-if="selected.length > 0"
:permitions="permitions"
:buttons="buttonsTopLeft"
:handler="handler"
>
</app-grid-actions-bar>
</q-card-actions>
<q-separator />
<q-list dense>
<q-item v-for="(col, index) in props.cols.filter(item => item.value !== null)" :key="col.name">
<q-item-section>
<q-item-label caption>{{ col.label }}</q-item-label>
</q-item-section>
<q-item-section>
<q-item-label class="text-caption">
<div v-if="col.editor">
<component :is="col.editor.is"
v-model="row[col.field]"
:color="row[col.editor.fieldColor]"
v-bind="col.editor"
:options="options[col.field]"
@update:model-value="handlerCol(col.field, row)">
</component>
</div>
<div v-else>
{{cell(row,col)}}
</div>
</q-item-label>
</q-item-section>
</q-item>
</q-list>
</q-card>
</div>
</template>

<template v-slot:bottom-row="props">
<tr v-if="grid.summary" class="text-weight-medium">
<td>Total</td>
<td v-for="col in props.cols"
:key="col.name"
class="text-right">{{money(total[col.name]) }}
</td>
</tr>
<tr v-if="grid.remainder" class="text-weight-medium">
<td>{{grid.remainderLabel || Restante}}</td>
<td v-for="col in props.cols" :key="col.name" class="text-right">{{money(remainder[col.name])}}</td>
</tr>
</template-->
<!--div>
  <q-btn
  v-if="this.pagesNumber > 2"
  icon="first_page"
  color="grey-8"
  round
  dense
  flat
  :disable="this.isFirstPage"
  @click="this.firstPage"
  />

  <q-btn
  icon="chevron_left"
  color="grey-8"
  round
  dense
  flat
  :disable="this.isFirstPage"
  @click="this.prevPage"
  />

  <q-btn
  icon="chevron_right"
  color="grey-8"
  round
  dense
  flat
  :disable="this.isLastPage"
  @click="this.nextPage"
  />

  <q-btn
  v-if="this.pagesNumber > 2"
  icon="last_page"
  color="grey-8"
  round
  dense
  flat
  :disable="this.isLastPage"
  @click="this.lastPage"
  />
  <span> Página {{this.pagination.page}} / {{this.pagesNumber}} de {{this.pagination.rowsNumber}} registros</span>
</div-->

</div>
</template>

<script>
import { defineComponent } from 'vue'
import { gridItemMixin } from 'src/mixins/gridItemMixin'
import { money, clone, storage, token } from 'src/modules/utils'
import AppGridActionsBar from 'components/AppGridActionsBar.vue'
import AppSearch from 'components/AppSearch.vue'
import { VueDraggableNext } from 'vue-draggable-next'

export default defineComponent({
  name: 'AppCrudItemDrag',
  components:{
    AppGridActionsBar,
    AppSearch,
    draggable: VueDraggableNext,
  },
  mixins: [ gridItemMixin ],
  data: () => {
    return {
      money: money,
      permitions: {},
      filter: '',
      selected: [],
      buttonsTopLeft: [],
      buttonsTopRight: [],
    }
  },
  props: {
    grid: {
      title: String,
      table: String,
      primaryKey: String,
      foreignKey: String,
      columns: Array,
      visibleColumns: Array,
      summary: {
        type: Boolean,
        default: () => false
      },
      readonly: {
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
      fields: Object,
    },
    id: Number | String,
    fk: Number | String,
    parentRow: {
      type: Object,
      default: () => {}
    },
    none: Boolean,
    rows: Array | Object,
    readonly: {
      type: Boolean,
      default: () => false,
    },
    onSelection: Function,
    pVisibleColumns: Array
  },
  methods: {
    btnSelected(row){
      this.selected.splice(0, 1)
      this.data.filter(item => item !== row).map(item => item._selected = false);
      if(row._selected)  this.selected.push(row);
    },
    reorder(){
      this.data.forEach((record, index) => {
        record.ORDEM = index + 1;
        record['selected'] = false;
      });
    },
    cell(row,col) {
      if(col.format && row[col.field]) {
        return  col.format(row[col.field])
      }
      return row[col.field]
    }
  },
  watch: {
    rows (value) {
      this.data = value
      this.data.map(item => item._selected = false);
    },
    readonly (value) {
      this.selection = value ? 'none' : 'single'
    }
  },
  mounted () {
    if(this.buttonsTopLeft.length == 0) this.buttonsTopLeft = clone(this.grid.buttonsTopLeft);
    if(this.buttonsTopRight.length == 0) this.buttonsTopRight = clone(this.grid.buttonsTopRight);
    if(this.rows) {
      this.data = this.rows ? this.rows : []
    };
    this.selection = this.readonly ? 'none' : 'single';

    if(token) {
      this.permitions = clone(storage.getItem('permitions').filter(
        obj => obj.table == this.grid.table ? obj.permitions : null
      ).map(item => item.permitions)[0] || {})
    };
    if(this.$q.platform.is.mobile) {
      this.permitions.exportOld = this.permitions.export;
      this.permitions.export = false;
    }else {
      this.permitions.export = this.permitions.exportOld;
    }
    if(this.permitions.edit == undefined) this.permitions.edit = true;
    this.permitions.new = this.readonly ? false : this.permitions.new;
    //this.permitions.view = !this.permitions.edit;
    this.data.map(item => item._selected = false);
  },
  computed: {
    total(){
      var cols = this.grid.columns.filter(col => col.summary == true).map(col => col.field);
      var aInit = cols.reduce((acc, cur, i) => {
        acc[cur] = 0; return acc;}, {});
        return this.data.reduce((acc, cur, i) => {
          for (var i = 0; i < cols.length; i++) {
            let field = cols[i];
            acc[field] = parseFloat(acc[field]) + parseFloat(cur[field]);
          }
          return acc;
        }, aInit)
      },
      remainder(){
        return
      }
    }
  })
  </script>
