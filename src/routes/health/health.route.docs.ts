import { registry } from '../../docs/swagger';

registry.registerPath({
    method: 'get',
    path: '/health',
    summary: 'Health check',
    description: 'Check if the server is running. No authentication required.',
    tags: ['Health'],
    security: [],
    responses: {
        200: {
            description: 'The server is healthy and running.',
        },
    },
});