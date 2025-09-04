// src/config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Yatra Backend API',
            version: '1.0.0',
            description: 'API documentation for Yatra Backend',
        },
        servers: [
            {
                url: 'http://localhost:8080/api',
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.js', './src/models/*.js'], // where your routes & models are
};

export const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
