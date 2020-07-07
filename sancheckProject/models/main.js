const pool = require('../modules/pool');
const bookstoreTable = 'bookstore';
const hashtagTable = 'hashtag';
const imagesTable = 'images';
const bookmarksTable = 'bookmarks';
const userTable = 'user';

const bookstore = {
    showRecommendation: async () => {
        const fields = 'shortIntro, shortIntro2, bookstoreName, location, bookmark';
        // const questions = `?, ?, ?, ?, ?`;
        // const values = [id, name, password, salt, email];
        const query = `SELECT ${fields} FROM ${bookstoreTable} WHERE shortIntro IS NOT NULL ORDER BY bookmark DESC LIMIT 8;`;
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
    showLocation: async (sectionIdx) => {
        const query1 = `SELECT b.profile, b.bookstoreName, b.location, h.hashtag FROM ${bookstoreTable} b, ${hashtagTable} h 
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
        const query = `SELECT profile, nickname, email FROM ${userTable} WHERE userIdx = '${userIdx}';`;
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
        FROM ${bookstoreTable} A LEFT OUTER JOIN ${hashtagTable} B
        ON A.bookstoreIdx = B.bookstoreIdx
        LEFT OUTER JOIN ${bookmarksTable} C
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