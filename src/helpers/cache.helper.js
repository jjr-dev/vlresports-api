import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import slug from "slug";

const cacheDir = "cache";

export function init() {
    if (!fs.existsSync(cacheDir))
        fs.mkdirSync(cacheDir, {
            recursive: true,
            mode: 0o755,
        });
}

export function set(type, data, seconds, params = {}) {
    const expireIn = new Date();
    expireIn.setSeconds(expireIn.getSeconds() + seconds);

    const filePath = _getFilePath(type, params);

    fs.writeFileSync(
        filePath,
        JSON.stringify({
            __id: randomUUID(),
            type,
            data,
            expire_in: expireIn.toISOString(),
        }),
        {
            mode: 0o644,
        }
    );
}

export function get(type, params = {}) {
    try {
        const filePath = _getFilePath(type, params);

        if (!fs.existsSync(filePath)) return false;

        let cache = fs.readFileSync(filePath, "utf-8");

        cache = JSON.parse(cache);

        if (new Date() > new Date(cache.expire_in)) {
            del(type, params);
            return false;
        }

        return cache.data;
    } catch (err) {
        return false;
    }
}

function del(type, params = {}) {
    const filePath = _getFilePath(type, params);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

function _getFilePath(type, params = {}) {
    return path.join(cacheDir, `${type}_${slug(JSON.stringify(params))}.json`);
}
