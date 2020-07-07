const pool = require('../modules/pool');
const bookstoreTable = 'bookstore';
const table2 = 'hashtag';
const table3 = 'images';

const bookstore = {

    showRecommendation: async () => {
        const query = `select shortIntro, shortIntro2, location from ${bookstoreTable} order by bookmark desc limit 8`;
        try { 
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },

    showDetail: async (bookstoreIdx) => {
        const query = `select * from ${bookstoreTable} WHERE bookstoreIdx=${bookstoreIdx}`;

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