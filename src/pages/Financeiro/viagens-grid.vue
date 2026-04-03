<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Cabeçalho moderno -->
      <div class="col-12">
        <div class="text-h5 text-weight-bold text-grey-9 q-mb-md">
          🚗 Viagens Programadas
          <q-badge v-if="data.length > 0" color="teal" class="q-ml-sm">
            {{ data.length }} {{ data.length === 1 ? 'viagem' : 'viagens' }}
          </q-badge>
        </div>
      </div>

      <!-- Cards de viagem -->
      <template v-if="data.length > 0">
        <div 
          class="col-12 col-sm-6 col-md-4" 
          v-for="(row, index) in data" 
          :key="index"
        >
          <q-card class="modern-card q-mb-sm" flat bordered>
            <!-- Cabeçalho do card com gradiente -->
            <div class="bg-gradient-teal q-pa-md text-white">
              <div class="row items-center">
                <div class="col-auto">
                  <q-avatar size="60px" class="shadow-3">
                    <img 
                      v-if="row.FOTO_MOTORISTA" 
                      :src="row.FOTO_MOTORISTA" 
                      :alt="row.NOME_MOTORISTA"
                      class="avatar-img"
                    >
                    <q-icon 
                      v-else 
                      name="person" 
                      size="32px"
                    />
                  </q-avatar>
                </div>
                <div class="col q-pl-md">
                  <div class="text-h6 text-weight-medium ellipsis">
                    {{ row.NOME_MOTORISTA }}
                  </div>
                  <div class="text-caption opacity-80">
                    Motorista
                  </div>
                </div>
                <div class="col-auto">
                  <q-badge 
                    color="white" 
                    text-color="teal-8" 
                    class="text-weight-bold"
                  >
                    ID: {{ row.PROGRAMACAO_ID }}
                  </q-badge>
                </div>
              </div>
            </div>

            <!-- Corpo do card -->
            <q-card-section class="q-pa-md">
              <!-- Data e hora -->
              <div class="row items-center q-mb-sm">
                <q-icon name="schedule" color="teal-6" size="20px" class="q-mr-sm" />
                <div>
                  <div class="text-caption text-grey-7">Data e Hora</div>
                  <div class="text-body1 text-weight-medium">
                    {{ row.DATA_VIAGEM }} • {{ row.HORA_VIAGEM }}
                  </div>
                </div>
              </div>

              <!-- Veículo -->
              <div class="row items-center q-mb-sm">
                <q-icon name="directions_car" color="blue-6" size="20px" class="q-mr-sm" />
                <div>
                  <div class="text-caption text-grey-7">Veículo</div>
                  <div class="text-body1 text-weight-medium">
                    {{ row.MARCA }} {{ row.MODELO }}
                  </div>
                  <div class="text-caption">
                    {{ row.VEICULO_COR }} • {{ formatPlaca(row.PLACA) }}
                  </div>
                </div>
              </div>

              <!-- Rota -->
              <div class="row items-center q-mb-md">
                <q-icon name="route" color="orange-6" size="20px" class="q-mr-sm" />
                <div>
                  <div class="text-caption text-grey-7">Origem</div>
                  <div class="text-body1 text-weight-medium">
                    {{ row.ORIGEM }}
                  </div>
                  <div class="text-caption text-grey-7">Destino</div>
                  <div class="text-body1 text-weight-medium">
                     {{ row.DESTINO }}
                  </div>
                </div>
              </div>

              <div class="row items-center q-mb-md">
                <q-icon name="person" color="teal-6" size="20px" class="q-mr-sm" />
                <div>
                  <div class="text-caption text-grey-7">Passageiros</div>
                  <div class="text-body1 text-weight-medium">
                    {{ row.PASSAGEIROS }}
                  </div> 
                </div>              
              </div>



              <!-- QR Code -->
              <div class="text-center q-my-lg">
                <div class="q-pa-sm bg-grey-1 rounded-borders inline-block">
                  <qrcode-vue 
                    :value="row.FIN_TOKEN_GERADO" 
                    :size="200" 
                    :margin="2"
                    class="shadow-1"
                  />
                </div>
                <div class="q-mt-md">
                  <div class="text-caption text-grey-7">Código de validação</div>
                  <div class="text-h6 text-weight-bold text-teal-8">
                    {{ formatToken(row.FIN_TOKEN_GERADO) }}
                  </div>
                </div>
              </div>

              <!-- Botões de ação -->
              <div class="row q-col-gutter-sm q-mt-md">
                <div class="col-12">
                  <q-btn 
                    label="WhatsApp Motorista" 
                    icon="whatsapp"
                    color="positive"
                    @click="abrirWhatsapp(row)"
                    class="full-width q-py-sm"
                    rounded
                    glossy
                  >
                    <q-tooltip>
                      Enviar mensagem via WhatsApp
                    </q-tooltip>
                  </q-btn>
                </div>                
              </div>
            </q-card-section>           
          </q-card>
        </div>
      </template>

      <!-- Estado vazio -->
      <div v-else class="col-12">
        <q-card class="empty-state-card" flat>
          <q-card-section class="text-center q-pa-xl">
            <q-icon name="directions_car" size="80px" color="grey-4" />
            <div class="text-h6 text-grey-7 q-mt-md">Nenhuma viagem encontrada</div>
            <div class="text-body2 text-grey-5 q-mb-lg">
              Não há viagens programadas no momento
            </div>
            <q-btn 
              label="Atualizar" 
              icon="refresh" 
              color="primary" 
              @click="getList"
              rounded
              outline
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Botão flutuante moderno -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        icon="refresh"
        color="teal"
        @click="getList"
        class="shadow-6"
        round
      >
        <q-tooltip>
          Atualizar lista de viagens
        </q-tooltip>
      </q-btn>
    </q-page-sticky>
  </div>
</template>

<script>

import { defineComponent } from 'vue'
import { gridMixin } from 'src/mixins/gridMixin.js'
import { enviarMensagemWhatsApp } from 'src/modules/utils'
import QrcodeVue from 'qrcode.vue'

export default defineComponent({
  name: 'viagens-grid',
  components: {
    QrcodeVue
  },
  props: {
    grid: {
      title: String,
      table: String,
      primaryKey: String,
      foreignKey: String,
      columns: Array,
      menuContext: Array,
      visibleColumns: Array,
      formName: '',
      customHeader: {
        type: Boolean,
        default: () => true
      },
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
      uniqueKey: String,
      fields: Object,
    },
    id: Number | String,
    fk: Number | String,
    parentRow: {
      type: Object,
      default: () => { }
    },
    readonly: Boolean,
    showTitle: {
      type: Boolean,
      default: () => false
    },
    showComboColumns: {
      type: Boolean,
      default: () => true
    },
  },
  mixins: [gridMixin],
  data: () => {
    return {
      tab: 1,
      data: [],      
      fotoMotorista: []
    }
  },
  methods: {
    formatDate(date) {
      // Formatar data para DD/MM/AAAA
      if (!date) return '';
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    
    formatPlaca(placa) {
      if (!placa) return '';
      
      let placaLimpa = placa.replace(/[-\s]/g, '').toUpperCase();
      
      if (placaLimpa.length !== 7) {
        return placa;
      }
      
      // Formato antigo: 3 letras + 4 números
      if (/^[A-Z]{3}[0-9]{4}$/.test(placaLimpa)) {
        return placaLimpa.replace(/([A-Z]{3})([0-9]{4})/, '$1-$2');
      }
      
      // Formato Mercosul: 3 letras + 1 número + 1 letra + 2 números
      if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(placaLimpa)) {
        return placaLimpa.replace(/([A-Z]{3})([0-9][A-Z][0-9]{2})/, '$1-$2');
      }
      
      // Se não for nenhum dos dois, retorna a placa original
      return placa;
    },
    
    formatToken(token) {
      // Formatar token em grupos de 4 caracteres
      if (!token) return '';
      return token.match(/.{1,3}/g).join(' ');
    },
    obterIniciais(nome) {
    if (!nome) return '';
    return nome
      .split(' ')
      .map(palavra => palavra[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  },
    getList() {
      this.loading = true;
      return this.$api.get(`/passageiro_list_viagens`)
        .then(({ data }) => {
          this.data = data.resultado || [];         
        })
        .catch(error => {
          this.loading = false;
        });
    },
    abrirWhatsapp(row) {
      const msg = `Olá, ${row.NOME_MOTORISTA}`
      enviarMensagemWhatsApp(row.TELEGRAM, msg)
    },
    async loadFotoMotorista(cooperadoId) {
      try {
        const response = await this.$api.get(`/cooperado/selfie/${cooperadoId}`);        
        return response.data.resultado;
      } catch (error) {
        console.error('Erro ao carregar selfie:', error);
        throw error;
      }
    }
  },
  mounted() {
    this.getList()
    
  }
})
</script>

<style lang="scss">
.modern-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid #06343a;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  .bg-gradient-teal {
    background: linear-gradient(135deg, #00897b 0%, #4db6ac 100%);
    border-radius: 16px 16px 0 0;
  }

  .avatar-img {
    border: 3px solid rgba(255, 255, 255, 0.3);
  }

  .empty-state-card {
    border: 2px dashed #e0e0e0;
    border-radius: 16px;
    background: #fafafa;
  }
}

.opacity-80 {
  opacity: 0.8;
}

.rounded-borders {
  border-radius: 12px;
}

.shadow-1 {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.shadow-3 {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.shadow-6 {
  box-shadow: 0 8px 25px rgba(0, 150, 136, 0.3);
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

