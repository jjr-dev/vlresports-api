import * as cheerio from "cheerio";
import axios from "axios";

const web = axios.create({
    baseURL: 'https://www.vlr.gg'
})

export function getPage(path, params) {
    return new Promise(async (resolve, reject) => {
        const data = await web.get(path, { params }).then((res) => res.data).catch((err) => false);

        if (!data)
            return reject({
                message: "Not found",
                status: 404
            });

        const cleanedData = data.replace(/[\t\n]+/g, ' ').replace(/\s{2,}/g, ' ');

        const page = cheerio.load(cleanedData);

        return resolve(page);
    })
}