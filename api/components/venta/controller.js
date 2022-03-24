const moment = require('moment-timezone');
const config = require('../../../config');
const functions = require('../../../utils/functions');
const err = require('../../../utils/error');

const TABLA = 'venta';
const TIME_ZONE = config.timeZone;

module.exports = function(injectedStore) {
    let store = injectedStore;
    if (!store) {
        store = require('../../../store/dummy');
    }
    async function list() {
        return await store.list(TABLA);
    }
    async function listFechas(fecha_inicio, fecha_fin) {
        if ( fecha_inicio && fecha_fin ) {
            fecha_inicio = moment(fecha_inicio).add(5, 'hours').format('YYYY-MM-DD HH:mm:ss');
            fecha_fin = moment(fecha_fin).add(1, 'day').add(5, 'hours').format('YYYY-MM-DD HH:mm:ss');
            // console.log(fecha_inicio, fecha_fin);
            return await store.query(TABLA, null, 
                null,
                [{'venta.fecha_hora_inicio': 'DESC'}],
                null,
                null,
                {'field': 'venta.fecha_hora_inicio', 'start': fecha_inicio, 'end': fecha_fin });
        } else {
            return [];
        }
    }

    async function getDetalles(venta_id) {
        if ( venta_id ) {
            return await store.query(TABLA+"_detalle", [{'venta_id':venta_id}], 
                null,
                [{'fecha_hora_registro': 'ASC'}],
                null,
                null,
                null);
        } else {
            return [];
        }
    }

    async function get(id) {
        return await store.get(TABLA, id);
    }

    async function insert(body) {
        let data = {
            cliente_id: body.cliente_id??null,
            sucursal_id: body.sucursal_id??1,
            fecha_hora_inicio: moment.tz(TIME_ZONE).format('YYYY-MM-DDTHH:mm:ssZ'),
            user_id: body.user_id,
        }

        const save = await store.insert(TABLA, data);
        return {id: save.insertId};
    }

    async function update(body) {
        let venta_guardada = await get(body.id);
        if ( !venta_guardada ) {
            throw err("No se encontró la venta", 404);
        } else {
            venta_guardada = venta_guardada;
        }
        // console.log("venta_guardada", venta_guardada);
        const porc_igv = await functions.getIgv(store);
        let data = body;
        // console.log(body);
        data.descuento_porcentual = body.descuento_porcentual??0;

        let sub_total = body.sub_total??0;
        sub_total = parseFloat(sub_total);
        
        let totales = await functions.calcularIgv(store, sub_total);
        sub_total = totales.sub_total;
        data.sub_total = sub_total;

        const descuento_porcentual = parseFloat(data.descuento_porcentual);
        const descuento_monto = Math.round(( (sub_total * descuento_porcentual/100) + Number.EPSILON) * 100) / 100;
        let total_con_descuento = sub_total - descuento_monto;
        // console.log("total_con_descuento", total_con_descuento, sub_total, descuento_monto);
        
        totales = await functions.calcularIgv(store, total_con_descuento, false);
        total_con_descuento = totales.sub_total;
        const igv_monto = totales.monto_igv;
        const total_con_igv = totales.total;

        data.descuento_monto = descuento_monto;
        data.total_con_descuento = total_con_descuento;
        data.igv = porc_igv;
        data.igv_monto = igv_monto;
        data.total_con_igv = total_con_igv;

        if ( body.flg_pagado === true ) {
            data.tipo_pago = body.tipo_pago??'EFECTIVO';
            data.fecha_hora_fin = moment.tz(TIME_ZONE).format('YYYY-MM-DDTHH:mm:ssZ');
            data.monto_de_pago = body.monto_de_pago??0;
            data.vuelto = (parseFloat(data.monto_de_pago) - total_con_descuento);
            data.flg_pagado = 1;
            data.tipo_comprobante_id = body.tipo_comprobante_id??1; // 1 = Ticket
            if ( data.tipo_comprobante_id === 2 || data.tipo_comprobante_id === 3 ) {
                // 2=BOLETA o 3=FACTURA
                if ( !venta_guardada.letra_serie_comprobante || !venta_guardada.numero_serie_comprobante || !venta_guardada.numero_comprobante ) {
                    // Solo agrega los datos del comprobante cuando no los tiene
                    const comprobante = await functions.getCorrelativoComprobante(store, data.tipo_comprobante_id, body.sucursal_id);
                    data.letra_serie_comprobante = comprobante.letra_serie_comprobante;
                    data.numero_serie_comprobante = comprobante.numero_serie_comprobante;
                    data.numero_comprobante = comprobante.numero_comprobante;
                    await functions.updateCorrelativoComprobante(store, data.tipo_comprobante_id, body.sucursal_id, comprobante.numero_comprobante);
                }
            }
            data.total_en_letras = functions.numero_a_letras(data.total_con_igv);
        }
        
        await store.update(TABLA, data);
        for( i in data ) {
            venta_guardada[i] = data[i];
        }
        return venta_guardada;
    }

    async function insertDetalle(body) {
        let data = body;
        data.fecha_hora_registro = moment.tz(TIME_ZONE).format('YYYY-MM-DDTHH:mm:ssZ');
        const producto = await store.get('productos', data.producto_id);
        // console.log("producto", producto);
        // Calcular igv del detalle
        // console.log("producto.precio_venta",producto.precio_venta);
        let totales = await functions.calcularIgv(store, producto.precio_venta);
        console.log("totales", totales);
        // return;

        data.precio_con_igv = totales.total;
        data.precio_sin_igv = totales.sub_total;
        data.sub_total = Math.round(( (data.precio_sin_igv * data.cantidad) + Number.EPSILON) * 100) / 100;

        data.descuento_porcentual = data.descuento_porcentual??0;
        data.descuento_monto = Math.round(( (data.sub_total * parseFloat(data.descuento_porcentual)) + Number.EPSILON) * 100) / 100;
        data.total_con_descuento = Math.round(( (data.sub_total - data.descuento_monto) + Number.EPSILON) * 100) / 100;

        totales = await functions.calcularIgv(store, data.total_con_descuento, false);
        data.igv_monto = totales.monto_igv;
        data.total_final = totales.total;
        
        const save = await store.insert(TABLA+"_detalle", data);

        // update total de la venta
        let totales_venta = await functions.getTotalVenta(store, body.venta_id);

        let FLG_PRODUCTOS_CON_IGV = true;
        const result = await store.query('diccionario', [{'diccionario.dominio': 'FLG_PRODUCTOS_CON_IGV'},{'diccionario.activo':1}], null, 'diccionario.orden', 1);
        if (result.length > 0) FLG_PRODUCTOS_CON_IGV = JSON.parse(result[0].valor);

        let sub_total_venta = totales_venta.monto_con_igv;
        if ( !FLG_PRODUCTOS_CON_IGV ) sub_total_venta = totales_venta.monto_sin_igv;

        let venta = {
            id: body.venta_id,
            sub_total: sub_total_venta,
        };
        await update(venta);

        return {id: save.insertId};
    }

    async function remove(venta_id) {
        return await store.update(TABLA, {activo: 0, id: venta_id});
    }
    
    async function removeDetalle(venta_id, detalle_id) {
        await store.remove(TABLA+"_detalle", detalle_id);
        // update total de la venta
        let totales_venta = await functions.getTotalVenta(store, venta_id);

        let FLG_PRODUCTOS_CON_IGV = true;
        const result = await store.query('diccionario', [{'diccionario.dominio': 'FLG_PRODUCTOS_CON_IGV'},{'diccionario.activo':1}], null, 'diccionario.orden', 1);
        if (result.length > 0) FLG_PRODUCTOS_CON_IGV = JSON.parse(result[0].valor);

        let sub_total_venta = totales_venta.monto_con_igv;
        if ( !FLG_PRODUCTOS_CON_IGV ) sub_total_venta = totales_venta.monto_sin_igv;

        let venta = {
            id: venta_id,
            sub_total: sub_total_venta,
        };
        await update(venta);

        return true;
    }
    

    return {
        list,
        listFechas,
        get,
        getDetalles,
        insert,
        update,
        insertDetalle,
        remove,
        removeDetalle,
    };
}