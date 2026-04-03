import { openPDF } from 'src/modules/utils'

export const gridProgramacaoMixin = {
  methods: {
    handler(action) {
      if(this.lockedAction == false){
        let id = this.selected.length > 0 ? this.selected[0][this.grid.primaryKey] : undefined;
        switch (action) {
          case 'new': this.formNew(); break;
          case 'view':this.editOrView(action, id); break;
          case 'edit':this.editOrView(action, id); break;
          case 'cancel':this.cancelarProg(id); break;
          case 'delete': this.formRemove(id); break;
          case 'import': this.importData('CSV'); break;
          case 'export': this.exportData('ODS'); break;
          case 'progFixa': this.progFixa(id); break;
          case 'retornoProg': this.retorno(this.selected[0]); break;
          case 'enviarMsgProgLiberada': this.enviarMsgProgLiberada(id); break;
          case 'loteProg': this.loteProg(id); break;
          case 'liberarProg': this.liberarProg(id); break;
          case 'imprimirProg': this.imprimirProg(id); break;
          case 'reverterProgLiberada': this.reverterProg(id, 'A'); break;
          case 'reverterProgEncerrada': this.reverterProg(id, 'L'); break;
          case 'reverterProgCancelada': this.reverterProg(id, 'L'); break;
          case 'solRecebida': this.solRecebida(); break;
          default:
          this.$q.notify('Ação não definida')
        }
      }
    },
    cancelarProg (id) {
      if(id > 0){
        this.$q.dialog({
          title: 'Confirmação',
          message: `Tem certeza que quer cancelar a programação ${id}?`,
          ok: 'Sim',
          cancel: 'Não'
        })
        .onOk(() => {
          this.$api.get(`/programacao/cancelar/${id}`)
          .then(({data}) => {
            if(data.success){
              this.selected = []
              this.$q.notify({
                message: `A programação '${id}' foi cancelada!`,
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
      } else {
        this.$q.notify({
          message: 'Selecione uma programação',
          type: 'negative'
        })
      }
    },
    imprimirProg(id) {
      this.lockedAction = true;
      this.$api.get(`/programacao/imprimir/${id}`)
      .then(({data}) => {
        this.lockedAction = false;
        if(data.success){
          openPDF(data.tmpFileName, `Prog${id}.pdf`)
        }else {
          this.$q.notify({type: 'negative', message: data.msg})
        }
      })
    },
    enviarMsgProgLiberada (id) {
      this.$api.get(`/programacao/notificar/${id}`)
      .then(({data}) => {
        if(data.success){
          this.$q.notify({
            message: `Mensagem enviada!`,
            icon: 'done',
            type: 'positive',
            color: 'positive'
          })
        }else {
          this.$q.notify({type: 'negative', message: data.msg})
        }
      })
    },
    retorno (item) {
      if(!item.DATA_RETORNO) {
        this.$q.notify('Data do retorno em branco!')
      }
      else {
        this.$q.dialog({
          title: 'Confirmação',
          message: 'Tem certeza que quer criar a programação de retorno?',
          ok: 'Sim',
          cancel: 'Não'
        })
        .onOk(() => {
          this.lockedAction = true;
          let id = item[this.grid.primaryKey];
          this.$api.get(`/programacao/retorno/${id}`)
          .then(({data}) => {
            this.lockedAction = false;
            if(data.success){
              this.selected = []
              this.$q.notify({
                message: `Programação de retorno criada com sucesso!`,
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
      }
    },
    reverterProg (id, newStatus) {
      this.$q.dialog({
        title: 'Confirmação',
        message: `Tem certeza que deseja reverter status da programação ${id}?`,
        ok: 'Sim',
        cancel: 'Não'
      })
      .onOk(() => {
        this.lockedAction = true;
        let params = {
          _status: newStatus
        };
        this.$api.get(`/programacao/reverter/${id}`, {params})
        .then(({data}) => {
          this.lockedAction = false;
          if(data.success){
            let msg = newStatus == 'A' ? `Programação ${id} voltou para o status de aberta!` : `Programação ${id} voltou para o status de liberada!`;
            this.selected = [];
            this.$q.notify({
              message: msg,
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
  },
}
