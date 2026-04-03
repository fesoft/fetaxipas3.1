<template>
    <q-select  v-bind="filteredAttrs" v-model="selected" use-input clearable rounded standout :options="options"
    @filter="handleFilter" @new-value="newValue" @update:model-value="emit('update:model-value', selected)"
    :loading="loading" option-label="label" option-value="value" map-options emit-value :label="label"
    :readonly="readonly" :disable="disable" hint="Digite pelo menos 4 caracteres" :class="class">
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">Nenhum resultado</q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import { ref, watch, computed } from 'vue';
import OSMap from 'src/modules/OSMap';

export default {
  name: 'AppAutocomplete',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, null],
      required: true
    },
    label: String,
    maxlength: Number | String,
    readonly: Boolean,
    disable: Boolean,
    autofocus: Boolean,
    class: String,
  },
  emits: ['update:model-value', 'blur'],
  setup(props, { emit, attrs }) {
    const selected = ref(props.modelValue);
    const options = ref([]);
    const loading = ref(false);
    const lastSearchTerm = ref('');

     // Remove a prop options dos atributos recebidos
     const filteredAttrs = computed(() => {
      const { options, ...rest } = attrs;
      return rest;
    });

    const debounce = (fn, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
      };
    };

    const fetchResults = async (term) => {
      if (term.length < 4) return [];

      try {
        const osm = new OSMap();
        const response = await osm.autocompletarEndereco(term);
        console.log('Resposta bruta da API:', response); // Debug crítico

        // Validação da estrutura dos dados
        if (!response || !Array.isArray(response)) {
          return [];
        }

        return response.map(item => {
          if (!item.full_address || !item.latitude || !item.longitude) {
            console.warn('Item inválido:', item);
            return '';
          }
          return {
            label: item.full_address,
            value: item.full_address
          };
        }).filter(Boolean); // Remove itens inválidos

      } catch (error) {
        console.error('Erro na busca por endereço:', error);
        return [];
      }
    };

    const handleFilter = debounce(async (val, update) => {
      console.log('Filtrando com:', val);
      lastSearchTerm.value = val;

      if (val.length < 4) {
        update(() => {
          options.value = [];
          console.log('Opções resetadas por termo curto');
        });
        return;
      }

      loading.value = true;

      try {
        const results = await fetchResults(val);
        console.log('Resultados da API:', results);

        update(() => {
          options.value = results;
          console.log('Opções atualizadas:', options.value);
        });

      } catch (error) {
        console.error('Erro na busca:', error);
        update(() => {
          options.value = [];
        });
      } finally {
        loading.value = false;
      }
    }, 300);

    const newValue = (inputValue, done) => {
       done(inputValue);
    };
    // Sincronizar com o v-model externo
    watch(
      () => props.modelValue,
      (newVal) => {
        selected.value = newVal;
      }
    );

    return {
      selected,
      options,
      loading,
      lastSearchTerm,
      handleFilter,
      emit,
      filteredAttrs,
      newValue,
    };
  }
};
</script>
