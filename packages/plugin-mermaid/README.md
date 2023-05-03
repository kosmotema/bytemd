# @kosmotema/bytemd-plugin-mermaid

[![npm](https://img.shields.io/npm/v/@kosmotema/bytemd-plugin-mermaid.svg)](https://npm.im/@kosmotema/bytemd-plugin-mermaid)

ByteMD plugin to support Mermaid diagram

## Usage

```js
import { Editor } from '@kosmotema/bytemd'
import mermaid from '@kosmotema/bytemd-plugin-mermaid'

new Editor({
  target: document.body,
  props: {
    plugins: [
      mermaid(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
