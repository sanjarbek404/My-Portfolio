import fs from 'fs';

const filePath = 'src/pages/Portfolio.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/#FF4E00/g, '#3B82F6');
content = content.replace(/orange-400/g, 'cyan-400');
content = content.replace(/orange-500/g, 'cyan-500');

fs.writeFileSync(filePath, content);
console.log('Colors replaced successfully!');
