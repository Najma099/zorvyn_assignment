import { registry } from '../../docs/swagger';
import schema from './schema';

registry.registerPath({
    method: 'get',
    path: '/dashboard/total-income',
    summary: 'Total Income',
    description: 'Returns the total income for the authenticated user in rupees. Requires API key and Bearer JWT.',
    tags: ['Dashboard'],
    security: [{ apiKey: [], bearerAuth: [] }],
    responses: {
        200: {
            description: 'Total income returned successfully',
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
    method: 'get',
    path: '/dashboard/total-expense',
    summary: 'Total Expenses',
    description: 'Returns the total expenses for the authenticated user in rupees. Requires API key and Bearer JWT.',
    tags: ['Dashboard'],
    security: [{ apiKey: [], bearerAuth: [] }],
    responses: {
        200: {
            description: 'Total expenses returned successfully',
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
    method: 'get',
    path: '/dashboard/balance',
    summary: 'Net Balance',
    description: 'Returns total income, total expenses, net balance, and whether the user is in deficit. Requires API key and Bearer JWT.',
    tags: ['Dashboard'],
    security: [{ apiKey: [], bearerAuth: [] }],
    responses: {
        200: {
            description: 'Net balance returned successfully',
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
    method: 'get',
    path: '/dashboard/category',
    summary: 'Category Summary',
    description:
        'Returns total amounts grouped by category. Optionally filter by record type or a specific category. Requires API key and Bearer JWT.',
    tags: ['Dashboard'],
    security: [{ apiKey: [], bearerAuth: [] }],
    request: {
        query: schema.categorySummaryParams,
    },
    responses: {
        200: {
            description: 'Category summary returned successfully',
        },
        400: {
            description: 'Validation error on query params',
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
    method: 'get',
    path: '/dashboard/recent',
    summary: 'Recent Activity',
    description:
        'Returns the most recent finance records for the authenticated user. Optional query param: limit (default 5). Requires API key and Bearer JWT.',
    tags: ['Dashboard'],
    security: [{ apiKey: [], bearerAuth: [] }],
    responses: {
        200: {
            description: 'Recent activity returned successfully',
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
    method: 'get',
    path: '/dashboard/monthly-trends',
    summary: 'Monthly Trends',
    description:
        'Returns income and expense totals grouped by month for the authenticated user. Requires API key and Bearer JWT.',
    tags: ['Dashboard'],
    security: [{ apiKey: [], bearerAuth: [] }],
    responses: {
        200: {
            description: 'Monthly trends returned successfully',
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
    method: 'get',
    path: '/dashboard/weekly-trends',
    summary: 'Weekly Trends',
    description:
        'Returns income and expense totals grouped by week for the authenticated user. Requires API key and Bearer JWT.',
    tags: ['Dashboard'],
    security: [{ apiKey: [], bearerAuth: [] }],
    responses: {
        200: {
            description: 'Weekly trends returned successfully',
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
    method: 'get',
    path: '/dashboard/highest-expense',
    summary: 'Highest Expense',
    description:
        'Returns the single highest expense record for all users. Requires API key and Bearer JWT. Allowed roles: ADMIN, ANALYST.',
    tags: ['Dashboard'],
    security: [{ apiKey: [], bearerAuth: [] }],
    responses: {
        200: {
            description: 'Highest expense record returned successfully',
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
    path: '/dashboard/avg-spending',
    summary: 'Average Spending',
    description:
        'Returns the average expense amount in rupees along with the total number of expense records. Requires API key and Bearer JWT. Allowed roles: ADMIN, ANALYST.',
    tags: ['Dashboard'],
    security: [{ apiKey: [], bearerAuth: [] }],
    responses: {
        200: {
            description: 'Average spending returned successfully',
        },
        401: {
            description: 'Invalid or missing access token',
        },
        403: {
            description: 'Missing or invalid API key, or insufficient role (VIEWER not allowed)',
        },
    },
});