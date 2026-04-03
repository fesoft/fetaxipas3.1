<template>
  <div>
    <q-bar class="text-weight-bold">
      <app-search v-model="filter" dark style="width: 150px"></app-search>
      <q-space />
      <div class="text-weight-bold text-white justify-center">{{grid.title}}</div>
      <q-space />
    </q-bar>
    <q-table
    color="primary"
    :table="grid.table"
    :dense="!$q.platform.is.mobile"
    :rows="rows"
    :filter="filter"
    :columns="grid.columns"
    :visible-columns="grid.visibleColumns"
    :row-key="grid.primaryKey"
    :rows-per-page-options="[5, 10, 15, 20]">
    <template  v-slot:bottom-row="props">
      <q-tr v-if="grid.summary" class="text-weight-medium">
        <q-td v-for="col in props.cols" :key="col.name"
        class="text-right">{{money(total[col.name]) }}
      </q-td>
    </q-tr>
  </template>
</q-table>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import { money } from 'src/modules/utils'
import AppSearch from 'components/AppSearch.vue'

export default defineComponent({
  name: 'AppCrudExpand',
  components: {
    AppSearch
  },
  data: () => {
    return {
      data: [],
      money,
      filter: ''
    }
  },
  props: {
    rows: Array,
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
      }
    }
  },
  computed: {
    total(){
      var cols = this.grid.columns.filter(col => col.summary == true).map(col => col.field);
      var aInit = cols.reduce((acc, cur, i) => {
        acc[cur] = 0; return acc;}, {});
        return this.rows.reduce((acc, cur, i) => {
          for (var i = 0; i < cols.length; i++) {
            let field = cols[i];
            let v = cur[field] ? cur[field] : 0.00;
            acc[field] = parseFloat(acc[field]) + parseFloat(v);
          }
          return acc;
        }, aInit)
      }
    }
  })
  </script>
