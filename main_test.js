var fs = require("fs");

/*
var data = fs.readFileSync("./data/input.txt");

console.log("O conteúdo do ficheiro é:");
console.log(data.toString());
console.log("Ficheiro" + " input.txt" + " lido!");
    */

var data = fs.readFile("./data/input.txt", function(err, data){

    if(err){
        return console.log(err);
    }

    console.log(data.toString());
});

console.log("Leitura finalizada!");
console.log(__filename);
