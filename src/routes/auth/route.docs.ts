import { registry } from '../../docs/swagger';
import schema from './schema';

// documentation for the signin route
registry.registerPath({
    method: 'post',
    path: '/auth/signin',
    summary: 'User Signin',
    description:
        'Login with email and password. Returns user data and tokens. Requires API key.',
    tags: ['Auth'],
    security: [{ apiKey: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: schema.signin,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Login success',
        },
        400: {
            description: 'Validation error or user not registered',
        },
        401: {
            description: 'Authentication failure (invalid password)',
        },
        403: {
            description: 'Missing or invalid API key',
        },
    },
});
