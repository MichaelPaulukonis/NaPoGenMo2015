// based on my original c# code @https://github.com/MichaelPaulukonis/text-munger/blob/master/PseudoRandomTextGenerator/trunk/PseudoRandomTextGenerator/Transformation.cs


var config = {
  offset: 10,
  offsetVariance: 10,
  offsetProbability: 0.3
};

// generates a random number up to max (INclusive) optionally, from min (inclusive)
// NOTE: common implements have max being exclusive; please note if adapting code
var random = function(max, min){
  min = min || 0;
  var num = Math.floor(Math.random() * (max+1 - min) + min);
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
    var lines = data.trim().split('\n');

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line.length > 0 && coinflip(config.offsetProbability)) {
        var variance = random(-config.offsetVariance, config.offsetVariance);
        // +1, since when you join a 1-length array, you don't get the join-character.
        var spaceCount = config.offset + variance + 1;
        var spaces = Array(spaceCount).join(' ');
        line = spaces + line;
      }
      out.push(line);
    }

    fs.writeFile(outputFile, out.join('\n'));

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

if(program.input) munge(program.input, program.output);
