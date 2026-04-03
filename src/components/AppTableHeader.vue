<template>
  <q-tr :props="props">
      <q-td auto-width><q-checkbox dense v-if="props.multipleSelect" v-model="props.selected" @click="props.selected = !props.selected"/></q-td>
      <q-td v-for="col in props.cols" :key="col.name" :props="props" :afilter="afilter">
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
               <q-item-section @click="$emit('col-sort', {field: col.field, descending:false})">Ordem crescente</q-item-section>
             </q-item>
             <q-item clickable v-close-popup>
               <q-item-section @click="$emit('col-sort', {field: col.field, descending:true})">Ordem decrescente</q-item-section>
             </q-item>
               <q-item  v-if="col.type == 'text'">
               <q-item-section class="q-col-gutter-xs">
                  <app-input clearable v-model="afilter[col.field]['st']" label="Iniciado em" @clear="onRequest(col.field)" @keyup.enter="onRequest(col.field)"></app-input>
                  <app-input clearable v-model="afilter[col.field]['lk']" label="Contendo" @clear="onRequest(col.field)" @keyup.enter="onRequest(col.field)"></app-input>
                <q-btn flat size="sm" color="grey-7" label="Preencher e Enter" icon="search" :disable="btnDisable(col)" @click="onRequest(col.field)"></q-btn>
               </q-item-section>
             </q-item>
             <q-item  v-if="col.type == 'integer' || col.type == 'money'">
               <q-item-section class="q-col-gutter-xs">
                  <app-input type="number" label="=" clearable v-model="afilter[col.field]['eq']" @clear="onRequest(col.field)" @keyup.enter="onRequest(col.field)"></app-input>
                  <app-input type="number" label=">" clearable v-model="afilter[col.field]['gt']" @clear="onRequest(col.field)" @keyup.enter="onRequest(col.field)"></app-input>
                  <app-input type="number" label="<" clearable v-model="afilter[col.field]['lt']" @clear="onRequest(col.field)" @keyup.enter="onRequest(col.field)"></app-input>
                  <q-btn flat size="sm" color="grey-7" label="Preencher e Enter" icon="search" :disable="btnDisable(col)" @click="onRequest(col.field)"></q-btn>
                </q-item-section>
             </q-item>
             <q-item  v-if="col.type == 'date'">
               <q-item-section class="q-col-gutter-xs">
                  <app-date label="Inicial" clearable v-model="afilter[col.field]['ini']" @clear="clearfilter(col.field,'ini')"></app-date>
                  <app-date label="Final" clearable v-model="afilter[col.field]['fin']" @clear="clearfilter(col.field,'fin')" @keyup.enter="onRequest(col.field)"></app-date>
                  <q-btn flat size="sm" color="grey-7" label="Preencher e Enter" icon="search" :disable="btnDisable(col)" @click="onRequest(col.field)"></q-btn>
                </q-item-section>
             </q-item>
           </q-list>

       </q-btn-dropdown>
      </q-td>
    </q-tr>
</template>

<script>
import { defineComponent } from 'vue'
import AppInput from 'components/AppInput.vue'
import AppDate from 'components/AppDate.vue'

export default defineComponent({
  name: 'AppTableHeader',
  components: {
    AppInput,
    AppDate
  },
  props: {
    props: Object,
    afilter:{
      type: Object | Array,
      default: () => {}
    }
  },
  methods: {
    hide(col){
      this.$refs[col][0].hide()
    },
    clearfilter(col, op){
      if(op == 'ini' || op == 'fin'){
        this.afilter[col]['ini'] = '';
        this.afilter[col]['fin'] = '';
      } else {
        this.afilter[col][op] = '';
      }
      this.$emit('request');
      this.hide(col);
    },
    onRequest(col){
      this.$emit('request');
      this.hide(col);
    },
    btnColor(col) {
      let bgC = this.$q.dark.isActive ? 'grey-1' : 'grey-10';
      if(this.afilter[col.field]){
        if(col.type == 'date'){
          return (this.afilter[col.field].ini || this.afilter[col.field].fin) ? 'accent' : bgC
        }
        else if (col.type == 'integer' || col.type == 'money') {
          return (this.afilter[col.field].eq || this.afilter[col.field].gt || this.afilter[col.field].lt) ? 'accent' : bgC
        }
        else {
          return (this.afilter[col.field].lk || this.afilter[col.field].st ? 'accent' : bgC)
        }
      }
    },
    btnDisable(col) {
      if(this.afilter[col.field]){
        if(col.type == 'date'){
          return (this.afilter[col.field].ini && this.afilter[col.field].fin) ? false : true
        }
        else if (col.type == 'integer' || col.type == 'money') {
          return (this.afilter[col.field].eq || this.afilter[col.field].gt || this.afilter[col.field].lt) ? false : true
        }
        else {
          return (this.afilter[col.field].lk || this.afilter[col.field].st ? false : true)
        }
      }
    }
  },
  computed: {
    ruleDate(){
      return [v => v ? /(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/([12]\d{3})/.test(v) : true || '']
    }
  }
})
</script>
