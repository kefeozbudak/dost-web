import React from 'react';
import { renderToString } from 'react-dom/server';
import { DynamicBlockRenderer } from './src/components/PageBlocks';
import { defaultHomePageData } from './src/lib/defaultData';
import { MemoryRouter } from 'react-router-dom';

const blocks = defaultHomePageData.filter(b => b.type !== 'header' && b.type !== 'footer');

try {
  const html = renderToString(
    <MemoryRouter initialEntries={['/']}>
      <DynamicBlockRenderer blocks={blocks} />
    </MemoryRouter>
  );
  console.log('HTML Length:', html.length);
  if (html.length < 1000) console.log(html);
} catch (e) {
  console.error('ERROR RENDERING:', e);
}
