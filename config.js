module.exports = {
    remoteDB: process.env.REMOTE_DB || false,
    timeZone: process.env.DEFAULT_TIME_ZONE || 'UTC',
    userTimeZone: process.env.USER_TIME_ZONE || 'America/Lima',
    defaultIGV: process.env.DEFAULT_IGV || 18,
    api: {
        port: process.env.API_PORT || 3000,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'KbPeShVmYq3t6w9z$B&E)H@McQfTjWnZr4u7x!A%D*F-JaNdRgUkXp2s5v8y/B?E(H+MbPeShVmYq3t6w9z$C&F)J@NcRfTjWnZr4u7x!A%D*G-KaPdSgVkXp2s5v8y/',
        expiresIn: process.env.JWT_EXPIRES_IN || '365d',
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        port: process.env.MYSQL_PORT || '3306',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'nodejs_ventas',
    },
}