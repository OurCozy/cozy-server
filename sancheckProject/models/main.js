const pool = require('../modules/pool');
const table = 'bookstore';
const table2 = 'hashtag';
const table3 = 'images';

const bookstore = {
    showRecommendation: async () => {
        // const fields = 'id, name, password, salt, email';
        // const questions = `?, ?, ?, ?, ?`;
        // const values = [id, name, password, salt, email];
        const query = `SELECT * FROM ${table}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },
}

module.exports = bookstore;