const {nanoid} = require('nanoid');
const auth = require('../auth');
const config = require('../../../config');
const moment = require('moment-timezone');

const TABLA = 'productos';
const TIME_ZONE = config.timeZone;

module.exports = function(injectedStore) {
    let store = injectedStore;
    if (!store) {
        store = require('../../../store/dummy');
    }

    async function list() {
        const data = await store.list(TABLA);
        return data;
    }
    async function get(id) {
        return await store.get(TABLA, id);
    }
    async function insert(body) {
        const data = body;
        data.fecha_hora_registro = moment.tz(TIME_ZONE).format('YYYY-MM-DDTHH:mm:ssZ');
        
        const save = await store.insert(TABLA, data);

        return {id: save.insertId};
    }

    async function update(body) {
        const data = body;
        data.fecha_hora_actualizado = moment.tz(TIME_ZONE).format('YYYY-MM-DDTHH:mm:ssZ');
        
        await store.update(TABLA, data);
        
        return data;
    }

    return {
        list,
        get,
        insert,
        update,
    };
}