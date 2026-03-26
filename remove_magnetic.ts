import fs from 'fs';

let content = fs.readFileSync('src/pages/Portfolio.tsx', 'utf8');

// Remove MagneticButton component definition
content = content.replace(/const MagneticButton = \(\{ children, className, \.\.\.props \}: any\) => \{[\s\S]*?return \([\s\S]*?<\/div>\n  \);\n\};\n/g, '');

// Replace <MagneticButton> tags with nothing, just keep children
content = content.replace(/<MagneticButton[^>]*>/g, '');
content = content.replace(/<\/MagneticButton>/g, '');

fs.writeFileSync('src/pages/Portfolio.tsx', content);
