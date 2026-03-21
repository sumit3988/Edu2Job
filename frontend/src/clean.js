const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'index.css');
const content = fs.readFileSync(cssPath, 'utf8');
const lines = content.split('\n');

const cleanedLines = [];
let i = 0;
while (i < lines.length) {
  // Line numbers here are 1-indexed for reference, so index i corresponds to line i+1.
  const lineNum = i + 1;

  // Sidebar (441-558)
  if (lineNum >= 441 && lineNum <= 558) {
    i++; continue;
  }
  // Stat cards through explanation card (599-985)
  // This covers STAT CARDS, PREDICTION, PROFILE, SKILL GAP, CHART, EXPLANATION
  if (lineNum >= 599 && lineNum <= 985) {
    i++; continue;
  }

  cleanedLines.push(lines[i]);
  i++;
}

fs.writeFileSync(cssPath, cleanedLines.join('\n'), 'utf8');
console.log('Cleaned index.css successfully.');
