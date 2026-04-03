<template>
  <q-dialog ref="dialog" :persistent="persistent">
    <q-card class="q-dialog-plugin" :style="grid.style">
      <q-bar class="bg-secondary text-white">
        <div class="text-weight-bold justify-center">{{grid.title}}</div>
        <q-space />
        <div style="width:150px" class="text-right">
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Fechar</q-tooltip>
          </q-btn>
        </div>
      </q-bar>
      <q-card-section class="row" >
        <div class="scroll">
          <app-search v-model="filter"></app-search>
          <q-table
          color="primary"
          separator="cell"
          dense
          :rows="rows"
          :columns="grid.columns"
          :row-key="grid.primaryKey"
          :selection="grid.selection"
          v-model:selected="selected"
          :visible-columns="grid.visibleColumns"
          :filter="filter"
          :rows-per-page-options="[100]"
          v-model:pagination = "grid.pagination"
          @selection="onSelection"
          >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width v-if="grid.selection !=='none'" class="text-center">
                <q-checkbox dense v-model="props.selected" />
              </q-td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <div v-if="col.editor && col.editor.is == 'app-combobox'">
                  <component
                  :is="col.editor.is"
                  v-model="props.row[col.name]"
                  :options="options ? options[col.name] : []"
                  :disable="!props.selected"
                  @update:model-value="handlerCol(col.name, props.row)"
                  v-bind="col.editor">
                </component>
                </div>
                <div v-if="col.editor && col.editor.is !== 'app-combobox'">
                  <component
                  :is="col.editor.is"
                  v-model="props.row[col.name]"
                  v-bind="col.editor">
                </component>
                </div>
                <div v-else>
                  {{cell(props.row,col)}}
                </div>
              </q-td>
            </q-tr>

            <template v-if="grid.gridItems">
              <q-tr v-show="props.selected" :props="props">
                <q-td colspan="100%">
                  <div class="text-left row q-col-gutter-xs window-width">
                    <component
                    v-for="(item, index) in grid.gridItems"
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

          <template v-slot:bottom-row="props">
            <q-tr v-if="grid.summary" class="text-weight-medium">
              <q-td>{{summaryLabel}}</q-td>
              <q-td v-for="col in props.cols" :key="col.name"
              class="text-right">{{money(total[col.name]) }}
            </q-td>
          </q-tr>
        </template>

      </q-table>
    </div>
  </q-card-section>

  <q-card-actions align="center">
    <q-btn rounded color="secondary" size="sm" label="Ok" @click="onOKClick" />
    <q-btn rounded color="primary" size="sm" label="Sair" @click="onCancelClick" />
  </q-card-actions>
</q-card>

</q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import { money, clone } from 'src/modules/utils'
import AppSearch from 'components/AppSearch.vue'
import AppMoney from 'components/AppMoney.vue'
import AppCombobox from 'components/AppCombobox.vue'
import AppCrudExpand from 'components/AppCrudExpand.vue'

export default defineComponent({
  name: 'AppGridDialog',
  components: {
    AppSearch,
    AppMoney,
    AppCombobox,
    AppCrudExpand
  },
  data: () => {
    return {
      money,
      selected: [],
      filter: '',
      rows: [],
      options: {},
      btnClicked: false
    }
  },
  props: {
    grid: {
      title: String,
      table: String,
      primaryKey: String,
      columns: Array,
      visibleColumns: Array,
      selection: String,
      pagination: Object,
      filter: {},
      gridItems: {},
      style: {
        type: String,
        default: () => 'width: 800px; max-width: 95vw;'
      }
    },
    persistent: {
      type: Boolean,
      default: () => false
    },
    data: Array
  },
  methods: {
    cell(row,col) {
      if(col.format && row[col.field]) {
        return  col.format(row[col.field])
      }
      return row[col.field]
    },
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      //this.$emit('hide')
    },
    onOKClick () {
      if(!this.btnClicked){
        this.btnClicked = true
        let data = this.grid.selection == 'none' ?  this.rows : this.selected
        this.$emit('ok', data)
        this.hide()
        this.btnClicked = false
      }
    },
    onCancelClick () {
      this.hide()
    },
    onSelection(det) {},
    handlerCol(field, row) {}
  },
  computed: {
    total(){
      let data = this.selected.length > 0 ? this.selected : this.data
      var cols = this.grid.columns.filter(col => col.summary == true).map(col => col.field);
      var aInit = cols.reduce((acc, cur, i) => {
        acc[cur] = 0; return acc;}, {});
        return data.reduce((acc, cur, i) => {
          for (var i = 0; i < cols.length; i++) {
            let field = cols[i];
            acc[field] = parseFloat(acc[field]) + parseFloat(cur[field]);
          }
          return acc;
        }, aInit)
      },
      summaryLabel(){
        return this.selected.length > 0 ? 'Total selecionado': 'Total'
      },
      remainder(){
        return
      }
    },
    mounted(){
      this.rows = clone(this.data)
    }
  })
  </script>
