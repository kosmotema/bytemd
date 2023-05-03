# @kosmotema/bytemd-plugin-gfm

[![npm](https://img.shields.io/npm/v/@kosmotema/bytemd-plugin-gfm.svg)](https://npm.im/@kosmotema/bytemd-plugin-gfm)

ByteMD plugin to support GFM (autolink literals, strikethrough, tables, tasklists)

## Usage

```js
import { Editor } from '@kosmotema/bytemd'
import gfm from '@kosmotema/bytemd-plugin-gfm'

new Editor({
  target: document.body,
  props: {
    plugins: [
      gfm(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
