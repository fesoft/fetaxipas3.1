export const passageiro = {
  grid: {
    title: 'Passageiro',
    table: 'PASSAGEIRO',
    primaryKey: 'ID',
    foreignTable: '',
    foreignKey: '',
    path: 'dashboard/passageiro',
    formName: 'passageiro-form-dialog',
    customHeader: true,
    filter:{},
    summary: false,
    buttonsTopRight: [
      {
        is: 'q-btn',
        name: 'new',
        label:'Novo',
        color:'primary',
        size: 'sm'
      },
      {
        is: 'q-btn',
        name: 'import',
        label:'Importar',
        color:'primary',
        size: 'sm'
      },
      {
        is: 'q-btn',
        name: 'export',
        label:'Exportar',
        color:'secondary',
        size: 'sm'
      },
      {
        is: 'q-btn',
        name: 'linkPA',
        label:'link',
        color:'positive',
        size: 'sm'
      },
      /*{
      is: 'q-btn',
      name: 'deleteLote',
      label:'Excluir Lote',
      color:'negative',
      size: 'sm'
    }*/
  ],
  buttonsTopLeft: [
    {
      is: 'q-btn',
      name: 'edit',
      label:'Editar',
      color:'secondary',
      size: 'sm'
    },
    {
      is: 'q-btn',
      name: 'view',
      label:'Ver',
      color:'secondary',
      size: 'sm'
    },
    {
      is: 'q-btn',
      name: 'delete',
      label:'Excluir',
      color:'negative',
      size: 'sm'
    }
  ],
  columns: [
    {name: 'ID', field: 'ID', label: 'Código', style:'width:80px', align: 'right', type: 'integer',sortable: true,},
    {name: 'PASSAGEIRO_ID', field: 'PASSAGEIRO_ID', label: 'Matrícula', style:'width:80px', align: 'right', type: 'integer',sortable: true,},
    {name: 'NOME', field: 'NOME', label: 'Nome', style:'width:100px', align: 'left', type: 'text',sortable: true,},
    {name: 'ENDERECO', field: 'ENDERECO', label: 'Endereço', style:'width:100px', align: 'left', type: 'text',sortable: true,},
    {name: 'NUMERO', field: 'NUMERO', label: 'Número', style:'width:100px', align: 'left', type: 'text',sortable: true,},
    {name: 'BAIRRO', field: 'BAIRRO', label: 'Bairro', style:'width:100px', align: 'left', type: 'text',sortable: true,},
    {name: 'CIDADE', field: 'CIDADE', label: 'Cidade',  align: 'left', type: 'text',sortable: true,},
    {name: 'AREA_ID', field: 'AREA_ID', label: 'Área',  align: 'left', type: 'text',sortable: true,},
    {name: 'CENTRO_CUSTO_ID', field: 'CENTRO_CUSTO_ID', label: 'Centro de custo',  align: 'left', type: 'text',sortable: true,}
  ],
  visibleColumns: ['PASSAGEIRO_ID', 'NOME', 'ENDERECO', 'BAIRRO', 'CIDADE', 'AREA_ID', 'CENTRO_CUSTO_ID']
},
form: {
  title: 'Passageiro',
  table: 'PASSAGEIRO',
  view: 'PASSAGEIRO',
  primaryKey: 'ID',
  fields: [
    {is: 'q-separator',
    fields: [
      {is: 'app-input-number', name: 'PASSAGEIRO_ID', label: 'Matricula', readonly: true,visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'NOME', label: 'Nome', readonly: true, minlength: 0, maxlength: 50, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'ENDERECO', label: 'Endereço', required: true, minlength: 0, maxlength: 80, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'NUMERO', label: 'Número', required: false, minlength: 0, maxlength: 6, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'BAIRRO', label: 'Bairro', required: true, minlength: 0, maxlength: 30, visible: true, import: true,class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'PONTO_REF', label: 'Ponto de referência', required: false, minlength: 0, maxlength: 50, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'CIDADE', label: 'Cidade', required: true, minlength: 0, maxlength: 30, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'EMAIL', label: 'Email', readonly: true, minlength: 0, maxlength: 60, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input-number', name: 'TELEGRAM', label: 'Telegram/Whatsapp', required: true, minlength: 11, maxlength: 11, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-combobox', name: 'AREA_ID', label: 'Área', readonly: true, minlength: 0, maxlength: 20, visible: true, import: true,class:'col-xs-12 col-sm-6'},
      {is: 'app-combobox', name: 'CENTRO_CUSTO_ID', label: 'Centro de custo', readonly: true, minlength: 0, maxlength: 20, visible: true, import: true,class:'col-xs-12 col-sm-6'},
      //{is: 'app-input-number', name: 'ZONA', label: 'Zona', readonly: true, minlength: 0, maxlength: 3, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'input', name: 'ID', type: 'hidden',import: false, label: 'Código'},

    ]
  }
],
},
formPrimeiroAcesso: {
  title: 'Meu cadastro',
  table: 'PASSAGEIRO',
  primaryKey: 'ID',
  fields: [
    {is: 'app-form-section', name:'principal', label: 'Meus dados',
    fields: [
      {is: 'app-input-number', name: 'PASSAGEIRO_ID', label: 'Matricula', required: true,visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'NOME', label: 'Nome', required: true, minlength: 0, maxlength: 50, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'ENDERECO', label: 'Endereço', required: true, minlength: 0, maxlength: 80, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'NUMERO', label: 'Número', required: true, minlength: 0, maxlength: 6, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'BAIRRO', label: 'Bairro', required: true, minlength: 0, maxlength: 30, visible: true, import: true,class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'PONTO_REF', label: 'Ponto de referência', required: true, minlength: 0, maxlength: 50, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'CIDADE', label: 'Cidade', required: true, minlength: 0, maxlength: 30, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'EMAIL', label: 'Email', required: true, minlength: 0, maxlength: 60, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-input', name: 'CELULAR', type: 'tel',label: 'Celular', required: false, minlength: 11, maxlength: 11, visible: true, import: true,class:'col-xs-12 col-sm-6'},
      {is: 'app-input-number', name: 'TELEGRAM', label: 'Telegram/Whatsapp', required: true, minlength: 11, maxlength: 11, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'app-combobox', name: 'AREA_ID', label: 'Área', required: false, minlength: 0, maxlength: 20, visible: true, import: true,class:'col-xs-12 col-sm-6'},
      {is: 'app-combobox', name: 'CENTRO_CUSTO_ID', label: 'Centro de custo', required: false, minlength: 0, maxlength: 20, visible: true, import: true,class:'col-xs-12 col-sm-6'},
      //{is: 'app-input-number', name: 'ZONA', label: 'Zona', required: false, minlength: 0, maxlength: 3, visible: true,import: true, class:'col-xs-12 col-sm-6'},
      {is: 'input', name: 'ID', type: 'hidden',import: false, label: 'Código'},
    ]
  },
  {is: 'app-form-section', name:'login', label: 'login',
  fields: [
    {is: 'app-input', name: 'NOME_USUARIO', label: 'Nome usuário', readonly: true, disable: true, minlength: 0, maxlength: 60, visible: true,import: true, class:'col-xs-12 col-sm-6'},
    {is: 'app-input', type: 'password', name: 'SENHA', label: 'Senha', required: true, minlength: 0, maxlength: 60, visible: true,import: true, class:'col-xs-12 col-sm-6'},
  ],
}
]
}
}
