

const list=({sonarproject},{config})=> async (req,res,next)=>{
        try{
            const projects=await sonarproject.find({});
            res.send({projects});
           
        }
        catch(err){
            next(err);
        }
    }



module.exports={list}
