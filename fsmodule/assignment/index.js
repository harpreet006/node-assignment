/*FIRST THREE LINE PRINT*/
var fs= require('fs')
fs.readFile('test.txt','utf8',function(err,responce){
if(err) throw (err)
	if(responce){
		var count=0 
		var makeAry=[]
		var slashn=responce.split(/\r?\n/).forEach(function(data){
		 	if(count<=2){
		 		makeAry.push(data)
		 	}
		 	count++
		 })
		console.log(makeAry,"GET FIRST THREE LINES")
	}
})
/*FIRST THREE LINE PRINT*/

/*COUNT THE NUMBER OF ROW INTON THE FILE */

var fs= require('fs')
fs.readFile('test.txt','utf8',function(err,responce){
if(err) throw (err)
	if(responce){
		var getCount = responce.split(/\r?\n/);
		console.log(getCount.length,"FILE TOTAL COUNT")
	}
})

/*COUNT THE NUMBER OF ROW INTON THE FILE */

var fs= require('fs')
fs.readFile('test.txt','utf8',function(err,responce){
if(err) throw (err)
	if(responce){
		 let count=0
		var getCount = responce.split(' ').forEach(function(dara){
			if(dara=='the'){

				count++
			}
		});
		console.log(count,'COUNT NUMBER OF THE INTO THE readFile')
		// console.log(getCount.length,"FILE TOTAL COUNT")
	}
})

/*COUNT THE NUMNBER OF THE INTO THE FILE */


/*TAKE THE FILE AND COUNT THE NUMBER OF WORD INTO THE FILE  */

var fs= require('fs')
fs.readFile('test.txt','utf8',function(err,responce){
if(err) throw (err)
	if(responce){
		 let count=0
		var getCount = responce.split(' ').forEach(function(dara){
			 count++
		});
		console.log(count,'COUNT NUMBER OF THE WORD TO THE FILE')
	}
})

/*TAKE THE FILE AND COUNT THE NUMBER OF WORD INTO THE FILE  */