const pool = require('../modules/pool');
const bookstoreTable = 'bookstore';
const hashtagTable = 'hashtag';
const imagesTable = 'images';

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
        const query = `SELECT A.*, B.*, C.*
        FROM ${bookstoreTable} A LEFT OUTER JOIN ${hashtagTable} B
        ON A.bookstoreIdx = B.bookstoreIdx
        LEFT OUTER JOIN ${imagesTable} C
        ON B.bookstoreIdx = C.bookstoreIdx WHERE A.bookstoreIdx=${bookstoreIdx}`;

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