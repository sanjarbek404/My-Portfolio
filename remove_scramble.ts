import fs from 'fs';

let content = fs.readFileSync('src/pages/Portfolio.tsx', 'utf8');

// Replace <TextScramble text="Something" /> with Something
content = content.replace(/<TextScramble\s+text=\{([^}]+)\}\s*\/>/g, '{$1}');
content = content.replace(/<TextScramble\s+text="([^"]+)"\s*\/>/g, '$1');

// Remove TextScramble component definition
content = content.replace(/const TextScramble = \(\{ text, className \}: \{ text: string, className\?: string \}\) => \{[\s\S]*?return \([\s\S]*?\);\n\};\n/g, '');

fs.writeFileSync('src/pages/Portfolio.tsx', content);
