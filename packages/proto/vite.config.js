import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    build: {
        rollupOptions: {
        input: {
            main: resolve(__dirname, 'index.html'),
            sub: resolve(__dirname, 'categories.html'),
            sub: resolve(__dirname, 'post.html'),
            sub: resolve(__dirname, 'share.html'),
            sub: resolve(__dirname, 'writing.html'),
        },
        },
    },
})