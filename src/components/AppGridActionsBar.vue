<template>
  <div class="q-gutter-xs">
    <component
    v-for="button in buttons"
    v-show="showButton(button)"
    :key="button.name"
    :is="button.is"
    size="sm"
    v-bind="button"
    rounded
    :handler="handler"
    @click.stop="button.is == 'q-btn' ? handler(button.name) : ''"
    >
  </component>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import AppBtnDropdown from 'components/AppBtnDropdown.vue'

export default defineComponent({
  name: 'AppGridActionsBar',
  components: {
    AppBtnDropdown
  },
  props: {
    permitions: {
      type: Object
    },
    buttons: {
      type: Array,
      default: () => []
    },
    selected: Array,
    handler: {
      type: Function,
      required: true
    },
  },
  methods: {
    showButton(button){
      let allowed = this.permitions[button.name] === undefined ? true : this.permitions[button.name]
      let visible = button.visible === undefined ? true : button.visible
      return allowed && visible
    }
  }
})
</script>
