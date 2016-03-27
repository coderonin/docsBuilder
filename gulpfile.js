var gulp = require("gulp"),
	docs = require("./index.js");

gulp.task("default",function(){
	docs("./test/**/**.txt", {dest: "./docs/" } );
});