# @kosmotema/bytemd-plugin-math

[![npm](https://img.shields.io/npm/v/@kosmotema/bytemd-plugin-math.svg)](https://npm.im/@kosmotema/bytemd-plugin-math)

ByteMD plugin to support math formula

## Usage

```js
import { Editor } from '@kosmotema/bytemd'
import math from '@kosmotema/bytemd-plugin-math'
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
