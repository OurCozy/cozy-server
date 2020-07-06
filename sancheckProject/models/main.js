const pool = require('../modules/pool');
const bookstorTable = 'bookstore';
const table2 = 'hashtag';
const table3 = 'images';

const bookstore = {

    showRecommendation: async () => {
        const query = `select shortIntro, shortIntro2, location from ${bookstorTable} order by bookmark desc limit 8`;
        try { 
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },

    showDetail: async (bookstoreIdx) => {
        const query = `SELECT * FROM ${bookstorTable} WHERE bookstoreIdx=${bookstoreIdx}`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('showDetail ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('showDetail ERROR : ', err);
            throw err;
        }
    },
}

module.exports = bookstore;