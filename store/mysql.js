const mysql = require('mysql');

const config = require('../config');

const dbconf = {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

// Connect
let connection;

function handleCon() {
    connection = mysql.createConnection(dbconf);

    connection.connect((err) => {
        if ( err ) {
            console.error('[db error]', err);
            setTimeout(handleCon, 2000);
        } else {
            console.log('DB Connected!');
        }
    });

    connection.on('error', err => {
        console.error('[db error]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleCon();
        } else {
            throw err;
        }
    })
}

handleCon();

function list(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} `, (err, data) => {
            if(err) return reject(err);

            resolve(data);
        })
    });
}

function get(table, id) {
    return new Promise((resolve, reject) => {
        const q = connection.query(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, data) => {
            if(err) return reject(err);
            if ( data.length > 0 )  data = data[0];
            resolve(data);
        });
        // console.log("Query: ",q.sql);
    });
}

function remove(table, id) {
    return new Promise((resolve, reject) => {
        const q = connection.query(`DELETE FROM ${table} WHERE id = ?`, [id], (err, data) => {
            if(err) return reject(err);
            if ( data.length > 0 )  data = data[0];
            resolve(data);
        });
        // console.log("Query: ",q.sql);
    });
}


function insert(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
            if(err) return reject(err);

            resolve(result);
        })
    });
} 
/**
 * 
 * @param {string} table 
 * @param {object} data 
 * @param {string} pk_field 
 * @returns 
 */
function update(table, data, pk_field) {
    const pk = pk_field??'id';
    // console.log(table, pk, data);
    return new Promise((resolve, reject) => {
        const q = connection.query(`UPDATE ${table} SET ? WHERE ${pk} = ?`, [data, data[pk]], (err, result) => {
            if(err) return reject(err);

            resolve(result);
        });
        // console.log("Query: ",q.sql);
    });
}
/**
 * 
 * @param {string} table 
 * @param {array|object} where 
 * @param {object} join 
 * @param {object} order 
 * @param {int} limit 
 * @param {array} columns 
 * @param {object} between 
 * @returns Promise
 */
function query(table, where, join, order, limit, columns, between) {
    let whereQuery = '';
    let whereArray = [];
    // console.log(typeof where);
    if ( Array.isArray(where) ) {
       for(i in where) {
            const clave = Object.keys(where[i])[0];
            whereArray.push(`${connection.escapeId(clave)}=${connection.escape(where[i][clave])}`) ;
        }
        whereQuery = whereArray.join(' AND ');
    } else if ( typeof where === 'object' && where != null) {
        const clave = Object.keys(where)[0];
        const valor = Object.values(where)[0];
        whereQuery = `${connection.escapeId(clave)}=${connection.escape(valor)}`;
    }

    let betweenQuery = '';
    if ( typeof between === 'object' && between != null) {
        betweenQuery = ` ${connection.escapeId(between.field)} BETWEEN ${connection.escape(between.start)} AND ${connection.escape(between.end)}`
    }
    whereQuery += betweenQuery;
    
    let joinQuery = '';
    if (join) {
        const table_join = Object.keys(join)[0];
        const fk = Object.values(join)[0];
        joinQuery = 'JOIN '+connection.escapeId(table_join)+' ON '+connection.escapeId(table+'.'+fk)+' = '+connection.escapeId(table_join+'.id');
    }
    let orderQuery = '';
    let orderArray = [];
    if ( Array.isArray(order) ) {
        for(i in order) {
            const clave = Object.keys(order[i])[0];
            // console.log('order', order, i, clave, order[i][clave]);
            orderArray.push(`${connection.escapeId(clave)} ${order[i][clave]}`);
        }
        orderQuery = `ORDER BY `+orderArray.join(",");
    }
    let limitQuery = '';
    if (parseInt(limit) > 0) {
        limitQuery = `LIMIT ${parseInt(limit)}`;
    }

    if ( !columns || columns.length == 0 ) columns = ['*'];

    return new Promise((resolve, reject) => {
        const q = connection.query(`SELECT ${columns??'*'} FROM ${table} ${joinQuery} WHERE ${whereQuery} ${orderQuery} ${limitQuery}`, [columns], (err, result) => {
            if ( err ) return reject(err);
            resolve(result);
        });
        console.log("Query: ",q.sql);
    });
}

module.exports = {
    list,
    get,
    insert,
    update,
    query,
    remove,
}