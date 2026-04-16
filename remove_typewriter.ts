import fs from 'fs';

let content = fs.readFileSync('src/pages/Portfolio.tsx', 'utf8');

// Replace Typewriter with simple text
content = content.replace(/<Typewriter\s+text="([^"]+)"\s+delay=\{\d+\}\s*\/>/g, '$1');

// Remove Typewriter component definition
content = content.replace(/const Typewriter = \(\{ text, delay = 50, className \}: \{ text: string, delay\?: number, className\?: string \}\) => \{[\s\S]*?return <span className=\{className\}>\{currentText\}<\/span>;\n\};\n/g, '');

fs.writeFileSync('src/pages/Portfolio.tsx', content);
