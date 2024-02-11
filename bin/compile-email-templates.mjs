import fs from 'fs/promises';
import mjml2html from 'mjml';
import { join } from 'path';

console.info('📂 Compiling email templates...');

const files = await fs.readdir('./emails');
const mjmlFiles = files.filter((file) => file.endsWith('.mjml'));

// Compile all MJML files in the `emails` directory to HTML
for (const file of mjmlFiles) {
  const mjml = await fs.readFile(join('emails', file), 'utf-8');
  const { html } = mjml2html(mjml);
  await fs.writeFile(join('emails', file.replace('.mjml', '.html')), html);
}

console.info('✅️ All done!');