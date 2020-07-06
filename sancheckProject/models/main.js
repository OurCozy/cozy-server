const pool = require('../modules/pool');
const table = 'bookstore';
const table2 = 'hashtag';
const table3 = 'images';

const bookstore = {
    showRecommendation: async () => {
        // const fields = 'id, name, password, salt, email';
        // const questions = `?, ?, ?, ?, ?`;
        // const values = [id, name, password, salt, email];
        const query = `SELECT shortIntro, shortIntro2, bookstoreName, location FROM ${table} WHERE shortIntro IS NOT NULL`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },
    showLocation: async (sectionIdx) => {
        const query = `SELECT * FROM ${table} WHERE sectionIdx = ${sectionIdx};`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showLocation ERROR : ', err);
            throw err;
        }
    }
}

module.exports = bookstore;