const pool = require('../modules/pool');
const table = 'bookstore';
const table2 = 'hashtag';
const table3 = 'images';
const table4 = 'bookmarks';
const table5 = 'user';

const bookstore = {
    showRecommendation: async () => {
        const fields = 'shortIntro, shortIntro2, bookstoreName, location, bookmark';
        // const questions = `?, ?, ?, ?, ?`;
        // const values = [id, name, password, salt, email];
        const query = `SELECT ${fields} FROM ${table} WHERE shortIntro IS NOT NULL ORDER BY bookmark DESC LIMIT 8;`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },
    showLocation: async (sectionIdx) => {
        const query1 = `SELECT b.profile, b.bookstoreName, b.location, h.hashtag FROM ${table} b, ${table2} h 
                        WHERE b.sectionIdx = ${sectionIdx} AND b.bookstoreIdx = h.bookstoreIdx;`;
        try {
            const result = await pool.queryParam(query1);
            return result;
        } catch (err) {
            console.log('showLocation ERROR : ', err);
            throw err;
        }
    },
    updateBookmark: async (bookstoreIdx) => {
        const query = `SELECT * FROM ${table4} WHERE `
    },
    showMypage: async (userIdx) => {
        const query = `SELECT profile, nickname, email FROM ${table5} WHERE userIdx = '${userIdx}';`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showLocation ERROR : ', err);
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