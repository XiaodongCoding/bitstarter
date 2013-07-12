#!/usr/bin/env node


var fs=require('fs');
var program=require('commander');
var cheerio=require('cheerio');
var HTMLFILE_DEFAULT="index.html";
var CHECKSFILE_DEFAULT="checks.json";

var assertFileExists=function(infile) {
	var instr=infile.toString();
	if(!fs.existsSync(instr)){
		console.log("%s does not exist. Exiting.",instr);
		process.exit(1);
	}
	return instr;
};

var cheerioHtmlFile=function(htmlfile){
	return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks=function(checksfile){
	return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile=function(htmlfile,checksfile) {
	//$=cheerioHtmlFile(htmlfile);
	$=cheerio.load(htmlfile);
	var checks=loadChecks(checksfile).sort();
	var out ={};
	for(var ii in checks){
		var present=$(checks[ii]).length>0;
		out[checks[ii]]=present;
	}
	return out;
};

var assertURL=function(url){
	return url;
}
var clone=function(fn){
	return fn.bind({});
}

var rest=require('restler');
var URL_DEFAULT="https://www.google.com";
if(require.main==module){
	program
		.option('-c, --checks <check_file>', 'Path to checks.json',clone(assertFileExists),CHECKSFILE_DEFAULT)
		.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
		.option('-u, --url <url>', 'url of the website',clone(assertURL),URL_DEFAULT)
		.parse(process.argv);
	var res;
	var URL=program.url;
	//console.log(URL.toString());
        var sys=require('util'); 
	rest.get(URL.toString()).on('complete',function(res,response) {
			var checkJson=checkHtmlFile(res,program.checks);
			var outJson=JSON.stringify(checkJson,null,4);
			console.log(outJson);
	
		//console.log(res);
	});
	//console.log(res);
	//console.log(program.checks);
	//var checkJson=checkHtmlFile(program.file,program.checks);
} else {
	exports.checkHtmlFile=checkHtmlFile;
}






