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
    showDetail: async (userIdx, bookstoreIdx) => {
        const bookmarkQuery = `SELECT * FROM ${bookmarksTable} WHERE bookstoreIdx = ${bookstoreIdx} AND userIdx = ${userIdx};`;
        const query = `select bs.*, i.image1, i.image2, i.image3 from ${bookstoreTable} bs, ${imagesTable} i, ${userTable} u
        where bs.bookstoreIdx = i.bookstoreIdx and bs.bookstoreIdx = ${bookstoreIdx} and u.useridx = ${userIdx};`;

        try {
            const bookmarkResult = await pool.queryParam(bookmarkQuery);
            if (bookmarkResult.length === 0) {
                var checked = 0;
            } else checked = 1;
            const result = await pool.queryParam(query);
            result[0].checked = checked;
            return result;
        } catch (err) {
            console.log('showRecommendation ERROR : ', err);
            throw err;
        }
    },
    showLocation: async (userIdx, sectionIdx) => {
        const locationQuery = `SELECT bs.bookstoreIdx, bs.sectionIdx, bs.bookstoreName, bs.hashtag1, bs.hashtag2, bs.hashtag3, bs.profile, i.image1 FROM ${bookstoreTable} bs, ${imagesTable} i WHERE bs.sectionIdx = ${sectionIdx} AND bs.bookstoreIdx = i.bookstoreIdx;`;
        const countQuery = `select count(*) as cnt from ${bookstoreTable} where sectionIdx = ${sectionIdx};`;
        const bookmarkQuery = `SELECT * from ${bookstoreTable} bs, ${bookmarksTable} bm WHERE bs.bookstoreIdx = bm.bookstoreIdx and bm.userIdx = ${userIdx} and bs.sectionIdx = ${sectionIdx};`;
        var checked = 0;
        try {
            let locationResult = await pool.queryParam(locationQuery);
            for (var i in locationResult) {
                const countResult = await pool.queryParam(countQuery);
                var count = countResult[0].cnt;
                locationResult[i].count = count;

                let result = await pool.queryParam(bookmarkQuery);
                if (result.length === 0) {
                    checked = 0;
                    locationResult[i].checked = checked;
                }
                for (var c in result) {
                    if (result[c].bookstoreIdx === locationResult[i].bookstoreIdx) {
                        checked = 1;
                    } else {
                        checked = 0;
                    }
                    locationResult[i].checked = checked;
                }   
            }
            
            const countResult = await pool.queryParam(countQuery);
            var count = countResult[0].cnt;
            locationResult[0].count = count;
            return locationResult;
        } catch (err) {
            console.log('show location ERROR : ', err);
            throw err;
        }
    },
    updateBookmark: async (userIdx, bookstoreIdx) => {
        const selectQuery = `SELECT * FROM ${bookmarksTable} WHERE userIdx = '${userIdx}' AND bookStoreIdx = '${bookstoreIdx}';`;
        // 존재하면 delete, 존재 x면 update
        const fields = 'userIdx, bookstoreIdx, sectionIdx';
        const questions = '?, ?, ?';
        try {
            // INSERT INTO 테이블명 (COLUMN_LIST) VALUES (COLUMN_LIST에 넣을 VALUE_LIST);
            const updateQuery = `INSERT INTO ${bookmarksTable} (${fields}) VALUES (${questions});`
            const deleteQuery = `DELETE FROM ${bookmarksTable} WHERE userIdx = '${userIdx}' AND bookstoreIdx = '${bookstoreIdx}';`;
            // bookstore 테이블 업데이트 되게 수정
            let result = await pool.queryParam(selectQuery);
            if (result.length === 0) {
                const findSectionIDx = `SELECT sectionIdx FROM ${bookstoreTable} WHERE bookstoreIdx = ${bookstoreIdx};`;
                result = await pool.queryParam(findSectionIDx);
                var sectionIdx = result[0].sectionIdx;
                console.log('sectionIdx: ',sectionIdx);
                const values = [userIdx, bookstoreIdx, sectionIdx];
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
        let query = `SELECT A.bookstoreIdx, A.bookstoreName, A.profile, A.hashtag1, A.hashtag2, A.hashtag3, C.nickname, i.image1 FROM ${bookstoreTable} A, ${bookmarksTable} B, ${userTable} C, ${imagesTable} i 
                        WHERE B.userIdx=${userIdx} and A.bookstoreIdx=B.bookstoreIdx and B.userIdx = C.userIdx and A.bookstoreIdx = i.bookstoreIdx;`;
        try{
            let result = await pool.queryParam(query);
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
        const query = `select bookstoreIdx, ${match} from ${bookstoreTable} 
                        where match (${match}) against('+${keyword}*' in boolean mode) order by bookmark desc;`
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
    },
    selectNickname: async (userIdx) => {
        let query = `SELECT * FROM ${userTable} WHERE userIdx = ${userIdx};`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('search by keyword ERROR : ', err);
            throw err;
        }
    },
    writeReview: async(userIdx, bookstoreIdx, content, photo, stars)=>{
        const fields = 'userIdx, bookstoreIdx, content, photo, stars, createdAt';
        let query = `insert into ${reviewTable} (${fields}) values (${userIdx}, ${bookstoreIdx}, '${content}', '${photo}', ${stars}, NOW())`;
        // NOW() 값 변경하기
        try{
            const result = await pool.queryParam(query);
            return result.insertId;
        }catch(err){
            console.log('writeReview ERROR : ',err);
            throw err;
        }
    },
    showMyReview: async(userIdx)=>{
        const query = `select * from ${reviewTable} where userIdx = ${userIdx} order by createdAt DESC`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('showMyReview ERROR : ',err);
            throw err;
        }
    },
    showAllReview: async(bookstoreIdx)=>{
        const query = `select * from ${reviewTable} where bookstoreIdx = ${bookstoreIdx} order by createdAt DESC`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('showAllReview ERROR : ',err);
            throw err;
        }
    },
    deleteReview: async(reviewIdx)=>{
        const query = `delete from ${reviewTable} where reviewIdx=${reviewIdx}`;
        try{
            await pool.queryParam(query);
            return 1;
        }catch(err){
            console.log('deleteReview ERROR : ',err);
            throw err;
        }
    },
    updateReview: async(reviewIdx, stars, content)=>{
        const query = `update ${reviewTable} set stars =${stars}, content = '${content}' where reviewIdx = ${reviewIdx}`;
        try{
            await pool.queryParam(query);
            return 1;
        }catch(err){
            console.log('updateReview ERROR : ',err);
            throw err;
        }
    },
    updateReviewPhoto: async(bookstoreIdx, reviewPhoto) => {
    let query = `UPDATE ${reviewTable} SET photo = '${reviewPhoto}' WHERE bookstoreIdx = ${bookstoreIdx};`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('update review photo ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('update review photo ERROR : ', err);
            throw err;
        }
    }
}

module.exports = bookstore;