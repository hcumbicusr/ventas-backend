const express = require('express');
const secure = require('./secure');
const response = require('../../../network/response');
const Controller = require('./index');

const router = express.Router();

// Routes
router.get('/', list);
router.get('/:id', get);
router.post('/', insert);
router.put('/', secure('update'), update);

// Internal functions

async function list (req, res, next) {
    try {
        const lista = await Controller.list();
        response.success(req, res, lista, 200);
    } catch (error) {
        // response.error(req, res, error.message, 500);
        next(error);
    }
}

async function get (req, res, next) {
    try {
        const user = await Controller.get(req.params.id);
        response.success(req, res, user, 200);
    } catch (error) {
        // response.error(req, res, error.message, 500);
        next(error);
    }
}

async function insert(req, res, next) {
    try {
        const user = await Controller.insert(req.body);
        response.success(req, res, user, 201);
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const user = await Controller.update(req.body);
        response.success(req, res, user, 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;