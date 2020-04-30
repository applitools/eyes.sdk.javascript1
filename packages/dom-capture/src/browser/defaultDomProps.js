const styleProps = [
  'background-repeat',
  'background-origin',
  'background-position',
  'background-color',
  'background-image',
  'background-size',
  'border-width',
  'border-color',
  'border-style',
  'color',
  'display',
  'font-size',
  'font-weight',
  'line-height',
  'margin',
  'opacity',
  'overflow',
  'padding',
  'visibility',
];

const rectProps = ['width', 'height', 'top', 'left'];

const ignoredTagNames = ['HEAD', 'SCRIPT'];

module.exports = {
  styleProps,
  rectProps,
  ignoredTagNames,
};
