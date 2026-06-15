# Lenis — Documentação completa

> Smooth scroll library da [darkroom.engineering](https://darkroom.engineering/).
> Doc coletada de [lenis.dev](https://www.lenis.dev/) + READMEs oficiais do GitHub em 2026-06-15.
>
> Versão de referência usada nos exemplos via CDN: **1.3.23**.

## Índice
- [Visão geral / Por que smooth scroll](#visão-geral)
- [Features](#features)
- [Packages](#packages)
- [Instalação](#instalação)
- [Setup](#setup)
- [Uso sem build (no-code)](#uso-sem-build-no-code)
- [Settings (opções)](#settings-opções)
- [Properties](#properties)
- [Methods](#methods)
- [Events](#events)
- [Considerations](#considerations)
- [Limitations](#limitations)
- [Troubleshooting](#troubleshooting)
- [Lenis + React](#lenis--react)
- [Lenis + Vue / Nuxt](#lenis--vue--nuxt)
- [Lenis + Snap (scroll snap)](#lenis--snap-scroll-snap)
- [License](#license)

---

## Visão geral

Lenis ("smooth" em latim) é uma biblioteca de smooth scroll leve, robusta e performática. Projetada para ser simples de usar e fácil de integrar. Ideal para experiências de scroll suave: sincronização com WebGL, efeitos parallax, animações ligadas ao scroll etc.

**Por que usar smooth scroll (segundo a darkroom):**
- **Interfaces mais imersivas** — puxa o usuário para o fluxo da experiência.
- **Normaliza os inputs do usuário** — trackpad, mouse wheel, touch passam a ter a mesma experiência, com controle de quão "pesado" ou responsivo é.
- **Animações impecáveis** — corrige os "saltos" de animações ligadas ao scroll causados pelo multi-threading dos browsers (que rodam efeitos de forma assíncrona ao scroll nativo).

**Diferenciais do Lenis:**
- Roda o scroll na **main thread** (não usa CSS transforms como Locomotive/ScrollSmoother).
- Muito leve (**< 4KB**), sem dependências.
- Mantém APIs nativas: `position: sticky`, busca na página (Ctrl+F), scrollbar nativa, IntersectionObserver, anchor links e acessibilidade continuam funcionando.
- Traga sua própria lib de animação.
- Controle de easing/duration do scroll.
- Qualquer elemento pode ser o scroller.
- Suporte horizontal + vertical.
- Suporte a touch.

## Features
- **Lightweight & dependency-free** — poucos KB, zero dependências de runtime.
- **Runs on native scroll** — envolve o scroll nativo do browser, então `position: sticky`, anchor links e acessibilidade continuam funcionando.
- **Any axis** — scroll suave vertical, horizontal e aninhado a partir de uma única instância.
- **Built for sync** — alimenta cenas WebGL, GSAP ScrollTrigger e parallax a partir de um único loop.
- **Framework adapters** — pacotes first-class para React, Vue e Framer.
- **Scroll snapping** — o plugin snap alinha seções sem brigar com o smooth scroll.

## Packages
- `lenis` — core
- `lenis/react`
- `lenis/vue`
- `lenis/framer` — https://lenis.framer.website/
- `lenis/snap`

---

## Instalação

Via package manager:

```bash
npm i lenis
# ou
yarn add lenis
# ou
pnpm add lenis
```

```js
import Lenis from 'lenis'
```

Via `<script>` (CDN):

```html
<script src="https://unpkg.com/lenis@1.3.23/dist/lenis.min.js"></script>
```

---

## Setup

### Básico

```js
// Inicializa o Lenis
const lenis = new Lenis({
  autoRaf: true,
});

// Escuta o evento de scroll e loga os dados
lenis.on('scroll', (e) => {
  console.log(e);
});
```

### Loop raf customizado

```js
const lenis = new Lenis();

// requestAnimationFrame para atualizar o scroll continuamente
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
```

### CSS recomendado

Importar o stylesheet:
```js
import 'lenis/dist/lenis.css'
```

Ou linkar o CSS:
```html
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.23/dist/lenis.css">
```

Ou adicionar manualmente: ver `packages/core/lenis.css` no repositório.

### Integração com GSAP ScrollTrigger

```js
const lenis = new Lenis();

// Sincroniza o scroll do Lenis com o ScrollTrigger do GSAP
lenis.on('scroll', ScrollTrigger.update);

// Adiciona o raf do Lenis ao ticker do GSAP
// garante que o smooth scroll atualize a cada tick do GSAP
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // converte segundos -> milissegundos
});

// Desativa o lag smoothing do GSAP para evitar atraso nas animações
gsap.ticker.lagSmoothing(0);
```

---

## Uso sem build (no-code)

Uma linha, sem build step — basta colocar no HTML:

```html
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.23/dist/lenis.css">
<script src="https://unpkg.com/lenis@1.3.23/dist/lenis.min.js"></script>
<script>new Lenis({ autoRaf: true, autoToggle: true, anchors: true, allowNestedScroll: true, naiveDimensions: true, stopInertiaOnNavigate: true })</script>
```

Pronto — a página passa a ter smooth scroll e lida com a maioria dos casos comuns:
- compatibilidade com outros pacotes
- modais
- smooth anchors
- reset de scroll ao trocar de página

---

## Settings (opções)

Passadas no construtor `new Lenis({ ... })`.

| Opção | Tipo | Default | Descrição |
|---|---|---|---|
| `allowNestedScroll` | `boolean` | `false` | Permite automaticamente que elementos roláveis aninhados rolem nativamente. Jeito mais simples de lidar com scroll aninhado. ⚠️ Pode gerar problema de performance pois checa a árvore DOM a cada scroll. Se for preocupação, use `prevent`. |
| `anchors` | `boolean \| ScrollToOptions` | `false` | Faz scroll para anchor links ao clicar. `true` ativa com opções padrão; passar `ScrollToOptions` ativa com as opções dadas. |
| `autoRaf` | `boolean` | `false` | Roda o loop `requestAnimationFrame` automaticamente. |
| `autoResize` | `boolean` | `true` | Redimensiona a instância automaticamente via `ResizeObserver`. Se `false`, chame `.resize()` manualmente. |
| `autoToggle` | `boolean` | `false` | Inicia/para a instância automaticamente conforme o `overflow` do wrapper. ⚠️ Requer o CSS recomendado. Safari > 17.3, Chrome > 116, Firefox > 128. |
| `content` | `HTMLElement` | `document.documentElement` | Elemento que contém o conteúdo a ser rolado, normalmente filho direto do `wrapper`. |
| `duration` | `number` | `1.2` | Duração da animação de scroll (em segundos). Ignorado se `lerp` definido. |
| `easing` | `function` | `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` | Função de easing da animação. Padrão é custom; pode pegar uma de [easings.net](https://easings.net/en). Ignorado se `lerp` definido. |
| `eventsTarget` | `HTMLElement \| Window` | `wrapper` | Elemento que escuta os eventos `wheel` e `touch`. |
| `gestureOrientation` | `string` | `vertical` | Orientação dos gestos: `vertical`, `horizontal` ou `both`. |
| `infinite` | `boolean` | `false` | Scroll infinito. `syncTouch: true` é necessário em dispositivos touch. |
| `lerp` | `number` | `0.1` | Intensidade da interpolação linear (entre 0 e 1). |
| `naiveDimensions` | `boolean` | `false` | Usa cálculo de dimensões "ingênuo". ⚠️ Tem impacto de performance. |
| `orientation` | `string` | `vertical` | Orientação do scroll: `vertical` ou `horizontal`. |
| `overscroll` | `boolean` | `true` | Similar ao CSS `overscroll-behavior`. |
| `prevent` | `function` | `undefined` | Impede manualmente o scroll de ser suavizado com base nos elementos atravessados pelos eventos. Se retornar `true`, impede. Ex.: `(node) => node.classList.contains('cookie-modal')`. |
| `smoothWheel` | `boolean` | `true` | Suaviza o scroll iniciado por eventos de `wheel`. |
| `stopInertiaOnNavigate` | `boolean` | `false` | Para a inércia quando um link interno é clicado. |
| `syncTouch` | `boolean` | `false` | Imita o scroll de dispositivos touch permitindo sync (pode ser instável em iOS < 16). |
| `syncTouchLerp` | `number` | `0.075` | Lerp aplicado na inércia do `syncTouch`. |
| `touchInertiaExponent` | `number` | `1.7` | Controla a força da inércia do `syncTouch`. |
| `touchMultiplier` | `number` | `1` | Multiplicador para eventos de touch. |
| `virtualScroll` | `function` | `undefined` | Modifica os eventos antes de serem consumidos. Se retornar `false`, o scroll não é suavizado. Ex.: `(e) => { e.deltaY /= 2 }` ou `({ event }) => !event.shiftKey`. |
| `wheelMultiplier` | `number` | `1` | Multiplicador para eventos de mouse wheel. |
| `wrapper` | `HTMLElement \| Window` | `window` | Elemento usado como container de scroll. |

---

## Properties

| Propriedade | Tipo | Descrição |
|---|---|---|
| `actualScroll` | `number` | Valor de scroll atual registrado pelo browser. |
| `animatedScroll` | `number` | Valor de scroll atual (animado). |
| `className` (getter) | `string` | className do `rootElement`. |
| `dimensions` | `object` | Instância de dimensões. |
| `direction` | `number` | `1`: rolando para cima, `-1`: rolando para baixo. |
| `isHorizontal` (getter) | `boolean` | Se a instância é horizontal. |
| `isScrolling` (getter) | `boolean \| string` | Se o scroll está sendo animado: `smooth`, `native` ou `false`. |
| `isStopped` (getter) | `boolean` | Se o usuário pode rolar ou não. |
| `lastVelocity` | `number` | Última velocidade de scroll. |
| `limit` (getter) | `number` | Valor máximo de scroll. |
| `options` | `object` | Opções da instância. |
| `progress` (getter) | `number` | Progresso do scroll de `0` a `1`. |
| `rootElement` (getter) | `HTMLElement` | Elemento no qual o Lenis foi instanciado. |
| `scroll` (getter) | `number` | Valor de scroll atual (lida com scroll infinito se ativado). |
| `targetScroll` | `number` | Valor de scroll alvo. |
| `time` | `number` | Tempo decorrido desde a criação da instância. |
| `velocity` | `number` | Velocidade de scroll atual. |

---

## Methods

| Método | Descrição | Argumentos |
|---|---|---|
| `destroy()` | Destrói a instância e remove todos os eventos. | — |
| `on(id, function)` | `id` pode ser qualquer um dos eventos de instância para escutar. | — |
| `raf(time)` | Deve ser chamado a cada frame para uso interno. | `time`: em ms |
| `resize()` | Recalcula os tamanhos internos; usar quando `autoResize` for `false`. | — |
| `scrollTo(target, options)` | Faz scroll até o alvo. | ver abaixo |
| `start()` | Retoma o scroll. | — |
| `stop()` | Pausa o scroll. | — |

### `scrollTo(target, options)`

**`target`** (alvo a alcançar):
- `number`: valor para rolar em pixels
- `string`: seletor CSS ou keyword (`top`, `left`, `start`, `bottom`, `right`, `end`)
- `HTMLElement`: elemento do DOM

**`options`:**
- `offset` (`number`): equivalente a `scroll-padding-top`
- `lerp` (`number`): intensidade do lerp da animação
- `duration` (`number`): duração da animação (em segundos)
- `easing` (`function`): easing da animação
- `immediate` (`boolean`): ignora duration, easing e lerp
- `lock` (`boolean`): impede o usuário de rolar até o alvo ser alcançado
- `force` (`boolean`): alcança o alvo mesmo se a instância estiver parada (stopped)
- `onComplete` (`function`): chamado quando o alvo é alcançado
- `userData` (`object`): este objeto é encaminhado através dos eventos `scroll`

---

## Events

| Evento | Argumentos do callback |
|---|---|
| `scroll` | instância do Lenis |
| `virtual-scroll` | `{ deltaX, deltaY, event }` |

Uso: `lenis.on('scroll', (lenis) => { ... })`.

---

## Considerations

### Scroll aninhado (nested scroll)

Jeito mais simples e confiável — opção `allowNestedScroll`:

```js
const lenis = new Lenis({
  allowNestedScroll: true,
})
```

Detecta automaticamente elementos roláveis aninhados e os deixa rolar nativamente. ⚠️ Pode gerar problema de performance (checa o DOM a cada scroll). Se houver problema, use `data-lenis-prevent`.

#### Via atributos HTML

```html
<div data-lenis-prevent>conteúdo rolável</div>
```

| Atributo | Descrição |
|---|---|
| `data-lenis-prevent` | Previne todos os eventos de smooth scroll |
| `data-lenis-prevent-wheel` | Previne apenas eventos de wheel |
| `data-lenis-prevent-touch` | Previne apenas eventos de touch |
| `data-lenis-prevent-vertical` | Previne apenas scroll vertical |
| `data-lenis-prevent-horizontal` | Previne apenas scroll horizontal |

#### Via JavaScript

```html
<div id="modal">conteúdo rolável</div>
```

```js
const lenis = new Lenis({
  prevent: (node) => node.id === 'modal',
})
```

### Anchor links

Por padrão o Lenis impede anchor links de funcionarem durante o scroll. Para habilitar:

```js
new Lenis({
  anchors: true
})
```

Também aceita opções de `scrollTo`:

```js
new Lenis({
  anchors: {
    offset: 100,
    onComplete: () => {
      console.log('scrolled to anchor')
    }
  }
})
```

---

## Limitations
- Sem suporte a CSS scroll-snap — use `lenis/snap`.
- Limitado a 60fps no Safari (e 30fps em modo de baixo consumo).
- Smooth scroll não funciona dentro de iframes (eles não encaminham eventos de wheel).
- `position: fixed` parece travar no macOS Safari pré-M1.
- Eventos de touch podem se comportar de forma inesperada com `syncTouch` no iOS < 16.
- Containers de scroll aninhados exigem configuração adequada.

---

## Troubleshooting
- Use a versão mais recente do Lenis.
- Inclua o CSS recomendado.
- Se usar GSAP ScrollTrigger, garanta a integração correta (ver seção de Setup).
- Teste sem o Lenis para garantir que o elemento/página é rolável.
- Use `autoRaf: true` ou chame `lenis.raf(time)` manualmente no seu loop de animação.

---

## Lenis + React

`lenis/react` fornece um componente `<ReactLenis>` que cria uma instância e a disponibiliza aos filhos via context, além do hook `useLenis`.

### Instalação
```bash
npm i lenis
```

### CSS recomendado
```js
import 'lenis/dist/lenis.css'
```

### Uso básico
```jsx
import { ReactLenis, useLenis } from 'lenis/react'

function App() {
  const lenis = useLenis((lenis) => {
    // chamado a cada scroll
    console.log(lenis)
  })

  return (
    <>
      <ReactLenis root />
      {/* content */}
    </>
  )
}
```

### Props
- `options`: opções do Lenis (ver Settings).
- `root`:
  - `true` — torna a instância acessível globalmente via `useLenis` de qualquer lugar do app (mesmo fora da árvore do provider). Usa o scroll padrão do `<html>`.
  - `'asChild'` — renderiza elementos wrapper para containers de scroll customizados, ainda deixando a instância globalmente acessível.
  - Default: `false`.

### Hooks
`useLenis` retorna a instância do Lenis. Argumentos:
- `callback`: função chamada a cada evento de scroll.
- `deps`: dispara o callback quando mudam.
- `priority`: gerencia a ordem de execução dos callbacks.

### Loop requestAnimationFrame customizado
```jsx
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'

function App() {
  const lenisRef = useRef()

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time)
    }
    const rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
}
```

### Integração com GSAP
```jsx
import gsap from 'gsap'
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'

function App() {
  const lenisRef = useRef()

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
    gsap.ticker.add(update)
    return () => gsap.ticker.remove(update)
  }, [])

  return <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
}
```

### Integração com Framer Motion
```tsx
import { ReactLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';
import { cancelFrame, frame } from 'framer-motion';
import { useEffect, useRef } from 'react';

function App() {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp
      lenisRef.current?.lenis?.raf(time)
    }
    frame.update(update, true)
    return () => cancelFrame(update)
  }, [])

  return <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
}
```

---

## Lenis + Vue / Nuxt

`lenis/vue` fornece um componente `<VueLenis>` (context para os filhos) e o hook `useLenis`. Há também um plugin `vueLenisPlugin` para registrar o componente globalmente (usar a tag `vue-lenis` sem importar).

### Instalação
```bash
npm i lenis
```

**Vue:**
```js
// main.js
import { createApp } from 'vue'
import LenisVue from 'lenis/vue'

const app = createApp({})
app.use(LenisVue)
```

**Nuxt:**
```js
// nuxt.config.js
export default defineNuxtConfig({
  modules: ['lenis/nuxt'],
})
```

### CSS recomendado
```js
import 'lenis/dist/lenis.css'
```

### Uso
```vue
<script setup>
import { VueLenis, useLenis } from 'lenis/vue' // também disponíveis como imports globais
import { watch } from 'vue'

const lenisOptions = {
  // opções do lenis (opcional)
}

const lenis = useLenis((lenis) => {
  // chamado a cada scroll
  console.log(lenis)
})

watch(
  lenis,
  (lenis) => {
    console.log(lenis)
  },
  { immediate: true }
)
</script>

<template>
  <VueLenis root :options="lenisOptions" />
  <!-- content -->
</template>
```

### Props
- `options`: opções do Lenis (ver Settings).
- `root`: se `true`, instancia usando o scroll do `<html>`; então `useLenis` acessa a instância de qualquer lugar. Default: `false`.

### Hooks
`useLenis` retorna a instância. Argumentos:
- `callback`: função chamada a cada scroll.
- `priority`: ordem de execução dos callbacks.

```vue
<script setup>
import { VueLenis, useLenis } from 'lenis/vue'

const scrollCallback = (lenis) => {
  // chamado a cada scroll
}

const lenis = useLenis(scrollCallback, 0) // 0 = prioridade padrão
</script>

<template>
  <VueLenis root />
  <!-- content -->
</template>
```

### Integração com GSAP (Vue)
```vue
<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { VueLenis, useLenis } from 'lenis/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const lenisRef = ref()

watchEffect((onInvalidate) => {
  if (!lenisRef.value?.lenis) return

  lenisRef.value.lenis.on('scroll', ScrollTrigger.update)

  function update(time) {
    lenisRef.value.lenis.raf(time * 1000)
  }
  gsap.ticker.add(update)
  gsap.ticker.lagSmoothing(0)

  onInvalidate(() => {
    gsap.ticker.remove(update)
  })
})

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
})
</script>

<template>
  <VueLenis root ref="lenisRef" :options="{ autoRaf: false }" />
  <!-- content -->
</template>
```

### Integração com Motion (Vue)
```vue
<script setup>
import { VueLenis } from 'lenis/vue'
import { cancelFrame, frame } from 'motion-v'
import { onMounted, onUnmounted, ref } from 'vue'

const lenisRef = ref()

function update({ timestamp }) {
  lenisRef.value?.lenis?.raf(timestamp)
}

onMounted(() => {
  frame.update(update, true)
})

onUnmounted(() => {
  cancelFrame(update)
})
</script>

<template>
  <VueLenis ref="lenisRef" root :options="{ autoRaf: false }">
  <!-- content -->
</template>
```

---

## Lenis + Snap (scroll snap)

`lenis/snap` dá suporte parcial a CSS scroll snap com o Lenis.

### Instalação
```bash
npm i lenis
```

### Uso básico
```jsx
import Lenis from 'lenis'
import Snap from 'lenis/snap'

const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

const snap = new Snap(lenis)

// adicionar pontos de snap
snap.add(500)  // snap em 500px
snap.add(1000) // snap em 1000px
snap.add(1500) // snap em 1500px

// ou adicionar um elemento para snap
snap.addElement(document.querySelector('.element'), {
  align: ['start', 'end'], // 'start', 'center', 'end'
})

snap.addElement(document.querySelector('.element1'), {
  align: 'center',
})

// ou adicionar vários elementos de uma vez
snap.addElements(document.querySelectorAll('.section'), {
  align: ['start', 'end'],
})
```

### Slideshow
```jsx
const snap = new Snap(lenis, {
  type: 'lock',
  distanceThreshold: '100%',
  debounce: 0,
})
```

### Opções
- `type`: `proximity` (default), `mandatory` (ver `scroll-snap-type`) ou `lock`.
- `distanceThreshold`: `string | number` (default `'50%'`). Distância do ponto de snap até a posição de scroll. Ignorado quando `type` é `mandatory`. Percentual = relativo ao viewport; número = absoluto.
- `debounce`: `number` (default `500`). Tempo de debounce do snap.
- `onSnapStart`: `function`. Callback quando o snap começa.
- `onSnapComplete`: `function`. Callback quando o snap completa.
- `lerp`: `number`. Lerp do snap (default: lerp do lenis).
- `easing`: `function`. Easing do snap (default: easing do lenis).
- `duration`: `number`. Duração do snap (default: duration do lenis).

### Métodos
- `add(value: number)` — adiciona um ponto de snap.
- `addElement(element, options = {})` — adiciona um elemento para snap.
- `addElements(elements, options = {})` — adiciona vários elementos.
- `next()` — vai para o próximo ponto de snap.
- `previous()` — vai para o ponto anterior.
- `goTo(index: number)` — vai para um ponto específico.
- `start()` — inicia o snap.
- `stop()` — para o snap.
- `resize()` — recalcula os pontos de snap.

---

## License
MIT © [darkroom.engineering](https://github.com/darkroomengineering)

---

### Links úteis
- Site: https://www.lenis.dev/
- Repositório: https://github.com/darkroomengineering/lenis
- npm: https://www.npmjs.com/package/lenis
- Showcase: https://www.lenis.dev/showcase
- Demo: https://lenis.darkroom.engineering/
- Manifesto: https://github.com/darkroomengineering/lenis/blob/main/MANIFESTO.md
