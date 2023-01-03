import * as icons from '@icon-park/svg/es/map'
import { execSync } from 'child_process'
import fs from 'fs-extra'
import svgo from 'svgo'

const meta: Record<string, (keyof typeof icons)[]> = {
  'bytemd/src': [
    'H',
    'H1',
    'H2',
    'H3',
    'LevelFourTitle',
    'LevelFiveTitle',
    'LevelSixTitle',
    'TextBold',
    'TextItalic',
    'Quote',
    'LinkOne',
    'Pic',
    'Code',
    'CodeBrackets',
    'ListTwo',
    'OrderedList',
    'DividingLine',

    'AlignTextLeftOne',
    'Helpcenter',
    'LeftExpand',
    'RightExpand',
    'OffScreen',
    'FullScreen',
    'GithubOne',
  ],
  'plugin-gfm/src': ['Strikethrough', 'CheckCorrect', 'InsertTable'],
  'plugin-math/src/utils': ['Formula', 'Inline', 'Block'],
  'plugin-mermaid/src': ['ChartGraph'],
}

for (let [p, keys] of Object.entries(meta)) {
  let obj = {}
  for (let key of keys) {
    const svg = svgo.optimize(icons[key]({}))
    obj[key] = svg.data
  }

  fs.writeFileSync(
    `./packages/${p}/icons.ts`,
    `// DO NOT EDIT, generated by scripts/icon.ts
      export const icons=${JSON.stringify(obj)}`
  )
}

execSync('npx prettier --write packages/**/*.ts')
