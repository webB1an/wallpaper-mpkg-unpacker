# simple-vite-template-v3

本项目详细搭建教程请查看 [Vue3+Vite+Ts 项目搭建](https://webb1an.github.io/blog/article/2023/10.html)

1. install dependencies

```bash
pnpm install
```

2. start dev server

```bash
pnpm run dev
```

3. build

```bash
pnpm run build
```

4. commit changes

```bash
git cz
```



**vue 项目模板**

- 支持 eslint
- 支持规范化 commit
- 支持 Components 自动导入和注册组件
- 支持 AutoImport 自动导入常用的 api
- 支持 unocss

unocss 配置文件在 `unocss.config.ts` 中，可以根据需要自行修改，更多配置可以查看 [unocss](https://unocss.dev/guide/)


相较于 [simple-vite-template-v2](https://github.com/webB1an/simple-vite-template-v2)，simple-vite-template-v3 移除了对 Markdown 的支持，移除了 `@unocss/preset-icons` 对图标的使用，如果想要使用这些功能的话，可以使用 [simple-vite-template-v2](https://github.com/webB1an/simple-vite-template-v2)。


## Unocss 使用问题

图标通过动态 `:class` 绑定不会显示，具体可以看 [issue](https://github.com/unocss/unocss/issues/1355)，作者在这个 issue 里说明了这是 UnoCSS 的[工作原理](https://github.com/unocss/unocss#scanning)，需要在 `unocss.config.ts` 中配置 `safelist` 添加动态的 `class` 图标即可。


