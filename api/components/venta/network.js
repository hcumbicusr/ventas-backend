const express = require('express');

const secure = require('./secure');
const response = require('../../../network/response');
const Controller = require('./index');

const router = express.Router();

// Routes
router.get('/', secure('read'), list);
router.get('/:venta_id/detalle', secure('read'), getDetalles);
router.get('/:inicio/:fin', secure('read'), listFechas);
router.get('/:id', secure('read'), get);
router.post('/', secure('create'), insert);
router.put('/', update);
router.post('/:venta_id/detalle', secure('create'), insertDetalle);
router.delete('/:venta_id', secure('delete'), remove);
router.delete('/:venta_id/detalle/:detalle_id', secure('delete'), removeDetalle);


// Internal functions

async function list (req, res, next) {
    try {
        const lista = await Controller.list();
        response.success(req, res, lista, 200);
    } catch (error) {
        next(error);
    }
}

async function listFechas (req, res, next) {
    try {
        const lista = await Controller.listFechas(req.params.inicio, req.params.fin);
        response.success(req, res, lista, 200);
    } catch (error) {
        next(error);
    }
}

async function getDetalles (req, res, next) {
    try {
        const data = await Controller.getDetalles(req.params.venta_id);
        response.success(req, res, data, 200);
    } catch (error) {
        next(error);
    }
}

async function get (req, res, next) {
    try {
        const data = await Controller.get(req.params.id);
        response.success(req, res, data, 200);
    } catch (error) {
        next(error);
    }
}

async function insert(req, res, next) {
    let venta = req.body;
    venta.user_id = req.user.user_id;
    try {
        const data = await Controller.insert(venta);
        response.success(req, res, data, 201);
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const data = await Controller.update(req.body);
        response.success(req, res, data, 200);
    } catch (error) {
        next(error);
    }
}

async function insertDetalle(req, res, next) {
    let detalle = req.body;
    detalle.venta_id = req.params.venta_id;
    detalle.user_id = req.user.user_id;
    try {
        const data = await Controller.insertDetalle(detalle);
        response.success(req, res, data, 201);
    } catch (error) {
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        await Controller.remove(req.params.venta_id);
        response.success(req, res, "", 200);
    } catch (error) {
        next(error);
    }
}

async function removeDetalle(req, res, next) {
    try {
        await Controller.removeDetalle(req.params.venta_id, req.params.detalle_id);
        response.success(req, res, "", 200);
    } catch (error) {
        next(error);
    }
}

module.exports = router;