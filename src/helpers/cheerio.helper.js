import * as cheerio from "cheerio";
import axios from "axios";

export function getPage(path, params) {
    return new Promise(async (resolve, reject) => {
        const data = await axios.get(`${process.env.BASE_URL}/valorant${path}`, { params }).then((res) => res.data).catch(() => { });

        if (!data)
            return reject({
                message: "Not found",
                code: 404
            });

        const cleanedData = data.replace(/[\t\n]+/g, ' ').replace(/\s{2,}/g, ' ');

        const page = cheerio.load(cleanedData);

        return resolve(page);
    })
}