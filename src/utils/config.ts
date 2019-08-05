import * as dotenv from 'dotenv';

function init() {
    dotenv.config({path: process.env.DOTENV_CONFIG_PATH});
}

export enum KnownConfigKey {
    JwtSecret = 'JWT_SIGN_SECRET',
    ServerPort = 'SERVER_PORT',
    Auth = 'AUTH',
}

function get(key: string, fallback = ''): string {
    return process.env[key] || fallback;
}

export default {
    init,
    get,
};
