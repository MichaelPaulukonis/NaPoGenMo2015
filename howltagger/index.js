// this was just a test
// require('child_process').fork('hello.js');

var Spew = require('./lib/tagspewer');
var lexicon = require('./howl.js');
var spewer = new Spew(lexicon);

var senttags = require('./tagged.slogans.js');
var _ = require('underscore');



var logger = function(msg) {
  if (config.log) console.log(msg);
};


var cleanup = function(text) {

  var clean = text;

  // removes spaces before punctuation
  clean = clean.replace(/\s+([.,;!])/g, '$1');
  clean = clean.replace(/\s+'\s+/g, '\'');
  // capitalize first word (leave all other caps alone)
  clean = clean.charAt(0).toUpperCase() + clean.slice(1);

  return clean;

};


var howler = function() {

  var howled = [];
  var fs = require('fs');

  fs.readFile('howl.tmpl', 'utf8', function(err, data) {

    if (err) {
      return console.log(err);
    }

    var lines = data.trim().split('\n');

    lines.forEach(function(line) {

      if (line[0] === '#') {
        howled.push(line.slice(1));
        return;
      }

      var splits = line.split(':::');
      if (splits.length < 2) return;
      var tags = splits[0];
      // var originalSentence = splits[1];

      var spewed = spewer.spew(tags);
      spewed = cleanup(spewed);

      howled.push(spewed);

    });

  fs.writeFile('howled.txt', howled.join('\n'));

  });

};


howler();
