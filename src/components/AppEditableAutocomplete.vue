<template>
  <div class="editable-autocomplete">
    <q-input
      :id="inputId"
      v-model="inputText"
      @update:model-value="handleInput"
      @keydown="handleKeydown" ref="inputRef"
      clearable
      rounded
      standout
      :label="label"
      :readonly="readonly"
      debounce="1000"
      :placeholder="loading ? 'Buscando...' : 'Digite o endereço'"
      :loading="loading">
      <template v-slot:append>
        <q-icon name="arrow_drop_down" class="cursor-pointer" @click="showOptions" />
      </template>
    </q-input>

    <q-menu v-model="menuVisible" no-focus no-refocus no-parent-event anchor="bottom left" :offset="[0, 0]"
      :style="{ width: inputRef?.$el?.offsetWidth + 'px' }">
      <q-list v-if="options.length > 0" ref="menuListRef">
        <q-item v-for="(option, index) in options" :key="option.value" clickable @click="selectOption(option)"
           :class="itemClass(index)"
          >
          <q-item-section>{{ option.label }}</q-item-section>
        </q-item>
      </q-list>
      <div v-else class="q-pa-md text-grey">
        {{ lastSearchTerm.length < 4 ? 'Digite pelo menos 4 caracteres' : 'Nenhum resultado encontrado' }} </div>
    </q-menu>
  </div>
</template>

<script>
import { ref, watch, nextTick, readonly } from 'vue';
import OSMap from 'src/modules/OSMap';
import { padronizarTexto } from 'src/modules/utils';

export default {
  name: 'app-editable-autocomplete',
  props: {
    modelValue: {
      type: String,
      default: () => '',
      required: true
    },
    readonly: {
      type: Boolean,
      default: () => false
    },
    label: {
      type: String
    },
    fieldName: {
      type: String
    }
  },
  emits: ['update:model-value', 'update:coordenates', 'update:raw-value'],
  setup(props, { emit }) {
    const inputText = ref(props.modelValue);
    const inputRef = ref(null);
    const menuVisible = ref(false);
    const options = ref([]);
    const loading = ref(false);
    const lastSearchTerm = ref('');
    const inputId = ref(`input-${Math.random().toString(36).substring(2, 9)}`);
    const focusedIndex = ref(-1);
    const menuListRef = ref(null);

    const fetchResults = async (term) => {
      if (term.length < 4) return [];

      try {
        const osm = new OSMap();
        const response = await osm.autocompletarEndereco(term);
        if (!response || response.length === 0) {
          return [];
        }
        return response.map(item => ({
          label: item.full_address,
          value: `${item.latitude},${item.longitude}`,
          raw: item
        }));
      } catch (error) {
        console.error('Erro na busca:', error);
        return [];
      }
    };

    const handleInput = async (val) => {
      lastSearchTerm.value = val;
      if (!val) {
        menuVisible.value = false;
        return;
      }
      emit('update:model-value', padronizarTexto(val));

      if (val.length >= 4) {
        loading.value = true;
        options.value = await fetchResults(val);
        loading.value = false;
        if (options.value.length > 0) {
          menuVisible.value = true;
          focusedIndex.value = 0;
        }
      } else {
        menuVisible.value = false;
      }
    };

    const handleKeydown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!menuVisible.value && options.value.length > 0) {
            menuVisible.value = true;
          }
          focusedIndex.value = Math.min(focusedIndex.value + 1, options.value.length - 1);
          scrollToItem();
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (menuVisible.value && focusedIndex.value == 0) {
            menuVisible.value = false;
            focusedIndex.value = -1;
          }
          focusedIndex.value = Math.max(focusedIndex.value - 1, 0);
          scrollToItem();
          break;

        case 'Enter':
          e.preventDefault();
          e.stopPropagation();
          if (menuVisible.value && focusedIndex.value > -1) {
            // Adiciona timeout para garantir o fechamento antes de qualquer atualização
            nextTick(() => {
              selectOption(options.value[focusedIndex.value]);
              menuVisible.value = false;
            });
          }
          break;

        case 'Escape':
          e.preventDefault();
          menuVisible.value = false;
          focusedIndex.value = -1;
          break;

        case 'Tab':
          menuVisible.value = false;
          break;

        default:
          break;
      }
    };

    const scrollToItem = () => {
      nextTick(() => {
        const items = menuListRef.value?.$el?.querySelectorAll('.q-item');
        if (items && items[focusedIndex.value]) {
          items[focusedIndex.value].scrollIntoView({
            block: 'nearest',
            behavior: 'smooth'
          });
        }
      });
    };
    const selectOption = (option) => {
      inputText.value = option.label;
      emit('update:model-value', option.label);
      emit('update:coordenates', {
        latitude: option.raw.latitude,
        longitude: option.raw.longitude
      })
      emit('update:raw-value', option.raw)

      // Fecha o menu imediatamente e limpa o índice
      menuVisible.value = false;
      focusedIndex.value = -1;
    };
    const showOptions = async () => {
      if (inputText.value.length >= 4) {
        loading.value = true;
        options.value = await fetchResults(inputText.value);
        loading.value = false;
        menuVisible.value = true;
        focusedIndex.value = 0;
      }
    };

    const handleBlur = (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest('.editable-autocomplete')) {
        menuVisible.value = false;
      }
    };
    const itemClass = (index) => {
      return focusedIndex.value === index ? 'highlighted-item' : '';
    };
    watch(() => props.modelValue, (newVal) => {
      if (newVal !== inputText.value) {
        inputText.value = newVal;
      }
    });

    return {
      inputText,
      inputRef,
      menuVisible,
      options,
      loading,
      lastSearchTerm,
      handleInput,
      handleKeydown,
      handleBlur,
      selectOption,
      showOptions,
      inputId,
      menuListRef,
      focusedIndex,
      itemClass
      };
  }
};
</script>

<style>
.editable-autocomplete .q-field__append {
  padding-right: 4px;
}

.highlighted-item {
  background-color: rgba(0, 0, 0, 0.08);
}

.body--dark .highlighted-item {
  background-color: rgba(255, 255, 255, 0.08);
}
</style>
