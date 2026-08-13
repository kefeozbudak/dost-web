import React from 'react';
import { renderToString } from 'react-dom/server';

const el = React.createElement('div', { style: { '--desktop-text-align': 'center' } }, 'Hello');
console.log(renderToString(el));
