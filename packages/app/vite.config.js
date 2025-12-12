export default {
    server: {
        proxy: {
        "/api/stories": "http://localhost:3000",
        "/auth": "http://localhost:3000",
        "/search": "http://localhost:3000",
        "/profile": "http://localhost:3000"
        }
        /* you have to edit this every time you add an API. That's why he 
            did /api/ first */
    }
};