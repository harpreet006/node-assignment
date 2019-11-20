const url="mongodb://localhost:27017/mongodb1"
const mongoose=require('mongoose')
mongoose.connect(url,{ useUnifiedTopology: true },function(err,responce){
	if(err) throw(err)
	if(responce){				 
		console.log('**************************')			
	}else{
		console.log("Data not able t get")
	}
})
module.exports=mongoose