
const bcrypt = require('bcrypt');
const auth = require('../../../auth');
const err = require('../../../utils/error');
const TABLA = 'auth';

module.exports = function(injectedStore) {
    let store = injectedStore;
    if (!store) {
        store = require('../../../store/dummy');
    }

    async function login(username, password) {
        let data = await store.query(TABLA, { username: username });
        if ( data.length == 0 ) throw err('Información inválida', 400);
        data = data[0];
        return bcrypt.compare(password, data.password)
                .then(sonIguales => {
                    if (sonIguales === true) {
                        // Generar token
                        return auth.sign(data);
                    } else {
                        throw err('Información inválida', 400);
                    }
                });
        
    }

    async function insert(data) {
        const authData = {
            user_id: data.user_id,
            rol: data.rol,
            username: data.username,
            password: await bcrypt.hash(data.password, 5),
        }

        return store.insert(TABLA, authData);
    }

    async function update(data) {
        const authData = {
            user_id: data.user_id,
        }
        if (data.rol) {
            authData.rol = data.rol;
        }
        if (data.username) {
            authData.username = data.username;
        }
        if (data.password) {
            authData.password = await bcrypt.hash(data.password, 5);
        }
        // console.log("authData",authData);
        return store.update(TABLA, authData, 'user_id');
    }

    return {
        insert,
        update,
        login,
    }
}