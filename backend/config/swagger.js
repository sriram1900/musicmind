const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MusicMind API',
            version: '1.0.0',
            description: 'API documentation for MusicMind Backend',
        },
        servers: [
            {
                url: 'http://localhost:8888',
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'musicmind-session-v2'
                }
            }
        },
        security: [{
            cookieAuth: []
        }]
    },
    apis: ['./server.js', './routes/*.js'], // Files containing annotations
};

const specs = swaggerJsdoc(options);
module.exports = specs;
