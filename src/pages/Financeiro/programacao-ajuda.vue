<template>
  <q-dialog v-model="showDialog" maximized>
    <q-card class="full-height" style="width: 100%; max-width: 1000px">
      <!-- Cabeçalho -->
        <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Ajuda - Formulário de Solicitação</div>
        <q-space />

        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="text-white">
        <div class="text-caption">Instruções para preenchimento</div>
      </q-card-section>

      <!-- Conteúdo responsivo -->
      <q-card-section class="q-pa-none">
        <q-scroll-area :style="scrollAreaStyle">
          <div class="q-pa-md">
            <!-- Formulário de Solicitação -->
            <div class="text-h6 text-primary q-mb-sm">Formulário de Solicitação</div>

            <!-- Campos Obrigatórios -->
            <div class="text-subtitle1 text-weight-medium text-negative q-mt-lg q-mb-sm">
              <q-icon name="error" class="q-mr-xs" size="sm" />
              Campos Obrigatórios:
            </div>

            <q-list dense class="q-ml-md">
              <q-item class="q-py-xs">
                <q-item-section>
                  <div class="text-weight-bold">1. Data viagem</div>
                  <div class="q-ml-md">• Data do transporte</div>
                  <div class="q-ml-md text-negative text-caption">• Não pode ser data retroativa</div>
                </q-item-section>
              </q-item>

              <q-item class="q-py-xs">
                <q-item-section>
                  <div class="text-weight-bold">2. Hora viagem</div>
                  <div class="q-ml-md">• Horário de saída</div>
                </q-item-section>
              </q-item>

              <q-item class="q-py-xs">
                <q-item-section>
                  <div class="text-weight-bold">3. Solicitante</div>
                  <div class="q-ml-md">• Preenchido automaticamente (usuário logado)</div>
                </q-item-section>
              </q-item>

              <q-item class="q-py-xs">
                <q-item-section>
                  <div class="text-weight-bold">4. Área</div>
                  <div class="q-ml-md">• Área da empresa (seleção em lista)</div>
                </q-item-section>
              </q-item>

              <q-item class="q-py-xs">
                <q-item-section>
                  <div class="text-weight-bold">5. Roteiro</div>
                  <div class="q-ml-md">• Trajeto a ser seguido</div>
                </q-item-section>
              </q-item>

              <q-item class="q-py-xs">
                <q-item-section>
                  <div class="text-weight-bold">6. Pegar na</div>
                  <div class="q-ml-md">• Local de embarque</div>
                </q-item-section>
              </q-item>

              <q-item class="q-py-xs">
                <q-item-section>
                  <div class="text-weight-bold">7. Levar para</div>
                  <div class="q-ml-md">• Local de desembarque</div>
                </q-item-section>
              </q-item>

              <q-item class="q-py-xs">
                <q-item-section>
                  <div class="text-weight-bold">8. Quem autoriza</div>
                  <div class="q-ml-md">• Responsável pela aprovação (selecionar na lista)</div>
                  <div class="q-ml-md text-negative text-caption">• Campo obrigatório se a empresa adotar a autorização de viagens</div>
                </q-item-section>
              </q-item>
            </q-list>

            <!-- Separador -->
            <q-separator class="q-my-md" />

            <!-- Campos Opcionais -->
            <div class="text-subtitle1 text-weight-medium text-positive q-mb-sm">
              <q-icon name="check_circle" class="q-mr-xs" size="sm" />
              Campos Opcionais:
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-list dense>
                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">1. Data retorno</div>
                      <div class="q-ml-md text-caption">• Para viagens de ida e volta</div>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">2. Hora retorno</div>
                      <div class="q-ml-md text-caption">• Horário previsto de retorno</div>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">3. Chamado/Cód. interno</div>
                      <div class="q-ml-md text-caption">• Código interno da empresa (se aplicável)</div>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">4. Via</div>
                      <div class="q-ml-md text-caption">• Primeiro ponto intermediário</div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12">
                <q-list dense>
                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">5. Via 2</div>
                      <div class="q-ml-md text-caption">• Segundo ponto intermediário</div>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">6. Qtd. passageiros</div>
                      <div class="q-ml-md text-caption">• Quantidade estimada de pessoas</div>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">7. E-mail coordenador</div>
                      <div class="q-ml-md text-caption">• Lista de e-mails separada por vírgula</div>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">8. Observação</div>
                      <div class="q-ml-md text-caption">• Informações adicionais</div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>

            <!-- Separador -->
            <q-separator class="q-my-md" />

            <!-- Inclusão de Passageiros -->
            <div class="text-subtitle1 text-weight-medium text-primary q-mb-sm">
              <q-icon name="people" class="q-mr-xs" size="sm" />
              Inclusão de Passageiros na solicitação
            </div>

            <div class="q-ml-md q-mb-sm text-caption">Campos para cada passageiro (Botão NOVO para mais passageiros):</div>

            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-list dense>
                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">1. Mat. passageiro
                        <q-badge color="positive" rounded size="sm" class="q-ml-xs">Opcional</q-badge>
                      </div>
                      <div class="q-ml-md text-caption">• Matrícula/identificador único</div>
                      <div class="q-ml-md text-caption">• Pode buscar em lista ou inserir novo</div>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">2. Passageiro
                        <q-badge color="negative" rounded size="sm" class="q-ml-xs">Obrigatório</q-badge>
                      </div>
                      <div class="q-ml-md text-caption">• Nome completo</div>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">3. Centro de custo
                        <q-badge color="negative" rounded size="sm" class="q-ml-xs">Obrigatório</q-badge>
                      </div>
                      <div class="q-ml-md text-caption">• Número do centro de custo</div>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">4. Motivo
                        <q-badge color="negative" rounded size="sm" class="q-ml-xs">Obrigatório</q-badge>
                      </div>
                      <div class="q-ml-md text-caption">• Razão específica da viagem do passageiro</div>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">5. Endereço de origem
                        <q-badge color="negative" rounded size="sm" class="q-ml-xs">Obrigatório</q-badge>
                      </div>
                      <div class="q-ml-md text-caption">• Local de partida (com autocomplete)</div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-sm-6">
                <q-list dense>
                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">6. Endereço de destino
                        <q-badge color="negative" rounded size="sm" class="q-ml-xs">Obrigatório</q-badge>
                      </div>
                      <div class="q-ml-md text-caption">• Local de chegada (com autocomplete)</div>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">7. Telegram/WhatsApp/SMS
                        <q-badge color="negative" rounded size="sm" class="q-ml-xs">Obrigatório</q-badge>
                      </div>
                      <div class="q-ml-md text-caption">• Contato principal (11 dígitos)</div>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">8. Celular
                        <q-badge color="positive" rounded size="sm" class="q-ml-xs">Opcional</q-badge>
                      </div>
                      <div class="q-ml-md text-caption">• Telefone alternativo</div>
                    </q-item-section>
                  </q-item>

                  <q-item class="q-py-xs">
                    <q-item-section>
                      <div class="text-weight-bold">9. Email
                        <q-badge color="positive" rounded size="sm" class="q-ml-xs">Opcional</q-badge>
                      </div>
                      <div class="q-ml-md text-caption">• Endereço eletrônico</div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>

            <!-- Dica responsiva -->
            <div class="q-mt-lg q-pa-sm bg-blue-1 rounded-borders">
              <div class="row items-center">
                <div class="col-auto">
                  <q-icon name="phone_android" color="primary" size="sm" />
                </div>
                <div class="col">
                  <div class="text-caption text-primary">
                    <span class="text-weight-medium">Dica:</span> Em dispositivos móveis, você pode deslizar para ver todo o conteúdo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const showDialog = ref(false)

// Estilo responsivo para a área de rolagem
const scrollAreaStyle = computed(() => {
  const isMobile = window.innerWidth < 600
  return {
    height: isMobile ? 'calc(95vh - 20px)' : '900px',
    maxHeight: '95vh'
  }
})

// Método para abrir o diálogo
const openDialog = () => {
  showDialog.value = true
}

// Método para fechar o diálogo
const closeDialog = () => {
  showDialog.value = false
}

// Expõe métodos para uso externo
defineExpose({
  openDialog,
  closeDialog
})
</script>

<style scoped>
/* Estilos responsivos */
.text-negative {
  color: #a12c3a;
}

.text-positive {
  color: #21ba45;
}

.text-primary {
  color: #1976d2;
}

.q-item {
  min-height: auto;
  padding: 2px 0;
}

/* Ajustes para mobile */
@media (max-width: 600px) {
  .text-h6 {
    font-size: 1.1rem;
  }

  .text-subtitle1 {
    font-size: 1rem;
  }

  .full-width-sm {
    width: 100%;
  }

  .q-card-section {
    padding: 12px;
  }

  .q-ml-md {
    margin-left: 8px;
  }
}

/* Ajustes para tablets */
@media (min-width: 601px) and (max-width: 1024px) {
  .q-card {
    max-width: 95vw !important;
  }
}

/* Ajustes para desktop */
@media (min-width: 1025px) {
  .q-card {
    max-width: 800px !important;
  }
}

/* Badges responsivos */
.q-badge {
  font-size: 0.65rem;
  padding: 2px 6px;
}

@media (max-width: 600px) {
  .q-badge {
    font-size: 0.6rem;
    padding: 1px 4px;
  }
}
</style>
