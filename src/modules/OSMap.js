class OSMap {
  static URL_BASE = 'https://nominatim.openstreetmap.org/search?q=';
  static URL_PARAMS = '&format=json&limit=1';
  static URL_ROUTE = 'https://router.project-osrm.org/route/v1/driving/';

  #obterUserAgentOSM() {
    return 'fetaxi/3.0 (fesoft@fesoft.com.br; https://fetaxi.com.br)';
  }

  async obterCoordenadasOSM(endereco) {
    const url = OSMap.URL_BASE + encodeURIComponent(endereco) + OSMap.URL_PARAMS;

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': this.#obterUserAgentOSM() }
      });

      if (!response.ok) return false;

      const dados = await response.json();

      if (dados[0]?.lat && dados[0]?.lon) {
        return { latitude: dados[0].lat, longitude: dados[0].lon };
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async obterEnderecoOSM(lat, lng) {
    if (!lat || !lng) return false;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': this.#obterUserAgentOSM() }
      });

      if (!response.ok) return false;

      const dados = await response.json();

      if (dados?.error) {
        throw new Error('Erro ao obter endereço: ' + dados.error);
      }
      return dados.address || false;
    } catch (error) {
      return false;
    }
  }
  /*
      formatarEndereco(endereco, formato = 'simples') {
          if (!endereco) return '';

          const rua = endereco.road || endereco.street || endereco.footway || endereco.pedestrian || '';
          const numero = endereco.house_number || '';
          const bairro = endereco.suburb || endereco.neighbourhood || endereco.quarter || endereco.city_district || '';
          const cidade = endereco.city || endereco.town || endereco.village || endereco.municipality || '';
          const estado = endereco.state || '';
          const pais = endereco.country || '';

          switch (formato) {
              case 'padrao':
                  const partes = [];
                  if (rua) partes.push(rua + (numero ? ` ${numero}` : ''));
                  if (bairro) partes.push(bairro);
                  if (cidade) partes.push(cidade);
                  if (estado) partes.push(estado);
                  if (pais) partes.push(pais);
                  return partes.join(', ');

              case 'simples':
                  return `${cidade}, ${bairro || estado}, ${rua}, ${numero || 's/n'}`;

              default:
                  return [rua, numero, bairro, cidade, estado, pais]
                      .filter(Boolean)
                      .join(', ');
          }
      }
  */
  formatarEndereco(endereco, formato = 'simples') {
    if (!endereco) return '';
    //console.log('formatarEndereco', endereco, formato);
    // Novos campos adicionados
    const edificio = endereco.building || '';
    const empresa = endereco.industrial || endereco.man_made || endereco.amenity || endereco.shop || endereco.office || endereco.company || '';

    // Campos originais
    const rua = this.getRua(endereco);
    const numero = this.getNumero(endereco);
    const bairro = this.getBairro(endereco);
    const cidade = this.getCidade(endereco);
    const estado = this.getEstado(endereco);
    const pais = endereco.country || '';

    // Adiciona edifício/empresa antes da rua
    let ruaCompleta = [edificio, empresa].filter(Boolean).join(', ');
    ruaCompleta = ruaCompleta ? `${ruaCompleta}${rua ? ', ' + rua : ''}` : rua;

    switch (formato) {
      case 'padrao':
        const partes = [];
        if (ruaCompleta) partes.push(ruaCompleta + (numero ? ` ${numero}` : ''));
        if (bairro) partes.push(bairro);
        if (cidade) partes.push(cidade);
        if (estado) partes.push(estado);
        //if (pais) partes.push(pais);
        return partes.join(', ');

      case 'simples':
        return `${cidade}, ${bairro || estado}, ${ruaCompleta}, ${numero || 's/n'}`;

      default:
        return [ruaCompleta, numero, bairro, cidade, estado]
          .filter(Boolean)
          .join(', ');
    }
  }
  async obterEnderecoFormatadoOSM(lat, lng, formato = 'simples') {
    const endereco = await this.obterEnderecoOSM(lat, lng);
    return endereco ? this.formatarEndereco(endereco, formato) : '';
  }

  async autocompletarEndereco(enderecoParcial) {
    const url = OSMap.URL_BASE + encodeURIComponent(enderecoParcial) +
      '&format=json&countrycodes=br&limit=5&addressdetails=1';

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': this.#obterUserAgentOSM() }
      });

      if (!response.ok) return false;

      const sugestoes = await response.json();
      const resultado = [];

      for (const sugestao of sugestoes) {
        const address = sugestao.address || {};
        if (!address) continue;

        const item = {
          full_address: this.formatarEndereco(address, 'padrao') || '',
          latitude: sugestao.lat || null,
          longitude: sugestao.lon || null,
          place_id: sugestao.place_id || null,
          empresaOuEdificio: this.getEmpresaOuEdificio(address),
          rua: address.road || address.street || address.footway || address.pedestrian || '',
          numero: address.house_number || '',
          bairro: this.getBairro(address),
          cidade: this.getCidade(address),
          estado: this.getEstado(address),
          uf: this.getUF(this.getEstado(address)),
          cep: this.getCep(address)
        };
        resultado.push(item);
      }

      return resultado.length ? resultado : false;
    } catch (error) {
      return false;
    }
  }

  async reordenarEnderecosOSM(enderecos) {
    const coordenadas = [];

    for (const endereco of enderecos) {
      const coordenada = await this.obterCoordenadasOSM(endereco);
      if (coordenada) coordenadas.push(coordenada);
    }

    const rotaOtima = this.#resolverTSP(coordenadas);
    const enderecosReordenados = [];

    for (const coord of rotaOtima) {
      const endereco = await this.obterEnderecoOSM(coord.latitude, coord.longitude);
      if (endereco) enderecosReordenados.push(endereco);
    }

    return enderecosReordenados.join('|');
  }

  async tracarRotaOSM(enderecos) {
    const coordenadas = [];

    for (const endereco of enderecos) {
      const coordenada = await this.obterCoordenadasOSM(endereco);
      if (coordenada) coordenadas.push(coordenada);
    }

    const coordenadasStr = coordenadas
      .map(coord => `${coord.longitude},${coord.latitude}`)
      .join(';');

    const url = OSMap.URL_ROUTE + coordenadasStr + '?overview=full&geometries=geojson';

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': this.#obterUserAgentOSM() }
      });

      if (!response.ok) return false;

      const dados = await response.json();

      return dados.routes?.[0]?.geometry
        ? JSON.stringify(dados.routes[0].geometry)
        : false;
    } catch (error) {
      return false;
    }
  }

  #resolverTSP(coordenadas) {
    if (coordenadas.length === 0) return [];

    const rota = [];
    let atual = coordenadas.shift();
    rota.push(atual);

    while (coordenadas.length > 0) {
      let maisProximo = null;
      let distanciaMinima = Infinity;

      for (const [index, coord] of coordenadas.entries()) {
        const distancia = this.#calcularDistancia(atual, coord);
        if (distancia < distanciaMinima) {
          distanciaMinima = distancia;
          maisProximo = index;
        }
      }

      if (maisProximo === null) break;

      atual = coordenadas[maisProximo];
      rota.push(atual);
      coordenadas.splice(maisProximo, 1);
    }

    return rota;
  }

  #calcularDistancia(pontoA, pontoB) {
    const deg2rad = (deg) => deg * (Math.PI / 180);

    const lat1 = deg2rad(pontoA.latitude);
    const lon1 = deg2rad(pontoA.longitude);
    const lat2 = deg2rad(pontoB.latitude);
    const lon2 = deg2rad(pontoB.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return 6371 * c; // Distância em km
  }
  getRua(endereco) {
    if (!endereco) return '';
    const rua = endereco.road || endereco.street || endereco.footway || endereco.pedestrian || '';
    return rua;
  }
  getNumero(endereco) {
    if (!endereco) return '';
    const numero = endereco.house_number || '';
    return numero;
  }
  getBairro(endereco) {
    if (!endereco) return '';
    const bairro = endereco.suburb ||  endereco.village ||  endereco.neighbourhood || endereco.quarter || endereco.city_district || '';
    return bairro;
  }
  getCidade(endereco) {
    if (!endereco) return '';
    const cidade = endereco.city || endereco.town || endereco.municipality || '';
    return cidade;
  }
  getEstado(endereco) {
    if (!endereco) return '';
    const estado = endereco.state || '';
    return estado;
  }
  getEmpresaOuEdificio(endereco) {
    if (!endereco) return '';
    const empresa = endereco.industrial || endereco.man_made || endereco.amenity || endereco.shop || endereco.office || endereco.company || endereco.building || '';
    return empresa;
  }
  getCep(endereco) {
    if (!endereco) return '';
    const cep = endereco.postcode || '';
    return cep.replace(/\D/g, ''); // Remove caracteres não numéricos
  }
  getUF(estado) {
    const estados = {
        'acre': 'AC',
        'alagoas': 'AL',
        'amapa': 'AP',
        'amazonas': 'AM',
        'bahia': 'BA',
        'ceara': 'CE',
        'distrito federal': 'DF',
        'espirito santo': 'ES',
        'goias': 'GO',
        'maranhao': 'MA',
        'mato grosso': 'MT',
        'mato grosso do sul': 'MS',
        'minas gerais': 'MG',
        'para': 'PA',
        'paraiba': 'PB',
        'parana': 'PR',
        'pernambuco': 'PE',
        'piaui': 'PI',
        'rio de janeiro': 'RJ',
        'rio grande do norte': 'RN',
        'rio grande do sul': 'RS',
        'rondonia': 'RO',
        'roraima': 'RR',
        'santa catarina': 'SC',
        'sao paulo': 'SP',
        'sergipe': 'SE',
        'tocantins': 'TO'
    };

    // Normaliza o input: remove acentos, converte para minúsculas e remove espaços extras
    const normalized = estado
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .toLowerCase()
        .trim();

    return estados[normalized] || null; // Retorna null se não encontrar
}
}

// Exporte a classe se estiver usando módulos
export default OSMap;
