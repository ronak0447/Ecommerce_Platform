module.exports = thFunc =>(req,res,next)=>{

    Promise.resolve(thFunc(req,res,next)).catch(next)
}