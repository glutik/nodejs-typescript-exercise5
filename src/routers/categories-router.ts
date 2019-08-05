import express, {Request, Response, NextFunction} from 'express';
import uuidv1 from 'uuid/v1';
import {Category, Product} from '../models';
import {
    findCategoriesByIndexOrNotFound,
    loadCategories,
    loadCategoriesMw,
    resolveCategoriesFromResponse
} from '../utils/utils';
import {checkIndexLengthOrBadRequest} from '../utils/utils';
import {loadProducts} from '../utils/utils';
import {checkNameLengthOrConflict} from '../utils/utils';
import {createLogger} from '../utils/log';
import {authenticate} from '../middleware/auth';
import {auth} from '../middleware/auth';
import {UserRole} from '../models';

const router = express.Router();
const logger = createLogger('Categories logger');

router.get('/',
    authenticate(),
    loadCategoriesMw,
    (req, res, next) => {
        try {
            const categories = resolveCategoriesFromResponse(res);
            console.log('=================== cats: ', categories)
            // res.send(categories);


            res.render('categories', {
                pageTitle: 'Categories Page',
                categories,
                helpers: {
                    titleCase: (p: string) => p.replace(
                        /\w\S*/g,
                        txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
                    ),
                },
            });


        } catch (err) {
            next(err);
        }

    });

router.get('/:id/products',
    authenticate(),
    checkIndexLengthOrBadRequest,
    async (req, res, next) => {
        logger.info('Fetching products for category');
        try {
            const {id} = req.params;
            const category = (await loadCategories()).find(c => c.id === id);

            if (!category) {
                res.sendStatus(404);
                return;
            }

            const products = await loadProducts();
            const categoryProducts = products.filter(prod => prod.categoryId === category.id);
            res.send(categoryProducts);
        } catch (err) {
            next(err);
        }
    },
);

router.get('/:id',
    authenticate(),
    checkIndexLengthOrBadRequest,
    async (req, res, next) => {
        logger.info('Fetching category');
        try {
            const {id} = req.params;
            const category = (await loadCategories()).find(c => c.id === id);

            if (!category) {
                res.sendStatus(404);
                return;
            }

            res.send(category);
        } catch (err) {
            next(err);
        }
    });

router.post('/',
    auth(UserRole.Admin),
    checkNameLengthOrConflict,
    (req, res, next) => {
        const category: Category = req.body;
        category.id = uuidv1();

        loadCategories()
            .then(categories => {
                categories.push(category);
                res.status(201).send(categories);
            })
            .catch(next);
    },
);

router.put('/:id',
    auth(UserRole.Admin),
    checkIndexLengthOrBadRequest,
    checkNameLengthOrConflict,
    findCategoriesByIndexOrNotFound,
    (req, res, next) => {
        try {

            const {id} = req.params;
            const category: Category = req.body;
            category.id = id;
            loadCategories().then(categories => {
                categories[res.locals.entityIndex] = category;
                res.status(200).send(category);
            });
        } catch (err) {
            next(err);
        }
    },
);

router.delete('/:id',
    auth(UserRole.Admin),
    checkIndexLengthOrBadRequest,
    findCategoriesByIndexOrNotFound,
    async (req, res, next) => {
        try {
            const categories = await loadCategories();
            categories.splice(res.locals.entityIndex, 1);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    },
);

export default router;
