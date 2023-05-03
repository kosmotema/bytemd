# @kosmotema/bytemd-plugin-gemoji

[![npm](https://img.shields.io/npm/v/@kosmotema/bytemd-plugin-gemoji.svg)](https://npm.im/@kosmotema/bytemd-plugin-gemoji)

ByteMD plugin to support Gemoji shortcodes

## Usage

```js
import { Editor } from '@kosmotema/bytemd'
import gemoji from '@kosmotema/bytemd-plugin-gemoji'

new Editor({
  target: document.body,
  props: {
    plugins: [
      gemoji(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
