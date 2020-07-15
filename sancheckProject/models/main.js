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
        where bs.bookstoreIdx = i.bookstoreIdx and bs.bookstoreIdx = ${bookstoreIdx} and u.userIdx = ${userIdx};`;

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
    checkInterest: async(userIdx, bookstoreIdx)=>{
        const query = `select * from ${bookmarksTable} where userIdx = ${userIdx} and bookstoreIdx=${bookstoreIdx}`;
        try{
            const result = await pool.queryParam(query);
            if(result.length === 0){
                return 0;//checked 안되어있음 -> 관심책방으로 등록해야
            }else{
                return 1;//checked 되어있음 -> 관심책방으로 선정되어 있음 -> 관심책방 해제해야.
            }
        }catch(err){
            console.log('checkInterest bookmarks ERROR : ', err);
            throw err;
        }
    },
    updateBookmark: async (userIdx, bookstoreIdx) => {
        const fields = 'userIdx, bookstoreIdx, checked';
        let query = `delete from ${bookmarksTable} where userIdx=${userIdx} and bookstoreIdx=${bookstoreIdx}`;//북마크 해제
        const result = await module.exports.checkInterest(userIdx, bookstoreIdx);
        let query2 = `update ${bookstoreTable} set bookmark=bookmark-1 where bookstoreIdx=${bookstoreIdx}`;//북마크 -1
        if(result === 0 ){
            query = `insert into ${bookmarksTable} (${fields}) values (${userIdx}, ${bookstoreIdx}, 1)`;//북마크 설정
            query2 = `update ${bookstoreTable} set bookmark=bookmark+1 where bookstoreIdx=${bookstoreIdx}`;
        }
        try{
            await pool.queryParam(query);
            await pool.queryParam(query2);
            if(result === 0){//result==0 이면 북마크 설정한 것. 
                return 1;
            }else{//result==1 이면 북마크 해제한 것.
                return 0;
            }
        }catch(err){
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
            console.log('show my page ERROR : ', err);
            throw err;
        }
    },
    showInterest: async (userIdx) => {
        let query = `SELECT A.bookstoreIdx, A.bookstoreName, A.profile, A.hashtag1, A.hashtag2, A.hashtag3, C.nickname, i.image1 FROM bookstore A, bookmarks B, user C, images i 
        WHERE B.userIdx=${userIdx} and A.bookstoreIdx=B.bookstoreIdx and B.userIdx = C.userIdx and A.bookstoreIdx = i.bookstoreIdx order by B.bookmarkIdx desc;`;
        try{
            let result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('showInterest ERROR : ', err);
            throw err;
        }
    },
    checkBookStore: async (bookstoreIdx) => {
        const query = `select bookstoreIdx from ${bookstoreTable} where bookstoreIdx = ${bookstoreIdx}`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('select profile ERROR : ',err);
            throw err;
        }
    },
    selectProfile: async(bookstoreIdx)=>{
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
        const query = `select bookstoreIdx, ${match} from ${bookstoreTable} where match (${match}) against('+${keyword}*' in boolean mode) order by bookmark desc;`
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
        const time = 'NOW()';
        let query = `insert into ${reviewTable} (${fields}) values (${userIdx}, ${bookstoreIdx}, '${content}', '${photo}', ${stars}, ${time})`;
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
        const query = `select reviewIdx, userIdx, bookstoreIdx, content, photo, stars, date_format(createdAt, '%Y년 %c월 %e일 %H:%i 작성') as created
                        from ${reviewTable} where userIdx = ${userIdx} order by createdAt DESC`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('showMyReview ERROR : ',err);
            throw err;
        }
    },
    showAllReview: async(bookstoreIdx)=>{
        const query = `select reviewIdx, userIdx, bookstoreIdx, content, photo, stars, date_format(createdAt, '%Y년 %c월 %e일 %H:%i 작성') as created 
                        from ${reviewTable} where bookstoreIdx = ${bookstoreIdx} order by createdAt DESC;`;
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
    updateReview: async(reviewIdx)=>{
        const query = `select * from ${reviewTable} where reviewIdx=${reviewIdx};`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('updateReview ERROR : ',err);
            throw err;
        }
    },
    storeUpdatedReview: async(reviewIdx, stars, content)=>{
        const query = `update ${reviewTable} set stars =${stars}, content = '${content}' where reviewIdx = ${reviewIdx}`;
        try{
            await pool.queryParam(query);
            return;
        }catch(err){
            console.log('storeUpdatedReview ERROR : ',err);
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