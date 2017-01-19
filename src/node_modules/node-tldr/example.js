var summary = require('./index.js');

summary.summarize('http://www.dailydot.com/geek/wolfenstein-the-new-order-nazi-brutality/', function(result, failure) {
	if (failure) {
		console.log("An error occured! " + result.error);
	}

	console.log("#####################");
	console.log("#### " + result.title);
	console.log("#### Words: " + result.words);
	console.log("#### Compressed by: " + result.compressFactor);
	console.log("#####################");
	console.log(result.summary.join("\n"));
});
