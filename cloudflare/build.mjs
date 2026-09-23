import { mkdir, rm, copyFile } from 'node:fs/promises';
const out = new URL('./dist/', import.meta.url);
await rm(out, {recursive:true, force:true});
await mkdir(out, {recursive:true});
for (const name of ['index.html', 'humanity-labs-logo.png']) await copyFile(new URL('../'+name, import.meta.url), new URL(name, out));
console.log('Built two unchanged public assets');
