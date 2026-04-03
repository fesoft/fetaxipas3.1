<template>
  <div>
    <q-bar class="text-weight-bold">
      <q-space />
      <div class="justify-center">
        {{title || grid.title}}
      </div>
      <q-space />
    </q-bar>
    <div class="row q-gutter-sm" style="height:60px">
      <app-grid-actions-bar
      v-if="selected.length > 0"
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

  <component
  v-for="field in grid.searchComponent"
  :key="field.name"
  :is="field.is"
  :label="field.label"
  :stack-label="false"
  :options="field.options || options[field.name]"
  v-model="grid.filter[field.name]"
  @update:model-value="getData"
  borderless
  filled
  style="width: 150px"
  >
</component>

<q-space v-if="!$q.platform.is.mobile"/>

<q-select
v-if="!$q.screen.xs"
v-model="visibleColumns"
multiple
dense
options-dense
outlined
:display-value="$q.lang.table.columns"
emit-value
map-options
borderless
filled
:options="grid.columns"
option-value="name"
options-cover
@update:model-value="saveConfigGrids"
style="min-width: 150px">
</q-select>

</div>
<q-table
color="primary"
:table="grid.table"
:dense="!$q.platform.is.mobile"
:primaryKey="grid.primaryKey"
:rows="rows"
:columns="grid.columns"
:selection="selection"
v-model:selected="selected"
:visible-columns="visibleColumns"
:row-key="grid.primaryKey"
@selection="onSelection"
:rows-per-page-options="[5, 10, 20]"
:hide-pagination="grid.hidePagination ? true : false"
>

<template v-slot:body="props">
  <q-tr :props="props" @click="props.selected = !props.selected" :class="bgColorRow(props)">
    <q-td  auto-width v-show="!readonly">
      <q-checkbox dense v-model="props.selected" />
      <q-btn v-if="showExpandButton(props.row)" size="xs" round flat :icon="props.expand ? 'arrow_drop_up' : 'arrow_drop_down'" @click="props.expand = !props.expand" />
    </q-td>
    <q-td v-for="col in props.cols" :key="col.name" :props="props">
      <div v-if="col.editor">
        <component :is="col.editor.is"
        v-model="props.row[col.field]"
        v-bind="col.editor"
        dense
        @update:model-value="handlerCol(col.field, props.row)"
        ></component>
      </div>
      <div v-else class="text-no-wrap">
        {{cell(props.row,col)}}
      </div>
    </q-td>
  </q-tr>

  <template v-if="grid.gridItems">
    <q-tr v-show="props.expand" :props="props">
      <q-td colspan="100%">
        <div class="text-left row q-col-gutter-xs parant-width">
          <component
          v-for="(item, index) in grid.gridItems"
          :key="index"
          :is="item.is"
          :fk="props.key"
          :parent-row="props.row"
          v-bind="item.props"
          :rows="props.row.items ? props.row.items[index].rows : []"
          :class="item.class"
          >
        </component>
      </div>
    </q-td>
  </q-tr>
</template>
</template>

<template v-slot:bottom-row="props">
  <q-tr v-if="grid.summary" class="text-weight-medium">
    <q-td>{{summaryLabel}}</q-td>
    <q-td v-for="col in props.cols"
    :key="col.name"
    class="text-right">
    {{ money(total[col.name]) }}
  </q-td>
 </q-tr>
</template>

</q-table>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import AppCrudExpand from 'components/AppCrudExpand.vue'
import AppFormSection from 'components/AppFormSection.vue'
import AppGridActionsBar from 'components/AppGridActionsBar.vue'
import AppSearch from 'components/AppSearch.vue'
import AppMenuContext from 'components/AppMenuContext.vue'
import AppImportDialog from 'components/AppImportDialog.vue'
import AppFormDialog from 'components/AppFormDialog.vue'
import { gridItemMixin } from 'src/mixins/gridItemMixin.js'
import { optionsMixin } from 'src/mixins/optionsMixin.js'
import { configGridsMixin } from 'src/mixins/configGridsMixin.js'
import { money, clone, openPDF, openTXT, openODS, token, storage } from 'src/modules/utils.js'
import AppInput from 'components/AppInput.vue'
import AppDate from 'components/AppDate.vue'

export default defineComponent({
  name: 'AppCrudItem2',
  components: {
    AppCrudExpand,
    AppFormSection,
    AppGridActionsBar,
    AppSearch,
    AppMenuContext,
    AppImportDialog,
    AppFormDialog,
    AppInput,
    AppDate
  },
  mixins: [ gridItemMixin, configGridsMixin ],
  data: () => {
    return {
      selected: [],
      money: money,
      filter: {},
      selection: 'single',
      visibleColumns: [],
      buttonsTopLeft: [],
      buttonsTopRight: []
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
      path: String,
      id: Number | String
    },
    form: {
      title: String,
      table: String,
      primaryKey: String,
      fields: Object
    },
    id: Number | String,
    fk: Number | String,
    parentRow: {
      type: Object,
      default: () => {}
    },
    none: Boolean,
    rows: Array | Object,
    readonly: Boolean,
    summaryLabel: String
  },
  methods: {
    onSelection(details){
      //
    },
    showExpandButton(row){
      return this.grid.gridItems ? true : false
    },
    bgColorRow(props){
      if(props.dark){
        return  props.row[this.grid.colBgRow] > 0 ? 'bg-teal-10' : 'bg-grey-10'
      } else {
        return  props.row[this.grid.colBgRow] > 0 ? 'bg-teal-2' : 'bg-grey-2'
      }
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
    },
    summary (value) {
      this.total = value ? value : {}
    },
    readonly (value) {
      this.selection = value ? 'none' : 'single'
    }
  },
  computed:{
    title() {
      return this.grid.title
    },
    module () {
      return this.grid.table.toLowerCase()
    },
    total() {
      let d = this.selected.length > 0 ? this.selected : this.data
      var cols = this.grid.columns.filter(col => col.summary == true)
      .map(col => col.field);

      var aInit = cols.reduce((acc, cur, i) => {acc[cur] = 0; return acc;}, {});

      return d.reduce((acc, cur, i) => {
          for (var i = 0; i < cols.length; i++) {
            let field = cols[i];
            acc[field] = parseFloat(acc[field]) + parseFloat(cur[field]);
          }
          return acc;
        }, aInit)
      }
    },
    mounted () {
      if(this.buttonsTopLeft.length == 0) this.buttonsTopLeft = clone(this.grid.buttonsTopLeft);
      if(this.buttonsTopRight.length == 0) this.buttonsTopRight = clone(this.grid.buttonsTopRight);
      this.visibleColumns = this.grid.visibleColumnsMobile ? this.grid.visibleColumnsMobile : this.grid.visibleColumns;
      if(this.rows) {
        this.data = this.rows ? this.rows : []
      }
      this.selection = this.readonly ? 'none' : this.selection;
      if(token) {
        this.permitions = clone(storage.getItem('fp_permitions').filter(
          obj => obj.table == this.grid.table ? obj.permitions : null
        ).map(item => item.permitions)[0] || {})
      };
    }
  })
  </script>
