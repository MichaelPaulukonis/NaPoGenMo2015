// based on my original c# code @https://github.com/MichaelPaulukonis/text-munger/blob/master/PseudoRandomTextGenerator/trunk/PseudoRandomTextGenerator/Transformation.cs


var probabilities = {
  newline: 0.2,
  multiple: 0.3,
  multipleRange: 3 // yeah, this isn't a probability
};

// generates a random number
var random = function(limit){
  var num = Math.floor(Math.random() * limit);
  return num;
};

// return true or false
// 50-50 chance (unless override)
var coinflip = function(chance) {
  if (!chance) { chance = 0.5; }
  return (Math.random() < chance);
};

var munge = function(inputFile, outputFile) {

  outputFile = outputFile || 'output.txt';
  var fs = require('fs');

  fs.readFile(inputFile, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }

    var out = [];
    // var words = lexer.lex(data); // not the tokenization I want
    var words = data.split(/\s+/);

    for (var word in words) {
      out.push(words[word]);

      if (coinflip(probabilities.newline)) {
        // start at 2, since when you join a 1-length array, you don't get the join-character.
        var lines = 2;
        if (coinflip(probabilities.multiple)) {
          lines += random(probabilities.multipleRange);
        }
        out.push(Array(lines).join('\n'));
      }
    }

    fs.writeFile(outputFile, out.join(' '));

  });


};


var program = require('commander');
program
  .version('0.0.1')
// .option('-t, --templatize', 'pos-tag input file into a template')
// .option('-j, --jsonitize', 'create sorted pos-tag file from text')
  .option('-i, --input [file]', 'input [file]', 'input.txt')
  .option('-o, --output [file]', 'output file', 'out.json')
  .parse(process.argv);

if(program.input) munge(program.input);
