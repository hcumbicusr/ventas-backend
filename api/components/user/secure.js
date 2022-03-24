const auth = require('../../../auth');

module.exports = function checkAuth(action) {


    function middleware(req, res, next) {
        switch(action) {
            case 'update':
                // TODO - que el admin también pueda modificar el usuario
                const owner = req.body.id;
                auth.check.own(req, owner);
                next();
                break;
            
            default:
                next();
        }
    }

    return middleware;
}