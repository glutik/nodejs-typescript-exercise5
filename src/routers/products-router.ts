import express, {Request, Response, NextFunction} from 'express';
import uuidv1 from 'uuid/v1';
import {Product} from '../models';
import {
    checkIndexLengthOrBadRequest, checkNameLengthOrConflict,
    findProductsByIndexOrNotFound, loadProducts,
    loadProductsMw,
    resolveProductsFromResponse
} from '../utils/utils';
import {createLogger} from '../utils/log';
import {newProductSchema, productSchema} from '../validations/product';
import {getOrThrow} from '../utils/validate';
import {authenticate} from '../middleware/auth';
import {authorize} from '../middleware/auth';
import {UserRole} from '../models';

const router = express.Router();
const logger = createLogger('Products logger');

router.get('/',
    authenticate(),
    loadProductsMw,
    (req, res, next) => {
        try {
            const products = resolveProductsFromResponse(res);
            res.send(products);
        } catch (err) {
            next(err);
        }
    });

router.get('/:id',
    authenticate(),
    checkIndexLengthOrBadRequest,
    async (req, res, next) => {
        logger.info('Fetching product');
        try {
            const {id} = req.params;
            const product = (await loadProducts()).find(p => p.id === id);

            if (!product) {
                res.sendStatus(404);
                return;
            }

            res.send(product);
        } catch (err) {
            console.log('Default error handler...');
            next(err);
        }
    });

router.post('/',
    authenticate(),
    authorize(UserRole.Admin),
    async (req, res, next) => {
        try {
            // const product: Product = req.body;
            const product: Product | undefined = getOrThrow<Product>(req.body, newProductSchema, next);
            if (product) {
                product.id = uuidv1();
                const products = await loadProducts();
                products.push(product);
                res.status(201).send(products);
            }
        } catch (err) {
            next(err);
        }
    });

router.put('/:id',
    authenticate(),
    authorize(UserRole.Admin),
    // checkIndexLengthOrBadRequest,
    // checkNameLengthOrConflict,
    findProductsByIndexOrNotFound,
    (req, res, next) => {
        try {
            const {id} = req.params;
            // const product: Product = req.body;
            req.body.id = id;
            const product: Product | undefined = getOrThrow<Product>(req.body, productSchema, next);
            if (product) {
                product.id = id;
                loadProducts().then(products => {
                    products[res.locals.entityIndex] = product;
                    res.status(200).send(product);
                });
            }
        } catch (err) {
            next(err);
        }
    });

router.delete('/:id',
    authenticate(),
    authorize(UserRole.Admin),
    checkIndexLengthOrBadRequest,
    findProductsByIndexOrNotFound,
    async (req, res, next) => {
        try {
            const products = await loadProducts();
            products.splice(res.locals.entityIndex, 1);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    });

export default router;
