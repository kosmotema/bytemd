# @kosmotema/bytemd-plugin-frontmatter

[![npm](https://img.shields.io/npm/v/@kosmotema/bytemd-plugin-frontmatter.svg)](https://npm.im/@kosmotema/bytemd-plugin-frontmatter)

ByteMD plugin to parse frontmatter

## Usage

```js
import { Editor } from '@kosmotema/bytemd'
import frontmatter from '@kosmotema/bytemd-plugin-frontmatter'

new Editor({
  target: document.body,
  props: {
    plugins: [
      frontmatter(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
