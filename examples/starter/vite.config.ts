import { defineConfig } from 'vite'
// Scale Edit — the in-page annotation/edit overlay. It's OFF by default;
// even with this plugin present it only activates when you run with the
// SCALE_EDIT env var set (see the `dev:edit` script) or pass { enabled: true }.
import { scaleEdit } from '@scale-ds/scale-design-system/vite'

export default defineConfig({
  plugins: [scaleEdit()],
})
