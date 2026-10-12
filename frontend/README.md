# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## Acceso desde otros equipos de la red

Inicia el backend desde la carpeta raíz del proyecto:

```sh
npm run server
```

En otra terminal, inicia Vite exponiéndolo a la red:

```sh
cd frontend
npm run dev -- --host 0.0.0.0
```

Comparte con tus compañeros la dirección que Vite muestra en `Network`. Las llamadas a `/api` se envían mediante el proxy de Vite al backend local en el puerto `3000`; ambos servidores deben permanecer activos.
