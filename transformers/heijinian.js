// based on my original c# code @https://github.com/MichaelPaulukonis/text-munger/blob/master/PseudoRandomTextGenerator/trunk/PseudoRandomTextGenerator/Transformation.cs
// thanks to Chris Pressey for his node pipeline code https://github.com/catseye/Dipple/blob/master/javascript/script1.node

var config = {
  offset: 20,
  offsetVariance: 20,
  offsetProbability: 0.8
};

// return true or false
// 50-50 chance (unless override)
var coinflip = function(chance) {
  if (!chance) { chance = 0.5; }
  return (Math.random() < chance);
};

var munge = function(line) {

  var asciiA = 97;
  var asciiZ = 122;

  if (line.length > 0) {
    var firstLetter = line.trim().toLowerCase().charCodeAt(0);
    var offset = ((firstLetter >= asciiA && firstLetter <= asciiZ) ? firstLetter - asciiA : 0);

    var spaces = Array(offset+1).join(' ');
    line = spaces + line;
  }

  process.stdout.write(line + '\n');

};

var args = process.argv.slice(2);

process.stdin.resume();
process.stdin.setEncoding('utf-8');


var buffer = '';

process.stdin.on('data', function(data) {
  var lines = data.split('\n');

  lines[0] = buffer + lines[0];
  buffer = lines[lines.length - 1];

  for (var i = 0; i < lines.length - 1; i++) {
    munge(lines[i]);
  }
});

process.stdin.on('end', function() {
  munge(buffer);
});
