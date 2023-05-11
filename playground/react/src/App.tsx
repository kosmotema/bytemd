import './style.css'
import markdownText from './text.md?raw'
import breaks from '@kosmotema/bytemd-plugin-breaks'
import frontmatter from '@kosmotema/bytemd-plugin-frontmatter'
import gemoji from '@kosmotema/bytemd-plugin-gemoji'
import gfm from '@kosmotema/bytemd-plugin-gfm'
import highlight from '@kosmotema/bytemd-plugin-highlight'
import math from '@kosmotema/bytemd-plugin-math'
import mediumZoom from '@kosmotema/bytemd-plugin-medium-zoom'
import mermaid from '@kosmotema/bytemd-plugin-mermaid'
import { Editor } from '@kosmotema/bytemd-react'
import '@kosmotema/bytemd/dist/index.css'
import 'github-markdown-css/github-markdown-light.css'
import 'highlight.js/styles/vs.css'
// placed after highlight styles to override `code` padding
import 'katex/dist/katex.css'
import { useMemo, useState } from 'react'

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

export default function App() {
  const [value, setValue] = useState(markdownText)
  const [mode, setMode] = useState('auto')
  const [localeKey, setLocaleKey] = useState('auto')
  const [maxLength, setMaxLength] = useState<number>()
  const [readOnly, setReadonly] = useState(false)

  const [enabled, setEnabled] = useState({
    breaks: false,
    frontmatter: true,
    gemoji: true,
    gfm: true,
    highlight: true,
    math: true,
    'medium-zoom': true,
    mermaid: true,
  })

  const plugins = useMemo(
    () =>
      [
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
      ].filter((x) => x),
    []
  )

  return (
    <div className="container">
      <div className="line">
        Mode:
        {['auto', 'split', 'tab'].map((m) => (
          <label key={m}>
            {' '}
            <input
              type="radio"
              checked={mode === m}
              onChange={() => setMode(m)}
              value={m}
            />
            {m}
          </label>
        ))}
        , Locale:
        <select
          value={localeKey}
          onChange={(e) => setLocaleKey(e.target.value)}
        >
          {Object.keys(locales).map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        , Max length:
        <input
          value={maxLength}
          onChange={(e) => setMaxLength(e.target.valueAsNumber)}
          type="number"
        />
        , Read only:
        <input
          checked={readOnly}
          onChange={(e) => setReadonly(e.target.checked)}
          type="checkbox"
        />
      </div>
      <div className="line">
        Plugins:
        {Object.keys(enabled).map((p) => (
          <label key={p}>
            {' '}
            <input
              type="checkbox"
              // @ts-expect-error
              checked={enabled[p]}
              onChange={(e) =>
                setEnabled(() => ({
                  ...enabled,
                  [p]: e.target.checked,
                }))
              }
            />
            {p}
          </label>
        ))}
      </div>

      <Editor
        value={value}
        // @ts-expect-error
        mode={mode}
        // @ts-expect-error
        plugins={plugins}
        maxLength={maxLength}
        readOnly={readOnly}
        placeholder={'Start writing with ByteMD'}
        locale={locales[localeKey]}
        uploadImages={(files: unknown[]) => {
          return Promise.all(
            files.map((file) => {
              // TODO:
              return {
                url: 'https://picsum.photos/300',
              }
            })
          )
        }}
        onChange={(value) => setValue(value)}
      />
    </div>
  )
}
