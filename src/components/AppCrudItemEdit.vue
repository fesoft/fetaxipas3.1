<template>
  <div>
    <q-bar class="text-weight-bold rounded-bar">
      <q-space /><div class="justify-center">{{grid.title}}</div><q-space /></q-bar>
      <q-table
      ref="myTable"
      :class="tableClass"
      color="primary"
      :grid="true"
      :table="grid.table"
      :primaryKey="grid.primaryKey"
      :rows="rows"
      :columns="aGrid.columns"
      :visible-columns="visibleColumns"
      :selection="selection"
      v-model:selected="selected"
      :pagination="pagination"
      :row-key="grid.primaryKey"
      :rows-per-page-options="[6]"
      >
      <template v-if="grid.buttonsTopRight.length > 0" v-slot:top>
        <div  class="row q-gutter-sm" style="height:30px">
          <app-grid-actions-bar
          v-if="!readonly"
          v-show="selected.length == 0"
          :permitions="permitions"
          :buttons="grid.buttonsTopRight"
          :handler="handler">
        </app-grid-actions-bar>
      </div>
    </template>

    <template v-slot:item="props">
      <div class="q-pa-xs col-xs-12">
        <q-card flat>
          <q-card-section class="row q-px-none q-col-gutter-xs">
            <component
            :ref="col.name"
            v-for="col in props.cols"
            :key="col.name"
            v-model="props.row[col.name]"
            :is="col.editor.is"
            v-bind="col.editor"
            :options="col.editor.options || options[col.name]"
            :readonly="readonly"
            @update:model-value="formInput(col.name, props.row)"
            @blur="formBlur(col.name, props.row)"
            ></component>
            <q-btn v-if="!readonly" flat color="negative" icon="delete" @click.stop="formRemove(props.row)" />
          </q-card-section>
        </q-card>
      </div>
    </template>

  </q-table>
</div>

</template>

<script>
import { defineComponent } from 'vue'
import { money, clone } from 'src/modules/utils'
import { gridItemMixin } from 'src/mixins/gridItemMixin'
import AppGridActionsBar from 'components/AppGridActionsBar.vue'
import { useAuthStore } from 'stores/auth-store'

export default defineComponent({
  name: 'AppCrudItemEdit',
  mixins: [ gridItemMixin ],
  components: {
    AppGridActionsBar
  },
  data: () => {
    return {
      money,
      filter: '',
      selected: [],
      //total: [],
      navigationActive: true,
      pagination: {},
      visibleColumns: [],
      aGrid: {}
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
      fields: Object,
    },
    id: Number | String,
    fk: Number | String,
    none: Boolean,
    parentRow: {
      type: Object,
      default: () => {}
    },
    rows: Array,
    summary: Object,
    readonly: Boolean,
    pVisibleColumns: Array,
    options: {
      type: Object,
      default: () => {}
    },
  },
  methods: {
    formInput(field, val){},
    formBlur(field, row) {},
    cell(row,col) {
      if(col.format && row[col.field]) {
        return  col.format(row[col.field])
      }
      return row[col.field]
    },
    activateNavigation () {
      this.navigationActive = true
    },
    deactivateNavigation () {
      this.navigationActive = false
    },
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
    },
    pVisibleColumns (value){
      this.visibleColumns = value
    }
  },
  computed: {
    tableClass () {
      return this.navigationActive === true ? 'no-outline' : void 0
    }
  },
  mounted () {
    this.visibleColumns = this.grid.visibleColumns;
    this.aGrid = clone(this.grid)
    if(this.rows) {
      this.data = this.rows ? this.rows : []
    };
    if(this.summary) {
      this.total = this.summary ? this.summary : {}
    };
    this.selection = this.readonly ? 'none' : 'single';
    if(useAuthStore().isAuth){
      this.permitions = useAuthStore().permitions.filter(
        obj => obj.table == this.grid.table ? obj.permitions : null
      ).map(item => item.permitions)[0] || {}
    };
    if(this.$q.platform.is.mobile) {
      this.permitions.exportOld = this.permitions.export
      this.permitions.export = false
    }else {
      this.permitions.export = this.permitions.exportOld
    }
    if(this.permitions.edit) this.permitions.view = !this.permitions.edit;
  }
})
</script>
