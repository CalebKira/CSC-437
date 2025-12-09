import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                categories: resolve(__dirname, 'categories.html'),
                post: resolve(__dirname, 'post.html'),
                share: resolve(__dirname, 'share.html'),
                writing: resolve(__dirname, 'writing.html'),
                home: resolve(__dirname, 'home.html'),
                login: resolve(__dirname, 'login.html'),
            },
        },
    },
})