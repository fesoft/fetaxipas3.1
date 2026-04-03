import { LocalStorage, SessionStorage, Platform } from 'quasar'
export const storage = Platform.is.mobile ? LocalStorage : SessionStorage;
export const token = () => storage.getItem('fp_token');

const escapeString = item => (typeof item === 'string') ? `"${item}"` : String(item);
const arrayToCsv = (arr, seperator = ';') => arr.map(escapeString).join(seperator);
const rowKeysToCsv = (row, seperator = ';') => arrayToCsv(Object.keys(row));
const rowToCsv = (row, seperator = ';') => arrayToCsv(Object.values(row));
const rowsToCsv = (arr, seperator = ';') => arr.map(row => rowToCsv(row, seperator)).join('\n');
const collectionToCsvWithHeading = (arr, seperator = ';') => `${rowKeysToCsv(arr[0], seperator)}\n${rowsToCsv(arr, seperator)}`;

export const formatarTempo = (totalMileSegundos) => {
  // Cálculo dos componentes
  const days = Math.floor(totalMileSegundos / (1000 * 60 * 60 * 24));
  const remainingMsAfterDays = totalMileSegundos % (1000 * 60 * 60 * 24);
  const hours = Math.floor(remainingMsAfterDays / (1000 * 60 * 60));
  const remainingMsAfterHours = remainingMsAfterDays % (1000 * 60 * 60);
  const minutes = Math.floor(remainingMsAfterHours / (1000 * 60));

  // Formatação condicional
  if (days > 0) {
    return `${days} dias`;
  } else if (hours >= 1) {
    return `${hours} hora e ${minutes} minutos`;
  } else {
    return `${minutes} minutos`;
  }
}

export  const getBase64 = (file) => {
       var reader = new FileReader();
       return new Promise((resolve, reject) => {
           reader.onerror = () => {
               reader.abort();
               reject(new DOMException("Problem parsing input file."));
           };
           reader.onload = () => {
               resolve(reader.result);
           };
           reader.readAsDataURL(file);
       });
   }

   export const openFile = (data, fileName) => {
   let content = data;
   var a = document.createElement('a');
   a.href = encodeURI(content);
   a.download = fileName ? fileName : 'Arquivo.pdf';
   a.click();
 };


export const getFileArrayBuffer = (file) => {
  var reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing input file."));
    };
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsArrayBuffer(file);
  });
}

export const SheetToJsonNode = (file, type = 'ods', options = {}) => {
  // Verifica se o objeto file possui um buffer
  if (!file || !file.buffer) {
      throw new Error('Objeto de arquivo inválido ou buffer não encontrado');
  }

  try {
      // Lê o buffer diretamente
      const workbook = XLSX.read(file.buffer, {
          type: 'buffer',
          bookType: type,
          cellDates: true
      });

      // Pega a primeira planilha
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      let opts = { ...options, raw: false,  defval: '' };

      // Converte para JSON
      return XLSX.utils.sheet_to_json(worksheet, opts);

  } catch (error) {
      throw new Error(`Erro na conversão: ${error.message}`);
  }
}


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


export const maskData = (str) => {
  if (typeof str !== 'string') return ''; // Garante que o input é string

  // Mascarar e-mails
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
    const [localPart, domain] = str.split('@');
    const maskedLocal = localPart.length <= 2
      ? localPart[0] + '*'.repeat(localPart.length - 1)
      : localPart[0] + '*'.repeat(Math.max(3, localPart.length - 2)) + localPart.slice(-1);
    return maskedLocal + '@' + domain;
  }

  // Mascarar telefones (padrão brasileiro)
  const digits = str.replace(/\D/g, '');
  if ([10, 11].includes(digits.length)) {
    const ddd = digits.substring(0, 2);
    const lastFour = digits.substring(digits.length - 4);
    const middle = '*'.repeat(digits.length - 6);
    return digits.length === 10
      ? `(${ddd}) ${middle}-${lastFour}`
      : `(${ddd}) ${digits[2]}${middle}-${lastFour}`;
  }

  // Mascarar nomes
  return str.split(/(\s+)/) // Mantém os espaços originais
    .map(part => {
      if (part.trim().length <= 1) return part;
      if (/^\s+$/.test(part)) return part; // Preserva espaçamento
      return part[0] + '*'.repeat(Math.max(2, part.length - 2)) + (part.length > 1 ? part.slice(-1) : '');
    })
    .join('');
}

export const verificarForcaSenha = (senha, nomeUsuario) => {
  let forca = 0;

  // Critério 1: Comprimento da senha
  if (senha.length >= 8) {
    forca += 1;
  }

  // Critério 2: Letras maiúsculas
  if (/[A-Z]/.test(senha)) {
    forca += 1;
  }

  // Critério 3: Letras minúsculas
  if (/[a-z]/.test(senha)) {
    forca += 1;
  }

  // Critério 4: Números
  if (/[0-9]/.test(senha)) {
    forca += 1;
  }

  // Critério 5: Caracteres especiais
  if (/[\W_]/.test(senha)) {
    forca += 1;
  }

  // Critério 6: Verificar se a senha contém 3 ou mais caracteres seguidos do nome do usuário
  if (nomeUsuario) {
    const nomeUsuarioLower = nomeUsuario.toLowerCase();
    const senhaLower = senha.toLowerCase();
    for (let i = 0; i <= nomeUsuarioLower.length - 3; i++) {
      const substring = nomeUsuarioLower.substring(i, i + 3);
      if (senhaLower.includes(substring)) {
        return 'FRACA';
      }
    }
  }

  // Critério 7: Verificar se a senha contém sequências numéricas ou alfabéticas
  const sequencias = [
    '0123456789', 'abcdefghijklmnopqrstuvwxyz', 'abcdefghijklmnopqrstuvwxyz'.toUpperCase()
  ];
  for (let seq of sequencias) {
    for (let i = 0; i <= seq.length - 3; i++) {
      const substring = seq.substring(i, i + 3);
      if (senha.includes(substring)) {
        return 'FRACA';
      }
    }
  }

  // Critério 8: Verificar se a senha contém números ou letras repetidas
  if (/(\d)\1{2,}/.test(senha) || /([a-zA-Z])\1{2,}/.test(senha)) {
    return 'FRACA';
  }

  // Avaliação da força da senha
  if (forca === 5) {
    return 'FORTE';
  } else if (forca >= 3) {
    return 'MODERADA';
  } else if (forca >= 2) {
    return 'FRACA';
  }
}

export const enviarMensagemWhatsApp = (numero, mensagem) => {
  // Formata o número sem espaços, parênteses ou traços
  numero = numero.replace(/\D/g, '');
  numero = '+55' + numero; // Adiciona o código do país (Brasil: +55)

  // Codifica a mensagem para a URL
  const mensagemCodificada = encodeURIComponent(mensagem);

  // Monta o link da API do WhatsApp
  const link = `https://wa.me/${numero}?text=${mensagemCodificada}`;

  // Abre o link em uma nova janela ou aba
  window.open(link, '_blank');
};

export const padronizarTexto = (nome) => {
    const conectivos = ['de', 'da', 'do', 'das', 'dos', 'e', 'a', 'ao', 'aos', 'o', 'as', 'os', 'em', 'no', 'na', 'nos', 'nas', 'com', 'para', 'por', 'sem', 'sob', 'sobre'];

    return nome
        .toLowerCase()
        .split(' ')
        .map((palavra, index, array) => {
            // Verifica se a palavra é um conectivo e não é a primeira palavra
            if (conectivos.includes(palavra) && index !== 0) {
                return palavra;
            }
            // Capitaliza a primeira letra de cada palavra
            return palavra.charAt(0).toUpperCase() + palavra.slice(1);
        })
        .join(' ');
}


