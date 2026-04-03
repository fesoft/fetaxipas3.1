<template>
  <div v-show="fk > 0">
    <q-bar class="text-weight-bold">
      <q-space />
      <div class="justify-center">{{grid.title}}</div>
      <q-space />
    </q-bar>
      <q-table
      color="primary"
      ref="table"
      :grid="$q.screen.xs"
      :table="grid.table"
      :dense="!$q.platform.is.mobile"
      :primaryKey="grid.primaryKey"
      :rows="data"
      :columns="grid.columns"
      :selection="selection"
      v-model:selected="selected"
      :visible-columns="grid.visibleColumns"
      :row-key="grid.primaryKey"
      :filter="filter"
      :rows-per-page-options="[5, 10, 20]">

      <template v-slot:top>
        <div class="row q-gutter-sm" style="height:40px">
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
</template>

<template v-slot:body="props">
  <q-tr :props="props">
    <q-td auto-width>
      <q-checkbox
      v-show="grid.fieldShowCheckBox ? !props.row[grid.fieldShowCheckBox] > 0 : true"
      dense
      v-model="props.selected"
      :disable="readonly" />
    </q-td>
    <q-td v-for="col in props.cols"
    :key="col.name"
    :props="props">
    <div v-if="col.editor && !readonly">
      <component
      :is="col.editor.is"
      :options="col.editor.options || options[col.name]"
      v-model="props.row[col.field]"
      v-bind="col.editor"
      @update:model-value="handlerCol(col.field, props.row)">
    </component>
  </div>
  <div v-else>{{cell(props.row,col)}}</div>
</q-td>
</q-tr>
</template>

<template v-slot:item="props">
  <div
  class="q-pa-xs col-xs-12 col-sm-6 col-sm-4 col-lg-3 grid-style-transition"
  :style="props.selected ? 'transform: scale(0.95);' : ''"
  >
  <q-card>
    <q-card-actions  @click="props.selected = !props.selected">
      <q-checkbox
      dense
      v-model="props.selected"
      :label="props.row.name" />
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
</div>
</template>

<template v-slot:bottom-row="props">
  <q-tr v-if="grid.summary" class="text-weight-medium">
    <q-td>Total</q-td>
    <q-td v-for="col in props.cols"
    :key="col.name"
    class="text-right">{{money(total[col.name]) }}
  </q-td>
</q-tr>
<q-tr v-if="grid.remainder" class="text-weight-medium">
  <q-td>{{grid.remainderLabel || Restante}}</q-td>
  <q-td v-for="col in props.cols" :key="col.name" class="text-right">{{money(remainder[col.name])}}</q-td>
</q-tr>
</template>

</q-table>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import { gridItemMixin } from 'src/mixins/gridItemMixin'
import { money, clone, storage, token } from 'src/modules/utils'
import AppGridActionsBar from 'components/AppGridActionsBar.vue'
import AppSearch from 'components/AppSearch.vue'

export default defineComponent({
  name: 'AppCrudItem',
  components:{
    AppGridActionsBar,
    AppSearch
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
    rows: Array,
    readonly: {
      type: Boolean,
      default: () => false,
    },
    onSelection: Function,
    pVisibleColumns: Array,
  },
  methods: {
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
      this.permitions = clone(storage.getItem('fp_permitions').filter(
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
    this.permitions.view = !this.permitions.edit;

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
    },
    mounted () {
      this.data = clone(this.rows)
    }
  })
  </script>
