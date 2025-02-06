require('dotenv').config();

module.exports = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT || 2052,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    },
    steam: {
        apiKey: process.env.STEAM_API_KEY,
        gameAppId: process.env.STEAM_GAME_APPID,
        contextId: process.env.STEAM_CONTEXT_ID
    },
    flood: {
        time: 100,
        count: 5
    },
    maintenance_exclude: ['admin']
};
