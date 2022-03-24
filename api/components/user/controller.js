const {nanoid} = require('nanoid');
const auth = require('../auth');
const config = require('../../../config');
const moment = require('moment-timezone');

const TABLA = 'users';
const TIME_ZONE = config.timeZone;

module.exports = function(injectedStore) {
    let store = injectedStore;
    if (!store) {
        store = require('../../../store/dummy');
    }

    async function list() {
        users = await store.list(TABLA);
        return users;
    }
    async function get(id) {
        return await store.get(TABLA, id);
    }
    async function insert(body) {
        const user = {
            id : nanoid(),
            name: body.name??'',
            username: body.username,
            lastname: body.lastname,
            email: body.email??'',
            phone: body.phone??'',
            created_at: moment.tz(TIME_ZONE).format('YYYY-MM-DDTHH:mm:ssZ'),
        }
        // console.log("user",user);
        await store.insert(TABLA, user);

        if (body.password || body.username) {
            await auth.insert({
                user_id: user.id,
                username: user.username,
                password: body.password,
                rol: body.rol,
            });
        }
        return user;
    }

    async function update(body) {
        const user = {};
        if ( body.name ) user.name = body.name;
        if ( body.username ) user.username = body.username;
        if ( body.lastname ) user.lastname = body.lastname;
        if ( body.email ) user.email = body.email;
        if ( body.phone ) user.phone = body.phone;
        user.updated_at = moment.tz(TIME_ZONE).format('YYYY-MM-DDTHH:mm:ssZ');

        if ( body.id ) user.id = body.id;

        await store.update(TABLA, user);

        if (body.password || body.username) {
            auth_user = {user_id: user.id};
            if ( user.username ) auth_user.username = user.username;
            if ( body.password ) auth_user.password = body.password;
            if ( user.rol ) auth_user.username = user.rol;
            await auth.update(auth_user);
        }
        
        return user;
    }

    return {
        list,
        get,
        insert,
        update,
    };
}