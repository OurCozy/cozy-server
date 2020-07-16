const pool = require('../modules/pool');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const bookstoreTable = 'bookstore';
const imagesTable = 'images';
const bookmarksTable = 'bookmarks';
const userTable = 'user';
const reviewTable = 'review';

const bookstore = {
    showRecommendation: async (userIdx) => {
        const query = `SELECT bs.bookstoreIdx, bs.profile, bs.shortIntro, bs.shortIntro2, bs.bookstoreName, bs.location, u.nickname FROM ${bookstoreTable} bs, ${userTable} u 
                        WHERE bs.profile != 'NULL' 
                        AND bs.shortIntro != 'NULL' 
                        AND userIdx = ${userIdx}
                        ORDER BY bs.bookmark DESC LIMIT 8;`;
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
        // location section별로
        const location = `SELECT bs.bookstoreIdx, bs.bookstoreName, bs.hashtag1, bs.hashtag2, bs.hashtag3, bs.profile, i.image1 from ${bookstoreTable} bs, ${imagesTable} i 
                        WHERE bs.sectionIdx = ${sectionIdx} 
                        AND bs.bookstoreIdx = i.bookstoreIdx;`;

        // checked된 책방만 seciton별로
        const query = `SELECT bs.bookstoreIdx, bs.bookstoreName, bs.hashtag1, bs.hashtag2, bs.hashtag3, bs.profile, i.image1 from bookstore bs, images i, bookmarks bm
        where bs.sectionIdx = ${sectionIdx} and bs.bookstoreIdx = i.bookstoreIdx and bs.bookstoreIdx = bm.bookstoreIdx and bm.userIdx = ${userIdx};`;

        // const query = `select bs.bookstoreIdx, bs.bookstoreName, bs.hashtag1, bs.hashtag2, bs.hashtag3, bs.profile, i.image1, bm.checked from ${bookstoreTable} bs, ${imagesTable} i, ${bookmarksTable} bm
        // where bs.sectionIdx = ${sectionIdx} and bs.bookstoreIdx = i.bookstoreIdx and bs.bookstoreIdx = bm.bookstoreIdx;`;

        try {
            let locationResult = await pool.queryParam(location);
            // let bookmarkResult = await pool.queryParam(bookmark);
            let queryResult = await pool.queryParam(query);

            for (var a in locationResult) {
                var checked=0;
                for (var b in queryResult) {
                    if(locationResult[a].bookstoreIdx === queryResult[b].bookstoreIdx){
                        console.log('success');
                        checked = 1;
                        break;
                    }
                }
                locationResult[a].checked = checked;
                locationResult[a].count = locationResult.length;
            }
            
            return locationResult;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('show location ERROR : ', err.errno, err.code);
                throw err;
            }
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
        let query = `SELECT A.bookstoreIdx, A.bookstoreName, A.profile, A.hashtag1, A.hashtag2, A.hashtag3, C.nickname, i.image1 FROM ${bookstoreTable} A, ${bookmarksTable} B, ${userTable} C, ${imagesTable} i 
        WHERE B.userIdx = ${userIdx} and A.bookstoreIdx=B.bookstoreIdx and B.userIdx = C.userIdx and A.bookstoreIdx = i.bookstoreIdx order by B.bookmarkIdx desc;`;
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
        //const match = 'bookstoreName, location, activity, shortIntro, shortIntro2, description, hashtag1, hashtag2, hashtag3';
        //const query = `select bookstoreIdx, ${match} from ${bookstoreTable} where match (${match}) against('+${keyword}*' in boolean mode) order by bookmark desc;`
        const query = `select bs.*, i.image1 from ${bookstoreTable} bs, ${imagesTable} i 
                        where bs.bookstoreIdx = i.bookstoreIdx 
                        and (binary bs.bookstoreName like "%${keyword}%" 
                        or binary location like "%${keyword}%" 
                        or binary activity like "%${keyword}%" 
                        or binary shortIntro like "%${keyword}%" 
                        or binary shortIntro2 like "%${keyword}%" 
                        or binary description like "%${keyword}%" 
                        or binary hashtag1 like "%${keyword}%" 
                        or binary hashtag2 like "%${keyword}%" 
                        or binary hashtag3 like "%${keyword}%") 
                        order by bookmark desc`;
        console.log('search query : ', query);
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
        // "2020년 7월 4일 17:00 작성"
        const date = moment().format('YYYY년 M월 D일 HH:mm 작성');
        console.log(date);
        let query = `insert into ${reviewTable} (${fields}) values (${userIdx}, ${bookstoreIdx}, '${content}', '${photo}', ${stars}, '${date}')`;
        try{
            let result = await pool.queryParam(query);
            query = `SELECT r.*, u.nickname, u.profile FROM ${reviewTable} r, ${userTable} u WHERE r.reviewIdx = ${result.insertId} AND r.userIdx = ${userIdx};`;
            result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('writeReview ERROR : ',err);
            throw err;
        }
    },
    showMyReview: async(userIdx) => {
        const query = `SELECT r.*, u.nickname FROM ${reviewTable} r, ${userTable} u WHERE r.userIdx = u.userIdx AND r.userIdx = ${userIdx} ORDER BY reviewIdx DESC`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch (err) {
            if (err.errno == 1062) {
                console.log('show my review ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('show my review ERROR : ', err);
            throw err;
        }
    },
    showReviews: async(userIdx, bookstoreIdx)=>{
        const query = `SELECT r.*, u.nickname, u.profile FROM ${reviewTable} r, ${userTable} u 
                        WHERE r.bookstoreIdx = ${bookstoreIdx} 
                        AND u.userIdx = ${userIdx}
                        ORDER BY r.reviewIdx DESC;`;
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
    storeUpdatedReview: async(reviewIdx, stars, content, reviewPhoto)=>{
        const date = moment().format('YYYY년 M월 D일 HH:mm 수정');
        let query = `update ${reviewTable} set stars =${stars}, content = '${content}', photo = '${reviewPhoto}', createdAt = '${date}' where reviewIdx = ${reviewIdx}`;
        try{
            await pool.queryParam(query);
            query = `SELECT * FROM ${reviewTable} WHERE reviewIdx = ${reviewIdx};`; 
            const result = await pool.queryParam(query);
            return result;
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