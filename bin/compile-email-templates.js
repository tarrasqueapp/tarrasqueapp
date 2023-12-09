const { join } = require('path');
const fs = require('fs/promises');
const mjml2html = require('mjml');

/**
 * Compiles all MJML files in the `emails` directory to HTML
 */
async function main() {
  console.info('📂 Compiling email templates...');

  const files = await fs.readdir('./emails');
  const mjmlFiles = files.filter((file) => file.endsWith('.mjml'));

  for (const file of mjmlFiles) {
    const mjml = await fs.readFile(join('emails', file), 'utf-8');
    const { html } = mjml2html(mjml);
    await fs.writeFile(join('emails', file.replace('.mjml', '.html')), html);
  }

  console.info('✅️ All done!');
}
main();
