const pool = require('../modules/pool');
const table = 'bookstore';
const table2 = 'hashtag';
const table3 = 'images';
const table4 = 'bookmarks';

const bookstore = {
    showRecommendation: async () => {
        // const fields = 'id, name, password, salt, email';
        // const questions = `?, ?, ?, ?, ?`;
        // const values = [id, name, password, salt, email];
        const query = `SELECT bookstoreIdx, bookstoreName, location, shortIntro, shortIntro2, profile FROM ${table} ORDER BY bookmark DESC LIMIT 8`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },
    showInterest: async () => {
        const query=`SELECT A.bookstoreIdx, A.bookstoreName, A.profile, B.hashtag
        FROM ${table} A LEFT OUTER JOIN ${table2} B
        ON A.bookstoreIdx = B.bookstoreIdx
        LEFT OUTER JOIN ${table4} C
        ON B.bookstoreIdx = C.bookstoreIdx
        WHERE C.userIdx=1`;
        try{
            const result=await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('showInterest ERROR : ', err);
            throw err;
        }
    },

}

module.exports = bookstore;