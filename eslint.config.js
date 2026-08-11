import pluginVue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...pluginVue.configs['flat/base'],
  {
    files: ['**/*.vue'],
    rules: {
      // Prohibir styles inline estáticos. Los :style dinámicos con custom
      // properties (patrón rootStyle de BButton, Drawer, etc.) se permiten.
      // 'vue/no-inline-styles': ['error', { allowDynamicStyling: true }],
    },
  },
]