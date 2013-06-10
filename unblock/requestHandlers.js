var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");


function start(response,postData) {

	console.log("Request handler 'start' was called.");
	
	var body = '<html>'+
		'<head>' +
		'<meta http-equiv="Content-Type" content="text/html; '+
		'charset=UTF-8" /> '+
		'</head>' +
		'<body>' +
		'<form action="/upload" enctype ="multipart/form-data" ' +
		'method ="post">'+
		'<input type="file" name="upload">' +
		'<input type="submit" value="Upload file" />'+
		'</form>' +
		'</body>'+
		'</html>';
	var body1 = '<html>'+
		'<head>' +
		'<meta http-equiv="Content-Type" content="text/html; '+
		'charset=UTF-8" /> '+
		'</head>' +
		'<body>' +
		'<form action="/upload" method ="post">'+
		'<textarea name="text" rows="20" cols="60"></textarea>'+
		'<input type="submit" value="Submit text" />'+
		'</form>' +
		'</body>'+
		'</html>';
	
	response.writeHead(200,{"Content-Type":"text/html"});
	response.write(body);
	response.end();
}

function exec(response) {


	console.log("Request handler 'exec' was called.");
	
	exec("find /", function (error,stdout,stderr){
		response.writeHead(200,{"Content-Type":"text/plain"});
		response.write(stdout);
		response.end();			
	});

}
function sleep() {
	console.log("Request handler 'sleep' was called.")

	function sleep(milliSeconds) {
		var startTime = new Date().getTime();
		while(new Date().getTime() < startTime+ milliSeconds);
	}

	sleep(10000);
	return "hello start";
}

function upload(response,request) {
	console.log("Request handler 'upload' was called.");
	
	var form = new formidable.IncomingForm();
	console.log("about to parse");

	form.parse(request, function (error,fields,files){
		console.log("parsing done");
		fs.renameSync(files.upload.path,"/tmp/test.jpg");
		response.writeHead(200,{"Content-Type":"text/html"});
		response.write("received image:<br/>");	
		response.write("<img src ='/show' />");
		response.end();
	});
}

function show(response) {
	console.log("request handler 'show' was called.");
	
	fs.readFile("/tmp/test.jpg","binary",function(error,file) {
		if(error){
			response.writeHead(500,{"Content-Type":"text/plain"});
			response.write(error+"\n");
			response.end();
		}else {
			response.writeHead(200,{"Content-Type":"image/jpg"});
			response.write(file,"binary");
			response.end();
		}
	});
}


exports.start = start;
exports.upload = upload;
exports.show = show;
