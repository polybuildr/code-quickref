const marked = require('marked');
const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
    console.log('usage: ' + path.basename(__filename) + ' FILE');
    process.exit(1);
}

var inFile = process.argv[2];

var content = fs.readFileSync(inFile).toString();

marked.setOptions({
    gfm: true,
});

var contentHTML = marked(content);
var templateContent = fs.readFileSync(__dirname + '/pages/template.html').toString();

var output = templateContent
    .replace('{{TITLE}}', contentHTML.match(/<h1[^>]*>([^<]*)<\/h1>/i)[1])
    .replace('{{CONTENT}}', contentHTML);

fs.writeFileSync(__dirname + '/public/' + path.basename(inFile).replace('md', 'html'), output);
