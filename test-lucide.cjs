const { createElement } = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { Palette } = require('lucide-react');

console.log(renderToStaticMarkup(createElement(Palette, { 'data-foo': 'bar' })));
