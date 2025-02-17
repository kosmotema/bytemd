<script lang="ts">
  import markdownText from './text.md?raw'
  import { Editor } from '@kosmotema/bytemd'
  import breaks from '@kosmotema/bytemd-plugin-breaks'
  import frontmatter from '@kosmotema/bytemd-plugin-frontmatter'
  import gemoji from '@kosmotema/bytemd-plugin-gemoji'
  import gfm from '@kosmotema/bytemd-plugin-gfm'
  import highlight from '@kosmotema/bytemd-plugin-highlight'
  import math from '@kosmotema/bytemd-plugin-math'
  import mediumZoom from '@kosmotema/bytemd-plugin-medium-zoom'
  import mermaid from '@kosmotema/bytemd-plugin-mermaid'
  import '@kosmotema/bytemd/dist/index.css'
  import 'github-markdown-css/github-markdown-light.css'
  import 'highlight.js/styles/vs.css'
  // placed after highlight styles to override `code` padding
  import 'katex/dist/katex.css'

  function stripPrefixes(obj: Record<string, any>) {
    return Object.entries(obj).reduce((p, [key, value]) => {
      p[key.split('/').slice(-1)[0].replace('.json', '')] = value
      // console.log(p)
      return p
    }, {} as Record<string, any>)
  }

  const locales = stripPrefixes(
    import.meta.glob('/node_modules/@kosmotema/bytemd/locales/*.json', {
      eager: true,
    })
  )
  const gfmLocales = stripPrefixes(
    import.meta.glob(
      '/node_modules/@kosmotema/bytemd-plugin-gfm/locales/*.json',
      {
        eager: true,
      }
    )
  )
  const mathLocales = stripPrefixes(
    import.meta.glob(
      '/node_modules/@kosmotema/bytemd-plugin-math/locales/*.json',
      {
        eager: true,
      }
    )
  )
  const mermaidLocales = stripPrefixes(
    import.meta.glob(
      '/node_modules/@kosmotema/bytemd-plugin-mermaid/locales/*.json',
      {
        eager: true,
      }
    )
  )

  let value = markdownText
  let mode = 'auto'
  let localeKey = 'en'
  let maxLength: number

  let enabled = {
    breaks: false,
    frontmatter: true,
    gemoji: true,
    gfm: true,
    highlight: true,
    math: true,
    'medium-zoom': true,
    mermaid: true,
  }

  $: plugins = [
    enabled.breaks && breaks(),
    enabled.frontmatter && frontmatter(),
    enabled.gemoji && gemoji(),
    enabled.gfm &&
      gfm({
        locale: gfmLocales[localeKey],
      }),
    enabled.highlight && highlight(),
    enabled.math &&
      math({
        locale: mathLocales[localeKey],
        katexOptions: { output: 'html' }, // https://github.com/KaTeX/KaTeX/issues/2796
      }),
    enabled['medium-zoom'] && mediumZoom(),
    enabled.mermaid &&
      mermaid({
        locale: mermaidLocales[localeKey],
      }),
  ].filter((x) => x)
</script>

<div class="container">
  <div class="line">
    Mode:
    {#each ['auto', 'split', 'tab'] as m}
      <label> <input type="radio" bind:group={mode} value={m} />{m}</label>
    {/each}
    , Locale:
    <select bind:value={localeKey}>
      {#each Object.keys(locales) as l}
        <option value={l}>{l}</option>
      {/each}
    </select>
    , Max length:
    <input bind:value={maxLength} type="number" />
  </div>
  <div class="line">
    Plugins:
    {#each Object.keys(enabled) as p}
      {' '}
      <label> <input type="checkbox" bind:checked={enabled[p]} />{p}</label>
    {/each}
  </div>

  <Editor
    {value}
    {mode}
    {plugins}
    {maxLength}
    placeholder={'Start writing with ByteMD'}
    locale={locales[localeKey]}
    uploadImages={(files) => {
      return Promise.all(
        files.map((file) => {
          // TODO:
          return {
            url: 'https://picsum.photos/300',
          }
        })
      )
    }}
    on:change={(e) => {
      value = e.detail.value
    }}
  />
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .line {
    margin: 10px 0;
    text-align: center;
  }
  :global(body) {
    margin: 0 10px;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  }
  :global(.bytemd) {
    height: calc(100vh - 100px);
  }
  :global(.medium-zoom-overlay) {
    z-index: 100;
  }
  :global(.medium-zoom-image--opened) {
    z-index: 101;
  }
</style>
