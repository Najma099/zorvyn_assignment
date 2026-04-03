import { registry } from '../../docs/swagger';
import schema from './schema';

registry.registerPath({
    method: 'patch',
    path: '/admin/{id}/role',
    summary: 'Update User Role',
    description:
        'Change a user role between VIEWER, ANALYST, and ADMIN. Requires API key and Bearer JWT. Allowed roles: ADMIN only. An admin cannot modify their own role.',
    tags: ['Admin'],
    security: [{ apiKey: [], bearerAuth: [] }],
    request: {
        params: schema.userId,
        body: {
            content: {
                'application/json': {
                    schema: schema.updateUserRole,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'User role updated successfully',
        },
        400: {
            description: 'Validation error or user does not exist or admin modifying own role',
        },
        401: {
            description: 'Invalid or missing access token',
        },
        403: {
            description: 'Missing or invalid API key, or insufficient role (ANALYST and VIEWER not allowed)',
        },
    },
});

registry.registerPath({
    method: 'patch',
    path: '/admin/{id}/status',
    summary: 'Update User Status',
    description:
        'Set a user status to ACTIVE or INACTIVE. Inactive users cannot login. Requires API key and Bearer JWT. Allowed roles: ADMIN only. An admin cannot modify their own status.',
    tags: ['Admin'],
    security: [{ apiKey: [], bearerAuth: [] }],
    request: {
        params: schema.userId,
        body: {
            content: {
                'application/json': {
                    schema: schema.updateUserStatus,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'User status updated successfully',
        },
        400: {
            description: 'Validation error or user does not exist or admin modifying own status',
        },
        401: {
            description: 'Invalid or missing access token',
        },
        403: {
            description: 'Missing or invalid API key, or insufficient role (ANALYST and VIEWER not allowed)',
        },
    },
});