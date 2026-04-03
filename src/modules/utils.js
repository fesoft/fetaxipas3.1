//import * as XLSX from 'xlsx/xlsx.mjs'
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.19.3/package/xlsx.mjs"

import { LocalStorage, SessionStorage, Platform } from 'quasar'
export const storage = Platform.is.mobile ? LocalStorage : SessionStorage;
export const token = () => storage.getItem('fp_token');

const escapeString = item => (typeof item === 'string') ? `"${item}"` : String(item);
const arrayToCsv = (arr, seperator = ';') => arr.map(escapeString).join(seperator);
const rowKeysToCsv = (row, seperator = ';') => arrayToCsv(Object.keys(row));
const rowToCsv = (row, seperator = ';') => arrayToCsv(Object.values(row));
const rowsToCsv = (arr, seperator = ';') => arr.map(row => rowToCsv(row, seperator)).join('\n');
const collectionToCsvWithHeading = (arr, seperator = ';') => `${rowKeysToCsv(arr[0], seperator)}\n${rowsToCsv(arr, seperator)}`;

export const openCSV = (data, fileName) => {
  var universalBOM = "\uFEFF";
  var csvContent = collectionToCsvWithHeading(data);
  csvContent = "data:application/vnd.ms-excel;charset=utf-8'," + universalBOM + csvContent;
  var a = document.createElement('a');
  a.href = encodeURI(csvContent);
  a.download = fileName ? fileName : 'Planilha.csv';
  a.click();
};
export const openODS = (data, fileName, header = []) => {
  fileName = fileName == undefined ? 'Planilha.ods' : fileName + '.ods';
  if(header.length > 0){
    var ws = XLSX.utils.aoa_to_sheet([header]);
    let skipHeader = true;
    XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: -1, sheetStubs: true });
  } else {
    var ws = XLSX.utils.json_to_sheet(data);
  }
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Planilha 1");
  XLSX.writeFile(wb, `${fileName}`);
};
export const openPDF = (data, fileName) => {
  let content = "data:application/pdf;base64," + data;
  var a = document.createElement('a');
  a.href = encodeURI(content);
  a.download = fileName ? fileName : 'Arquivo.pdf';
  a.click();
};
export const openTXT = (txt, fileName) => {
  var a = document.createElement('a');
  let csvContent = "data:plan/text;charset=utf-8'," +  txt;
  a.href = encodeURI(csvContent);
  a.download = fileName ? fileName : 'Arquivo.txt';
  a.click();
};
export const clone = (obj) => {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
}
export const formatDate = val => val;
export const formatDateTime = val => val.replace('00:00', '');
export const sortValue = (a, b) => parseInt(a, 10) - parseInt(b, 10);

export const money = (val, precision = 2) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    //style: 'currency',
    //currency: 'BRL',
    minimumFractionDigits: precision
  });
  return val ? formatter.format(val) : null
}


export const showPasswordForce = (valor) => {
  var d = 'BAIXA';
  let ERaz = /[a-z]/;
  let ERAZ = /[A-Z]/;
  let ER09 = /[0-9]/;
  let ERxx = /[@!#$%&*+=?|-]/;

  if(valor.length < 5){
    d = 'BAIXA';
  } else {
    if(
      valor.length > 7 &&
      valor.search(ERaz) != -1 &&
      valor.search(ERAZ) != -1 &&
      valor.search(ER09) != -1 || valor.length > 7 &&
      valor.search(ERaz) != -1 &&
      valor.search(ERAZ) != -1 &&
      valor.search(ERxx) || valor.length > 7 &&
      valor.search(ERaz) != -1 &&
      valor.search(ERxx) != -1 &&
      valor.search(ER09) || valor.length > 7  &&
      valor.search(ERxx) != -1 && valor.search(ERAZ) != -1 &&
      valor.search(ER09)
    ){
      d ='ALTA';
    } else {
      if(
        valor.search(ERaz) != -1 &&
        valor.search(ERAZ) != -1 || valor.search(ERaz) != -1 &&
        valor.search(ER09) != -1 || valor.search(ERaz) != -1 &&
        valor.search(ERxx) != -1 ||valor.search(ERAZ) != -1 &&
        valor.search(ER09) != -1 ||valor.search(ERAZ) != -1 &&
        valor.search(ERxx) != -1 ||valor.search(ER09) != -1 &&
        valor.search(ERxx) != -1
      ){
        d ='MEDIA';
      } else {
        d ='BAIXA';
      }
    }
  }
  return d
}
export const statusFornecimento = (val) => {
  switch (val) {
    case 'N': return 'Aberta'; break;
    case 'A': return 'Aprovada'; break;
    case 'F': return 'Finalizada'; break;
    case 'D': return 'Devolvida'; break;
  }
}

export const validaCpf = (cpf) => {
      cpf = cpf.replace(/[^\d]+/g, '')
      var ttcaracters = cpf.length

      if (cpf === '') return false
      if (ttcaracters !== 11 || cpf === '00000000000' || cpf === '11111111111' || cpf === '22222222222' || cpf === '33333333333' || cpf === '44444444444' || cpf === '55555555555' || cpf === '66666666666' || cpf === '77777777777' || cpf === '88888888888' || cpf === '99999999999') return false
      if (ttcaracters !== 11 || /([0]{11})|([1]{11})|([2]{11})|([3]{11})|([4]{11})|([5]{11})|([6]{11})|([7]{11})|([8]{11})|([9]{11})/.test(cpf)) return false

      const m1 = Array.from({ length: 11 }, (k, v) => v)
        .reverse()
        .slice(0, 9)
      const m2 = Array.from({ length: 12 }, (k, v) => v)
        .reverse()
        .slice(0, 10)

      let tempCpf
      let soma
      let resto
      let digito

      tempCpf = cpf.substring(0, 9)
      soma = 0

      for (let i = 0; i < 9; i++) soma += parseInt(tempCpf[i].toString()) * m1[i]

      resto = soma % 11
      resto = resto >= 2 ? 11 - resto : 0

      digito = resto.toString()
      tempCpf = tempCpf + digito

      soma = 0
      for (let i = 0; i < 10; i++) soma += parseInt(tempCpf[i].toString()) * m2[i]

      resto = soma % 11
      resto = resto >= 2 ? 11 - resto : 0

      digito = digito + resto.toString()

      return cpf.endsWith(digito)
    }
    export const str_pad = (input, pad_length, pad_string, pad_type) => {
      //  discuss at: http://phpjs.org/functions/str_pad/
      // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // improved by: Michael White (http://getsprink.com)
      //    input by: Marco van Oort
      // bugfixed by: Brett Zamir (http://brett-zamir.me)
      //   example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');
      //   returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
      //   example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
      //   returns 2: '------Kevin van Zonneveld-----'

      var half = '',
        pad_to_go;

      var str_pad_repeater = function(s, len) {
        var collect = '',
          i;

        while (collect.length < len) {
          collect += s;
        }
        collect = collect.substr(0, len);

        return collect;
      };

      input += '';
      pad_string = pad_string !== undefined ? pad_string : ' ';

      if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
        pad_type = 'STR_PAD_RIGHT';
      }
      if ((pad_to_go = pad_length - input.length) > 0) {
        if (pad_type === 'STR_PAD_LEFT') {
          input = str_pad_repeater(pad_string, pad_to_go) + input;
        } else if (pad_type === 'STR_PAD_RIGHT') {
          input = input + str_pad_repeater(pad_string, pad_to_go);
        } else if (pad_type === 'STR_PAD_BOTH') {
          half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
          input = half + input + half;
          input = input.substr(0, pad_length);
        }
      }

      return input;
    }

  export const statusProg = (val,row) => {
  switch (val) {
    case 'I': return 'Criada'; break;
    case 'V': return 'Enviada'; break;
    case 'A': return 'Confirmada'; break;
    case 'L': return 'Em andamento'; break;
    case 'E': return 'Finalizada'; break;
    case 'C': return 'Cancelada'; break;
  }
};
