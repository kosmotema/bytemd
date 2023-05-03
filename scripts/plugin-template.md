# @kosmotema/bytemd-plugin-{{name}}

[![npm](https://img.shields.io/npm/v/@kosmotema/bytemd-plugin-{{name}}.svg)](https://npm.im/@kosmotema/bytemd-plugin-{{name}})

{{{desc}}}

## Usage

```js
{{{header}}}
import { Editor } from '@kosmotema/bytemd'
import {{importedName}} from '@kosmotema/bytemd-plugin-{{name}}'

new Editor({
  target: document.body,
  props: {
    plugins: [
      {{importedName}}(),
      // ... other plugins
    ],
  },
})
```

{{#options}}### Options

{{{options}}}
{{/options}}
{{#example}}## Example

{{{example}}}
{{/example}}
## License

MIT
