# @kosmotema/bytemd-plugin-highlight-ssr

[![npm](https://img.shields.io/npm/v/@kosmotema/bytemd-plugin-highlight-ssr.svg)](https://npm.im/@kosmotema/bytemd-plugin-highlight-ssr)

ByteMD plugin to highlight code blocks (SSR compatible)

## Usage

```js
import { Editor } from '@kosmotema/bytemd'
import highlight from '@kosmotema/bytemd-plugin-highlight-ssr'
import 'highlight.js/styles/default.css'

new Editor({
  target: document.body,
  props: {
    plugins: [
      highlight(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
