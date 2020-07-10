const pool = require('../modules/pool');
const bookstoreTable = 'bookstore';
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
        const query = `select * from ${bookstoreTable}, ${imagesTable} where ${bookstoreTable}.bookstoreIdx = ${bookstoreIdx} and ${imagesTable}.bookstoreIdx = ${bookstoreIdx}`;
        try { 
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },
    showLocation: async (sectionIdx) => {
        const query1 = `SELECT b.bookstoreIdx, b.profile, b.bookstoreName, b.location FROM ${bookstoreTable} b WHERE b.sectionIdx = ${sectionIdx}`;
        try {
            const result = await pool.queryParam(query1);
            return result;
        } catch (err) {
            console.log('showLocation ERROR : ', err);
            throw err;
        }
    },
    updateBookmark: async (userIdx, bookstoreIdx) => {
        const selectQuery = `SELECT * FROM ${bookmarksTable} WHERE userIdx = '${userIdx}' AND bookStoreIdx = '${bookstoreIdx}';`;
        // 존재하면 delete, 존재 x면 update
        const fields = 'userIdx, bookstoreIdx';
        const questions = '?, ?';
        const values = [userIdx, bookstoreIdx];
        try {
            // INSERT INTO 테이블명 (COLUMN_LIST) VALUES (COLUMN_LIST에 넣을 VALUE_LIST);
            const updateQuery = `INSERT INTO ${bookmarksTable} (${fields}) VALUES (${questions});`
            const deleteQuery = `DELETE FROM ${bookmarksTable} WHERE userIdx = '${userIdx}' AND bookstoreIdx = '${bookstoreIdx}';`;
            let result = await pool.queryParam(selectQuery);
            if (result.length === 0) {
                result = await pool.queryParamArr(updateQuery, values);
                // const insertId = result.insertId;
                return 1;
            } else {
                await pool.queryParam(deleteQuery);
                // result = await pool.queryParam(selectQuery);
                return 0;
            }
        } catch (err) {
            console.log('update bookmarks ERROR : ', err);
            throw err;
        }
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
    showInterest: async (userIdx) => {
        const query = `SELECT A.bookstoreIdx, A.bookstoreName, A.profile, A.hashtag1, A.hashtag2, A.hashtag3 FROM ${bookstoreTable} A, ${bookmarksTable} B WHERE B.userIdx=${userIdx} and A.bookstoreIdx=B.bookstoreIdx`;
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