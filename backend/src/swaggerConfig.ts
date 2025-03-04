import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {Express} from 'express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Guestbook Game API',
            version: '1.0.0',
            description: 'API documentation for the Guestbook Game app',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ]
    },
    apis: ['./src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Function to set up Swagger UI in an Express app.
 * @param app - Express application instance
 */
export function setupSwagger(app: Express): void {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get('/swagger.json', (_req, res) => {
        res.json(swaggerSpec);
    });
}
