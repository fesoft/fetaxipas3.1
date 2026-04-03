<template>
  <q-tabs
      v-model="model"
      dense
      class="col-12 text-grey-6 text-caption custom-tabs"
      indicator-color="transparent"
      align="left"
      >
      <q-tab v-for="tab in options"
      :key="tab.value"
      :tag="tab.value"
      :name="tab.value"
      :label="tab.label"
      @click="$emit('update:model-value', model)"
      />
    </q-tabs>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppTabs',
  emits: [ 'update:model-value' ],
  props: {
    options: {
        type: Array,
        default: () => []
    },
    modelValue: Number | String | Object
  },
  data: () => {
    return {
      model: undefined
    }
  },
  methods: {
    applyValue (modelValue) {
          this.model = modelValue
    },
    input(event) {
      this.$emit('update:model-value', this.model);
    }
  },
  watch: {
    modelValue (modelValue) {
      this.applyValue(modelValue)
    },
  },
  mounted() {
    if(this.modelValue) {
      this.applyValue(this.modelValue)
    }
  }
}
)
</script>

<style scoped>
/* Aplica o estilo aos componentes filhos do Quasar */
.custom-tabs {
  border-radius: 20px;
  overflow: hidden;
  /* Cor de fundo padrão (tema claro) */
  background-color: #e0e0e0;
  transition: background-color 0.3s ease;
}

/* Quando o modo escuro estiver ativo, muda o fundo do container */
.body--dark .custom-tabs {
  background-color: #2c2c2c; /* tom escuro que combina com o fundo do Quasar */
}

.custom-tabs .q-tab--active {
  border-radius: 20px;
  /* Usa a cor primária definida no tema (se adapta ao claro/escuro por definição) */
  background-color: #7d4f86;
  color: white;
}

/* Opcional: cor diferente para a aba ativa no modo escuro (descomente se necessário) */

.body--dark .custom-tabs .q-tab--active {
  background-color: #a745c4;
}


.custom-tabs .q-tab {
  transition: all 0.2s ease;
}

.custom-tabs .q-tab:hover:not(.q-tab--active) {
  background-color: rgba(181, 88, 150, 0.1);
  border-radius: 20px;
}

/* Ajuste do hover para o modo escuro */
.body--dark .custom-tabs .q-tab:hover:not(.q-tab--active) {
  background-color: rgba(255, 255, 255, 0.1);

}
</style>
