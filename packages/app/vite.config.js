export default {
    server: {
        proxy: {
        "/api/stories": "http://localhost:3000",
        "/auth": "http://localhost:3000",
        "/search": "http://localhost:3000"
        }
    }
};