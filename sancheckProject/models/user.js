const pool=require('../modules/pool');
const table='bookstore';
const table2='images';
const user={
    updateProfile: async(bookstoreIdx, locations)=>{
        let query=`insert into ${table2} (bookstoreIdx, image1, image2, image3) values (${bookstoreIdx},'${locations[0]}','${locations[1]}','${locations[2]}')`;
        try{
            await pool.queryParam(query);
            query=`select * from ${table2} where bookstoreIdx=${bookstoreIdx}`;
            const result=await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('insert image ERR : ',err);
            throw err;
        }
    }
};

module.exports=user;