import { renderToString } from 'react-dom/server';
import React from 'react';

const el = React.createElement('div', { style: { '--mobile-font-size': '24px', color: 'red' } }, 'Hello');
console.log(renderToString(el));
