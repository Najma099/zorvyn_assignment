import { registry } from '../../docs/swagger';
import schema from './schema';

registry.registerPath({
    method: 'post',
    path: '/records',
    summary: 'Create Finance Record',
    description:
        'Create a new finance record. Amount should be in rupees (e.g. 168.99) and will be stored in paise internally. Requires API key and Bearer JWT. Allowed roles: ADMIN',
    tags: ['Records'],
    security: [{ apiKey: [], bearerAuth: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: schema.createFinancialRecord,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Record created successfully',
        },
        400: {
            description: 'Validation error',
        },
        401: {
            description: 'Invalid or missing access token',
        },
        403: {
            description: 'Missing or invalid API key, or insufficient role (VIEWER not allowed)',
        },
    },
});

registry.registerPath({
    method: 'get',
    path: '/records',
    summary: 'Get Finance Records',
    description:
        'Returns a paginated list of finance records for the authenticated user. Optional query params: skip (default 0), take (default 10). Requires API key and Bearer JWT. All roles allowed.',
    tags: ['Records'],
    request: {
        query: schema.paginationParams,
    },
    security: [{ apiKey: [], bearerAuth: [] }],
    responses: {
        200: {
            description: 'Records fetched successfully',
        },
        401: {
            description: 'Invalid or missing access token',
        },
        403: {
            description: 'Missing or invalid API key',
        },
    },
});

registry.registerPath({
    method: 'put',
    path: '/records/{id}',
    summary: 'Update Finance Record',
    description:
        'Update an existing finance record by ID. All fields are optional. Requires API key and Bearer JWT. Allowed roles: ADMIN only.',
    tags: ['Records'],
    security: [{ apiKey: [], bearerAuth: [] }],
    request: {
        params: schema.recordId,
        body: {
            content: {
                'application/json': {
                    schema: schema.updateFinancialRecord,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Record updated successfully',
        },
        400: {
            description: 'Validation error',
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
    method: 'delete',
    path: '/records/{id}',
    summary: 'Delete Finance Record',
    description:
        'Soft delete a finance record by ID. Sets deletedAt timestamp. Requires API key and Bearer JWT. Allowed roles: ADMIN only.',
    tags: ['Records'],
    security: [{ apiKey: [], bearerAuth: [] }],
    request: {
        params: schema.recordId,
    },
    responses: {
        200: {
            description: 'Record deleted successfully',
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
    method: 'get',
    path: '/records/filter',
    summary: 'Filter Finance Records',
    description:
        'Returns finance records filtered by date range, category, or record type. Supports pagination via skip and take. Requires API key and Bearer JWT. Allowed roles: ADMIN',
    tags: ['Records'],
    security: [{ apiKey: [], bearerAuth: [] }],
    request: {
        query: schema.financialRecordFilter,
    },
    responses: {
        200: {
            description: 'Filtered records returned successfully',
        },
        400: {
            description: 'Validation error on query params (e.g. fromDate after toDate)',
        },
        401: {
            description: 'Invalid or missing access token',
        },
        403: {
            description: 'Missing or invalid API key, or insufficient role (VIEWER not allowed)',
        },
    },
});