import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const modelsDirectory = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'prisma', 'schema');
const generatedDirectory = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'prisma', '.generated');
const files = (await readdir(modelsDirectory))
  .filter((file) => file.endsWith('.prisma') && file !== 'contract.prisma')
  .sort();
const schemas = await Promise.all(
  files.map(async (file) => {
    const schema = await readFile(join(modelsDirectory, file), 'utf8');
    return schema.replace(/^\/\/ use prisma-next\s*/m, '');
  }),
);

await mkdir(generatedDirectory, { recursive: true });
await writeFile(join(generatedDirectory, 'contract.prisma'), `// use prisma-next\n\n${schemas.join('\n\n')}`, 'utf8');
