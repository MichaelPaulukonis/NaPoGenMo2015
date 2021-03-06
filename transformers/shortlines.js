// based on my original c# code @https://github.com/MichaelPaulukonis/text-munger/blob/master/PseudoRandomTextGenerator/trunk/PseudoRandomTextGenerator/Transformation.cs
// thanks to Chris Pressey for his node pipeline code https://github.com/catseye/Dipple/blob/master/javascript/script1.node


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

var munge = function(data) {

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
      process.stdout.write(out.join(' '));
      out = [];
    }
  }
  process.stdout.write(out.join(' '));
};

var args = process.argv.slice(2);

process.stdin.resume();
process.stdin.setEncoding('utf-8');

var buffer = '';

process.stdin.on('data', function(data) {

  munge(data);

  // var lines = data.split('\n');

  // lines[0] = buffer + lines[0];
  // buffer = lines[lines.length - 1];

  // for (var i = 0; i < lines.length - 1; i++) {
  //   munge(lines[i]);
  // }
});

process.stdin.on('end', function() {
  munge(buffer);
});
