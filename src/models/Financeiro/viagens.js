import { formatDate } from 'src/modules/utils'

export const viagens = {
  grid: {
    title: 'Minhas viagens',
    table: 'VW_PROG_LIBERADA_COOP',
    primaryKey: 'PROGRAMACAO_ID',
    foreignTable: ['PROGRAMACAO_ITEM'],
    foreignKey: ['PROGRAMACAO_ID'],
    path: 'dashboard/vwprogliberadacoop',
    formName: 'vwprogliberadacoop-form-dialog',
    customHeader: false,
    canSelected: false,
    filter:{},
    summary: false,
    buttonsTopRight: [
    ],
    buttonsTopLeft: [
      {
        is: 'q-btn',
        name: 'edit',
        label:'Iniciar',
        color:'positive',
        size: 'sm'
      },
    ],
    columns: [
      {name: 'PROGRAMACAO_ID', field: 'PROGRAMACAO_ID', label: 'Código viagem/Tipo', style:'width:100px', align: 'right', type: 'integer',sortable: true, format:(val,row) => val + ' - ' + row.TIPO},
      {name: 'NOME_CLIENTE', field: 'NOME_CLIENTE', label: 'Cliente/Solicitante', style:'width:100px', align: 'left', type: 'text',sortable: true, format:(val,row) => val.substring(0,20) + ' - ' + row.SOLICITANTE},
      {name: 'SOLICITANTE', field: 'SOLICITANTE', label: 'Solicitante', style:'width:100px', align: 'left', type: 'text',sortable: true},
      {name: 'DATA_VIAGEM', field: 'DATA_VIAGEM', label: 'Data/Hora viagem', style:'width:100px', align: 'left', type: 'date',sortable: true, format:(val,row) => val + ' - ' + row.HORA_VIAGEM},
      {name: 'ROTEIRO_VIA_ID4', field: 'ROTEIRO_VIA_ID4', label: 'Via 2', style:'width:100px', align: 'right', type: 'integer',sortable: true,},
      {name: 'ROTEIRO_VIA_ID3', field: 'ROTEIRO_VIA_ID3', label: 'Via', style:'width:100px', align: 'right', type: 'integer',sortable: true,},
      {name: 'COD_INTERNO', field: 'COD_INTERNO', label: 'Chamado', style:'width:100px', align: 'right', type: 'integer',sortable: true,},
      {name: 'NUM_VOUCHER', field: 'NUM_VOUCHER', label: 'N. voucher', style:'width:100px', align: 'right', type: 'integer',sortable: true,},
      {name: 'NOME_ROTEIRO', field: 'NOME_ROTEIRO', label: 'Roteiro', style:'width:100px', align: 'left', type: 'text',sortable: true,format: val => val.substring(0,20)},
      {name: 'NOME_MOTIVO', field: 'NOME_MOTIVO', label: 'Descrição motivo', style:'width:100px', align: 'left', type: 'text',sortable: true,format: val => val.substring(0,20)},
      {name: 'DATA_SOLICITACAO', field: 'DATA_SOLICITACAO', label: 'Data/Hora solicitação', style:'width:100px', align: 'left', type: 'date',sortable: true, format:(val,row) => val + ' ' + row.HORA_SOLICITACAO},
      {name: 'OBSERVACAO', field: 'OBSERVACAO', label: 'Observação', style:'width:100px', align: 'left', type: 'text',sortable: true,format: val => val.substring(0,20)},
      {name: 'DATA_LIBERACAO', field: 'DATA_LIBERACAO', label: 'Data liberação', style:'width:100px', align: 'left', type: 'date',sortable: true,format: formatDate},
    ],
    visibleColumns: ['PROGRAMACAO_ID', 'NOME_CLIENTE', 'SOLICITACAO',  'DATA_VIAGEM', 'ROTEIRO_VIA_ID4', 'ROTEIRO_VIA_ID3', 'COD_INTERNO', 'NUM_VOUCHER', 'NOME_ROTEIRO', 'NOME_MOTIVO', 'OBSERVACAO'],
    visibleColumnsMobile: ['PROGRAMACAO_ID', 'NOME_CLIENTE', 'DATA_SOLICITACAO', 'DATA_VIAGEM', 'NOME_ROTEIRO',  'OBSERVACAO']
  },
  form: {
    title: 'Viagem atual',
    table: 'PROGRAMACAO',
    primaryKey: 'PROGRAMACAO_ID',
    dialogStyle: 'width: 800px; max-width: 70vw;',
    saveItems: false,
    fields: [
      {is: 'q-separator',
      fields: [
        {is: 'app-combobox', name: 'CLIENTE_ID', label: 'Cliente', disable: true,visible: true, class:'col-xs-9 col-sm-9'},
        {is: 'app-input', name: 'PROGRAMACAO_ID', label: 'Código', disable: true, visible: true, class:'col-xs-3 col-sm-3'},
        {is: 'app-input-number', name: 'NUM_VOUCHER', label: 'Voucher', required: false, minlength: 0, maxlength: 8, visible: true, class:'col-xs-12 col-sm-12'},
        {is: 'app-date', name: 'DATA_VIAGEM', label: 'Data viagem', disable: true,visible: true, class:'col-xs-6 col-sm-6'},
        {is: 'app-input', type: 'time', name: 'HORA_VIAGEM',label: 'Hora viagem', disable: true,visible: true, class:'col-xs-6 col-sm-6'},
        {is: 'app-combobox', name: 'ROTEIRO_ID', label: 'Roteiro',disable: true, visible: true, class:'col-xs-9 col-sm-9'},
        {is: 'app-money', name: 'VALOR',label: 'Valor', disable: true, inputClass: 'text-right', visible: true, class:'col-xs-3 col-sm-3'},
        {is: 'app-combobox', name: 'ROTEIRO_VIA_ID3', label: 'Via', required: false, visible: false, class:'col-xs-9 col-sm-9'},
        {is: 'app-money', name: 'VALOR_ADIC_VIA3',label: 'Valor via', disable: true, inputClass: 'text-right', visible: false, class:'col-xs-3 col-sm-3'},
        {is: 'app-combobox', name: 'ROTEIRO_VIA_ID4', label: 'Via 2', required: false, visible: false, class:'col-xs-9 col-sm-9'},

        {is: 'app-money', name: 'VALOR_ADIC_VIA4',label: 'Valor via 2', disable: true, inputClass: 'text-right', visible: false,class:'col-xs-3 col-sm-3'},
        {is: 'q-toggle', name: 'ROTEIRO_EXTREMO',trueValue: 'S', falseValue: 'N', label: 'Roteiro extremo?', required: false, options: [{value: 'S', label: 'Sim'}, {value: 'N', label: 'Não'}], visible: false, class:'col-xs-9 col-sm-9'},
        {is: 'app-money', name: 'VALOR_ADIC_5',label: 'Valor extremo', disable: true, inputClass: 'text-right',visible: false, class:'col-xs-3 col-sm-3'},
        {is: 'q-toggle', name: 'AR', trueValue: 'S', falseValue: 'N', label: 'Ar?', required: false, options: [{value: 'S', label: 'Sim'}, {value: 'N', label: 'Não'}], visible: false, class:'col-xs-9 col-sm-9'},
        {is: 'app-money', name: 'VALOR_ADIC_AR',label: 'Valor ar', disable: true,inputClass: 'text-right', visible: false, class:'col-xs-3 col-sm-3'},
        {is: 'q-toggle', name: 'ADIC_6', trueValue: 'S', falseValue: 'N', label: 'Outro distrito?', required: false, options: [{value: 'S', label: 'Sim'}, {value: 'N', label: 'Não'}], visible: false, import:false, class:'col-xs-9 col-sm-9'},
        {is: 'app-money', name: 'VALOR_ADIC_6',label: 'Valor distrito', disable: true, inputClass: 'text-right', visible: false, import:false, class:'col-xs-3 col-sm-3'},
        {is: 'q-toggle', name: 'RETORNO', trueValue: 'S', falseValue: 'N', label: 'Retorno?', required: false, options: [{value: 'S', label: 'Sim'}, {value: 'N', label: 'Não'}], visible: false, import:false, class:'col-xs-9 col-sm-9'},
        {is: 'app-money', name: 'VALOR_ADIC_RETORNO',label: 'Valor retorno', disable: true, inputClass: 'text-right', visible: false, import:false, class:'col-xs-3 col-sm-3'},
        {is: 'app-money', name: 'KM_RODADO',label: 'KM Rodado', required: false, visible: false, class:'col-xs-9 col-sm-9'},

        {is: 'app-money', name: 'VALOR_KM_RODADO',label: 'Valor KM', disable: true, inputClass: 'text-right', visible: false, class:'col-xs-3 col-sm-3'},
        //{is: 'app-combobox', name: 'MOTIVO_ID', label: 'Motivo', required: false, visible: true, class:'col-xs-12 col-sm-6'},
        {is: 'app-combobox', name: 'NUM_HORAS_PARADAS',label: 'Qtd de horas paradas', required: false, visible: true, class:'col-xs-9 col-sm-9'},
        {is: 'app-money', name: 'VALOR_HORAS_PARADAS',label: 'Valor HP', disable: true, inputClass: 'text-right', visible: true, class:'col-xs-3 col-sm-3'},
        {is: 'app-money', name: 'VALOR_PEDAGIO',label: 'Valor pedágio', required: false, visible: true, class:'col-xs-9 col-sm-9'},
        {is: 'app-money', name: 'VALOR_ADIC_OUTROS',label: 'Outros valores', required: false, inputClass: 'text-right',visible: true, class:'col-xs-3 col-sm-3'},
        //{is: 'app-money', name: 'VALOR_PEDAGIO2',label: 'Valor pedágio não embutido', required: false, visible: true, class:'col-xs-4 col-sm-4'},
        {is: 'app-money', name: 'VALOR_ESTACIONAMENTO',label: 'Estacionamento', required: false, visible: true, class:'col-xs-9 col-sm-9'},
        //{is: 'app-input', type:"number", name: 'QTD_PASSAGEIRO', label: 'Qtd. passageiro', required: true, minlength: 0, maxlength: 2, visible: true, class:'col-xs-3 col-sm-3'},

        {is: 'app-money', name: 'TOTAL',label: 'Total', readonly: true, inputClass: 'text-right text-h6', visible: true, class:'col-xs-3 col-sm-3'},
        {is: 'app-input', name: 'UNIDADE', label: 'Unidade',  visible: false, import:false, class:'col-xs-12 col-sm-12'},
        {is: 'app-input', name: 'COD_INTERNO', label: 'Chamado', readonly: true, visible:false, import:false, class:'col-xs-12 col-sm-12'},
        {is: 'app-input', name: 'OBSERVACAO', label: 'Observação', required: false, minlength: 0, maxlength: 50, visible: true, class:'col-xs-12 col-sm-12'},
      ]
    }
  ],
}
}
