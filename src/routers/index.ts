import products from './products-router';
import categories from './categories-router';
import users from './users-router';
import login from './login-router';

export default [
    {
        prefix: '/products',
        router: products,
    },
    {
        prefix: '/categories',
        router: categories,
    },
    {
        prefix: '/users',
        router: users,
    },
    {
        prefix: '/login',
        router: login,
    },
];
