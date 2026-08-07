import { DynamicBlockRenderer } from './src/components/PageBlocks';
console.log(typeof DynamicBlockRenderer);
const res = DynamicBlockRenderer({ blocks: [{ type: 'hero' }] });
console.log(res);
