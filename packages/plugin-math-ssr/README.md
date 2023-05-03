# @kosmotema/bytemd-plugin-math-ssr

[![npm](https://img.shields.io/npm/v/@kosmotema/bytemd-plugin-math-ssr.svg)](https://npm.im/@kosmotema/bytemd-plugin-math-ssr)

ByteMD plugin to support math formula (SSR compatible)

## Usage

```js
import { Editor } from '@kosmotema/bytemd'
import math from '@kosmotema/bytemd-plugin-math-ssr'
import 'katex/dist/katex.css'

new Editor({
  target: document.body,
  props: {
    plugins: [
      math(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
