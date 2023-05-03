# @kosmotema/bytemd-plugin-breaks

[![npm](https://img.shields.io/npm/v/@kosmotema/bytemd-plugin-breaks.svg)](https://npm.im/@kosmotema/bytemd-plugin-breaks)

ByteMD plugin to support breaks

## Usage

```js
import { Editor } from '@kosmotema/bytemd'
import breaks from '@kosmotema/bytemd-plugin-breaks'

new Editor({
  target: document.body,
  props: {
    plugins: [
      breaks(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
