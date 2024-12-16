import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import VueMacros from 'unplugin-vue-macros/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    VueMacros({
      plugins: {
        vue: vue(),
      },
    }),
    // https://github.com/unplugin/unplugin-auto-import
    AutoImport({
      imports: [
        // 预设
        'vue',
        // 'vue-router',
        // 'vuex',

        // 自定义
        {
          '@vueuse/core': [
            'useMouse', // import { useMouse } from '@vueuse/core',
            // alias
            ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
          ],
        },
      ],
      dts: 'types/auto-imports.d.ts',
      // 自动导入目录下的模块导出
      // 默认情况下，它只会扫描目录下的一个级别的模块
      dirs: [
        // './hooks',
        // './composables' // 只有根模块
        // './composables/**', // 所有嵌套模块
        // ...
      ],
    }),
    // https://github.com/unplugin/unplugin-vue-components
    Components({
      // 允许自动导入
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'types/components.d.ts',
    }),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
