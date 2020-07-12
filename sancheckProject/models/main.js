const pool = require('../modules/pool');
const bookstoreTable = 'bookstore';
const imagesTable = 'images';
const bookmarksTable = 'bookmarks';
const userTable = 'user';
const reviewTable = 'review';

const bookstore = {
    showRecommendation: async () => {
        const fields = 'bookstoreIdx, profile, shortIntro, shortIntro2, bookstoreName, location';
        // const questions = `?, ?, ?, ?, ?`;
        // const values = [id, name, password, salt, email];
        const query = `SELECT ${fields} FROM ${bookstoreTable} WHERE profile != 'NULL' AND shortIntro != 'NULL' ORDER BY bookmark DESC LIMIT 8;`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },
    showDetail: async (bookstoreIdx) => {
        const query = `SELECT A.*, C.image1, image2, image3
        FROM ${bookstoreTable} A
        LEFT OUTER JOIN ${imagesTable} C
        ON A.bookstoreIdx = C.bookstoreIdx WHERE A.bookstoreIdx=${bookstoreIdx} `;

        try { 
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },
    showLocation: async (sectionIdx) => {
        const query1 = `SELECT sectionIdx, bookstoreIdx, profile, bookstoreName, location, hashtag1, hashtag2, hashtag3 FROM ${bookstoreTable}
                        WHERE sectionIdx = ${sectionIdx};`;
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
            // bookstore 테이블 업데이트 되게 수정
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
        const query = `SELECT A.bookstoreIdx, A.bookstoreName, A.profile, A.hashtag1, A.hashtag2, A.hashtag3, C.nickname FROM ${bookstoreTable} A, ${bookmarksTable} B, ${userTable} C 
                        WHERE B.userIdx=${userIdx} and A.bookstoreIdx=B.bookstoreIdx and B.userIdx = C.userIdx;`;
        try{
            const result=await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('showInterest ERROR : ', err);
            throw err;
        }
    },
    selectProfile: async (bookstoreIdx) => {
        const query = `SELECT b.bookstoreIdx, b.bookstoreName, b.profile, i.image1 FROM ${bookstoreTable} b, ${imagesTable} i
                         WHERE b.bookstoreIdx = ${bookstoreIdx} AND b.bookstoreIdx = i.bookstoreIdx;`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('select profile ERROR : ', err);
            throw err;
        }
    },
    searchByKeyword: async (keyword) => {
        const match = 'bookstoreName, location, activity, shortIntro, shortIntro2, description, hashtag1, hashtag2, hashtag3';
        const query = `select bookstoreIdx, bookstoreName, location, activity, shortIntro, shortIntro2, description, hashtag1, hashtag2, hashtag3
                         from ${bookstoreTable} where match (${match}) against('+${keyword}*' in boolean mode) order by bookmark desc;`
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('search by keyword ERROR : ', err);
            throw err;
        }                
    },
    updateProfile: async (bookstoreIdx, profile) => {
        let query = `UPDATE ${bookstoreTable} SET profile = '${profile}' WHERE bookstoreIdx = ${bookstoreIdx}`;
        try {
            await pool.queryParam(query);
            query = `SELECT bookstoreIdx, bookstoreName, profile FROM ${bookstoreTable} WHERE bookstoreIdx = ${bookstoreIdx}`;
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('update profile ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('update profile ERROR : ', err);
            throw err;
        }
    }
}

module.exports = bookstore;