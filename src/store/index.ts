import {Product, Category, User, UserCredential, UserRole} from '../models';

interface StoreType {
    products: Product[];
    categories: Category[];
    users: User[];
    credentials: UserCredential[];
}

const store: StoreType = {
    products: [],
    categories: [],
    users: [
        {id: 1, name: 'John Snow'},
        {id: 2, name: 'Sansa Stark'},
    ],
    credentials: [
        {email: 'a', password: 'a', userId: 1, roles: [UserRole.Reader]},
        {email: 'b', password: 'b', userId: 2, roles: [UserRole.Contributor]},
        {email: 'c', password: 'c', userId: 3, roles: [UserRole.Admin]},
    ],
};

export default store;
