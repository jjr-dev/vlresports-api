import { randomUUID } from "crypto";

export function init() {
    global.caches = [];
}

export function save(type, data, minutes, params = {}) {
    const expireIn = new Date();
    expireIn.setMinutes(expireIn.getMinutes() + minutes);

    global.caches.push({
        __id: randomUUID(),
        type,
        params: JSON.stringify(params),
        data,
        expire_in: expireIn.toISOString()
    });
}

export function find(type, params = {}) {
    const cache = global.caches.find((item) => item.type === type && item.params === JSON.stringify(params));

    if (!cache)
        return false;

    if (new Date() > new Date(cache.expire_in)) {
        global.caches.splice(global.caches.findIndex((item) => item['id'] == cache.__id))

        return false;
    }

    return cache.data;
}