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


//documentation for signup path
registry.registerPath({
    method: 'post',
    path: '/auth/signup',
    summary: 'User Signup',
    description:
        'Register a new user. Returns user data and tokens. Requires API key.',
    tags: ['Auth'],
    security: [{ apiKey: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: schema.signup,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'User created successfully',
        },
        400: {
            description: 'Validation error or user already registered',
        },
        403: {
            description: 'Missing or invalid API key',
        },
    },
});

//documenatation for signout
registry.registerPath({
    method: 'delete',
    path: '/auth/signout',
    summary: 'User Signout',
    description:
        'Logout and invalidate the current session. Requires API key and Bearer JWT.',
    tags: ['Auth'],
    security: [{ apiKey: [], bearerAuth: [] }],
    responses: {
        200: {
            description: 'Logout success',
        },
        401: {
            description: 'Invalid or missing access token',
        },
        403: {
            description: 'Missing or invalid API key',
        },
    },
});

//documnetation for refresh-token
registry.registerPath({
    method: 'post',
    path: '/auth/token/refresh',
    summary: 'Refresh tokens',
    description:
        'Issue new access and refresh tokens. Send refresh token in body (JSON) or in cookies. Requires API key and Bearer JWT (current access token).',
    tags: ['Auth'],
    security: [{ apiKey: [], bearerAuth: [] }],
    responses: {
        200: {
            description: 'New tokens issued',
        },
        401: {
            description: 'Invalid or expired tokens',
        },
        403: {
            description: 'Missing or invalid API key',
        },
    },
});
