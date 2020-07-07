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
        const query=`select bookstoreIdx from ${table4} where userIdx=1`;
        try{
            const result = await pool.queryParam(query);
            var resList=[];
            for(var i=0;i<result.length;i++){
                resList[i]=result[i].bookstoreIdx;
            }
            var res=[];
            for(var i=0;i<resList.length;i++){
                const query2=`select ${table}.bookstoreIdx, ${table}.bookstoreName, ${table}.profile, ${table2}.hashtag from ${table}, ${table2} where ${table}.bookstoreIdx=${table2}.bookstoreIdx and ${table}.bookstoreIdx=${resList[i]}`;
                try{
                    const result2=await pool.queryParam(query2);
                    var hashtags='';
                    var hashtags=result2[0].hashtag+','+result2[1].hashtag+','+result2[2].hashtag;
                    res[i]={bookstoreIdx:result2[i].bookstoreIdx,bookstoreName:result2[i].bookstoreName, profile:result2[i].profile, hashtag:hashtags};
                }catch(err){
                    console.log('showInterst ERROR : ', err);
                    throw err;
                }
            }
            console.log(res);
            return res;
        } catch(err){
            console.log('showInterst ERROR : ', err);
            throw err;
        }
    },

}

module.exports = bookstore;