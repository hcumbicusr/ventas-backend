const express = require('express');

const response = require('../../../network/response');
const Controller = require('./index');

const router = express.Router();

// Routes
router.get('/', list);


// Internal functions

async function list (req, res, next) {
    try {
        const lista = await Controller.list();
        response.success(req, res, lista, 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;