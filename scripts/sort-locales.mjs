import { globbySync } from 'globby'
import sortJson from 'sort-json'

const locales = globbySync('packages/*/locales/*.json', {
  absolute: true,
})

sortJson.overwrite(locales)
