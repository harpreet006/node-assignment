express= require('express')
	app=express();


	app.get('/',function(req,res){
		res.send('<form method="post"><input type=text placeholder="Enter the first name" name=fname><input type=text placeholder="Enter the username" name=username><input type=password name=password placeholder="Enter the password"></form>');
	})

app.listen(3002)	