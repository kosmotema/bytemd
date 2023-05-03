# @kosmotema/bytemd-plugin-highlight

[![npm](https://img.shields.io/npm/v/@kosmotema/bytemd-plugin-highlight.svg)](https://npm.im/@kosmotema/bytemd-plugin-highlight)

ByteMD plugin to highlight code blocks

## Usage

```js
import { Editor } from '@kosmotema/bytemd'
import highlight from '@kosmotema/bytemd-plugin-highlight'
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
