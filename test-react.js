let pageData = {
  blocks: [
    { type: 'hero', items: [{ title: 'A' }] },
    { type: 'education_levels', items: [{ title: 'Anaokulu' }] }
  ]
};

let selectedBlockIndex = 1;

const setPageData = (newData) => {
  pageData = newData;
};

const handleBlockChange = (updatedBlock) => {
  const newBlocks = [...(pageData.blocks || [])];
  newBlocks[selectedBlockIndex] = updatedBlock;
  setPageData({ ...pageData, blocks: newBlocks });
};

const BlockFormEditor_handleChange = (block, key, value) => {
  handleBlockChange({ ...block, [key]: value });
};

const BlockFormEditor_handleArrayChange = (block, key, index, itemKey, value) => {
  let newArray = [...(block[key] || [])];
  if (!newArray[index]) newArray[index] = {};
  newArray[index] = { ...newArray[index], [itemKey]: value };
  BlockFormEditor_handleChange(block, key, newArray);
};

// Simulate user typing
let currentBlock = pageData.blocks[selectedBlockIndex];
BlockFormEditor_handleArrayChange(currentBlock, 'items', 0, 'title', 'Anaokulu 2');

console.log(JSON.stringify(pageData, null, 2));
