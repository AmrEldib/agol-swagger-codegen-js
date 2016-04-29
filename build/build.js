var fs = require('fs');
var CodeGen = require('swagger-js-codegen').CodeGen;

var file = 'swagger.json';
var swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'));
var nodejsSourceCode = CodeGen.getNodeCode({ className: 'agol', swagger: swagger });

fs.writeFile('output/agol.js', nodejsSourceCode, {}, function () {
  console.log("done");
});
