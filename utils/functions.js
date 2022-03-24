const config = require('../config');

async function getIgv(store) {
    const result = await store.query('diccionario', [{'diccionario.dominio': 'IMPUESTO_IGV'},{'diccionario.activo':1}], null, 'diccionario.orden', 1);
    if ( result.length > 0 ) return parseFloat(result[0].valor);
    else return parseFloat(config.defaultIGV);
}

async function getCorrelativoComprobante(store, tipo_comprobante_id, sucursal_id) {
    const columns = [
        'comprobante_correlativo.id',
        'comprobante_correlativo.tipo_comprobante_id',
        'comprobante_tipos.letra',
        'comprobante_correlativo.letra_serie',
        'comprobante_correlativo.serie',
        'comprobante_correlativo.correlativo_actual',
        'comprobante_correlativo.sucursal_id'
    ];
    const result = await store.query(
            'comprobante_correlativo', 
            [{'comprobante_correlativo.tipo_comprobante_id': tipo_comprobante_id}, {'comprobante_correlativo.sucursal_id': sucursal_id}], 
            {'comprobante_tipos': 'tipo_comprobante_id'},
            null,
            null,
            columns
        );
    if ( result.length == 0 ) return null;
    result = result[0];
    let data = {
        comprobante_correlativo_id: result.id,
        letra_serie_comprobante: result.letra+result.letra_serie, // T, B , F
        numero_serie_comprobante: result.serie,
        numero_comprobante: (result.correlativo_actual+1),

    }
    return data;
}

async function updateCorrelativoComprobante(store, tipo_comprobante_id, sucursal_id, correlativo_actual) {
    const result = await getCorrelativoComprobante(store, tipo_comprobante_id, sucursal_id);
    if ( !result ) return null;
    const x = await store.update('comprobante_correlativo', {correlativo_actual: correlativo_actual, id: result.comprobante_correlativo_id});
    return x;
}

function convierte_cifra(numero, sw) {
    const lista_centana = ["", ["CIEN", "CIENTO"], "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS",
        "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"
    ];
    const lista_decena = ["", ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"],
        ["VEINTE", "VEINTI"],
        ["TREINTA", "TREINTA Y "],
        ["CUARENTA", "CUARENTA Y "],
        ["CINCUENTA", "CINCUENTA Y "],
        ["SESENTA", "SESENTA Y "],
        ["SETENTA", "SETENTA Y "],
        ["OCHENTA", "OCHENTA Y "],
        ["NOVENTA", "NOVENTA Y "]
    ];
    const lista_unidad = ["", ["UN", "UNO"], "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    const centena = parseInt(numero / 100);
    const decena = parseInt((numero - (centena * 100)) / 10);
    const unidad = parseInt(numero - (centena * 100 + decena * 10));

    let texto_centena = "";
    let texto_decena = "";
    let texto_unidad = "";

    // # Validad las centenas
    texto_centena = lista_centana[centena];
    if (centena == 1) {
        if ((decena + unidad) != 0)
            texto_centena = texto_centena[1];
        else
            texto_centena = texto_centena[0];
    }

    // # Valida las decenas
    texto_decena = lista_decena[decena];
    if (decena == 1)
        texto_decena = texto_decena[unidad];
    else if (decena > 1) {
        if (unidad != 0)
            texto_decena = texto_decena[1];
        else
            texto_decena = texto_decena[0];
    }
    // # Validar las unidades
    if (decena != 1) {
        texto_unidad = lista_unidad[unidad];
        if (unidad == 1)
            texto_unidad = texto_unidad[sw];
    }
    return `${texto_centena} ${texto_decena} ${texto_unidad}`;
}

function numero_a_letras(numero) {
    const indicador = [
        ["", ""],
        ["MIL", "MIL"],
        ["MILLON", "MILLONES"],
        ["MIL", "MIL"],
        ["BILLON", "BILLONES"]
    ];
    numero = parseFloat(numero);
    let entero = parseInt(numero);
    const decimal = parseInt(Math.round((((numero - entero) * 100)) + Number.EPSILON));
    let contador = 0;
    let numero_letras = "";
    while (entero > 0) {
        const a = entero % 1000;
        if (contador == 0)
            en_letras = convierte_cifra(a, 1).trim();
        else
            en_letras = convierte_cifra(a, 0).trim();
        if (a == 0)
            numero_letras = en_letras + " " + numero_letras;
        else if (a == 1) {
            if ([1, 3].includes(contador))
                numero_letras = indicador[contador][0] + " " + numero_letras;
            else
                numero_letras = en_letras + " " + indicador[contador][0] + " " + numero_letras;
        } else
            numero_letras = en_letras + " " + indicador[contador][1] + " " + numero_letras;
        numero_letras = numero_letras.trim();
        contador = contador + 1;
        entero = parseInt(entero / 1000);
    }
    if (numero_letras === "") numero_letras = "CERO";
    numero_letras = numero_letras + " Y " + decimal + "/100 SOLES";
    return numero_letras;
}
/**
 * 
 * @param {db conn} store 
 * @param {float} monto 
 * @param {boolean} tiene_igv 
 * @returns object {sub_total,monto_igv,total}
 */
async function calcularIgv(store, monto, tiene_igv) {
    const porc_igv = await getIgv(store);
    let FLG_PRODUCTOS_CON_IGV = tiene_igv;
    let total = 0;
    if ( FLG_PRODUCTOS_CON_IGV == undefined ) {
        const result = await store.query('diccionario', [{'diccionario.dominio': 'FLG_PRODUCTOS_CON_IGV'},{'diccionario.activo':1}], null, 'diccionario.orden', 1);
        if (result.length > 0) FLG_PRODUCTOS_CON_IGV = JSON.parse(result[0].valor);
    }

    if ( !FLG_PRODUCTOS_CON_IGV ) {
        monto_igv = Math.round(( (monto * porc_igv/100) + Number.EPSILON) * 100) / 100;
        sub_total = monto;
        total = Math.round(( (monto + monto_igv) + Number.EPSILON) * 100) / 100;
    } else {
        sub_total = Math.round(( (monto / (1+(porc_igv/100))) + Number.EPSILON) * 100) / 100;
        monto_igv = Math.round(( (monto - sub_total) + Number.EPSILON) * 100) / 100;
        total = monto;
    }
    const totales = {
        sub_total: sub_total,
        monto_igv: monto_igv,
        total: total
    }
    // console.log("FLG_PRODUCTOS_CON_IGV", FLG_PRODUCTOS_CON_IGV, totales);
    return totales;
}

async function getTotalVenta(store, venta_id) {
    let monto_sin_igv = 0;
    let monto_con_igv = 0;
    const detalles = await store.query("venta_detalle", [{'venta_id':venta_id}], 
            null,
            [{'fecha_hora_registro': 'ASC'}],
            null,
            null,
            null);
    
    for (i in detalles ) {
        monto_sin_igv += parseFloat(detalles[i].total_con_descuento);
        monto_con_igv += parseFloat(detalles[i].total_final);
    }
    return {monto_sin_igv: monto_sin_igv, monto_con_igv: monto_con_igv};
}



module.exports = {
    getIgv,
    getCorrelativoComprobante,
    updateCorrelativoComprobante,
    numero_a_letras,
    calcularIgv,
    getTotalVenta,
};