const url="mongodb://localhost:27017/mongoassign1"

const mongoose=require('mongoose')

mongoose.connect(url,function(err,responce){
	if(err) throw(err)
	if(responce){				 
		console.log('**************************')			
	}else{
		console.log("Data not able t get")
	}
})