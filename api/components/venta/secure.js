const auth = require('../../../auth');

module.exports = function checkAuth(action) {


    function middleware(req, res, next) {
        switch(action) {
            case 'create':
                auth.check.logged(req);
                next();
                break;
            case 'read':
                auth.check.logged(req);
                next();
                break;
            case 'update':
                auth.check.logged(req);
                next();
                break;
            case 'delete':
                auth.check.logged(req);
                next();
                break;
            default:
                next();
        }
    }

    return middleware;
}