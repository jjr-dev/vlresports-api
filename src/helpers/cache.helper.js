import db from "../../db.js";

export function save(type, params, data, minutes = 10) {
    const expireIn = new Date();
    expireIn.setMinutes(expireIn.getMinutes() + minutes);

    return db.update(({ caches }) => caches.push({
        __id: db.randomUUID(),
        type,
        params: JSON.stringify(params),
        data,
        expire_in: expireIn.toISOString()
    }))
}

export function find(type, params) {
    const { caches } = db.data;
    const cache = caches.find((item) => item.type === type && item.params === JSON.stringify(params));

    if (!cache)
        return false;

    if (new Date() > new Date(cache.expire_in)) {
        db.update(({ caches }) => {
            caches.splice(db.findIndex('caches', 'id', cache.__id))
        })

        return false;
    }

    return cache.data;
}