const shorthandProperties = new Map([
  [
    'background',
    new Set([
      'background-color',
      'background-position',
      'background-position-x',
      'background-position-y',
      'background-size',
      'background-repeat',
      'background-repeat-x',
      'background-repeat-y',
      'background-clip',
      'background-origin',
      'background-attachment',
      'background-image',
    ]),
  ],
  ['background-position', new Set(['background-position-x', 'background-position-y'])],
  ['background-repeat', new Set(['background-repeat-x', 'background-repeat-y'])],
  [
    'font',
    new Set([
      'font-style',
      'font-variant-caps',
      'font-weight',
      'font-stretch',
      'font-size',
      'line-height',
      'font-family',
      'font-size-adjust',
      'font-kerning',
      'font-optical-sizing',
      'font-variant-alternates',
      'font-variant-east-asian',
      'font-variant-ligatures',
      'font-variant-numeric',
      'font-variant-position',
      'font-language-override',
      'font-feature-settings',
      'font-variation-settings',
    ]),
  ],
  [
    'font-variant',
    new Set([
      'font-variant-caps',
      'font-variant-numeric',
      'font-variant-alternates',
      'font-variant-ligatures',
      'font-variant-east-asian',
    ]),
  ],
  ['outline', new Set(['outline-width', 'outline-style', 'outline-color'])],
  [
    'border',
    new Set([
      'border-top-width',
      'border-right-width',
      'border-bottom-width',
      'border-left-width',
      'border-top-style',
      'border-right-style',
      'border-bottom-style',
      'border-left-style',
      'border-top-color',
      'border-right-color',
      'border-bottom-color',
      'border-left-color',
      'border-image-source',
      'border-image-slice',
      'border-image-width',
      'border-image-outset',
      'border-image-repeat',
    ]),
  ],
  [
    'border-width',
    new Set(['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width']),
  ],
  [
    'border-style',
    new Set(['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style']),
  ],
  [
    'border-color',
    new Set(['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color']),
  ],
  [
    'border-block',
    new Set([
      'border-block-start-width',
      'border-block-end-width',
      'border-block-start-style',
      'border-block-end-style',
      'border-block-start-color',
      'border-block-end-color',
    ]),
  ],
  [
    'border-block-start',
    new Set(['border-block-start-width', 'border-block-start-style', 'border-block-start-color']),
  ],
  [
    'border-block-end',
    new Set(['border-block-end-width', 'border-block-end-style', 'border-block-end-color']),
  ],
  [
    'border-inline',
    new Set([
      'border-inline-start-width',
      'border-inline-end-width',
      'border-inline-start-style',
      'border-inline-end-style',
      'border-inline-start-color',
      'border-inline-end-color',
    ]),
  ],
  [
    'border-inline-start',
    new Set([
      'border-inline-start-width',
      'border-inline-start-style',
      'border-inline-start-color',
    ]),
  ],
  [
    'border-inline-end',
    new Set(['border-inline-end-width', 'border-inline-end-style', 'border-inline-end-color']),
  ],
  [
    'border-image',
    new Set([
      'border-image-source',
      'border-image-slice',
      'border-image-width',
      'border-image-outset',
      'border-image-repeat',
    ]),
  ],
  [
    'border-radius',
    new Set([
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
    ]),
  ],
  ['padding', new Set(['padding-top', 'padding-right', 'padding-bottom', 'padding-left'])],
  ['padding-block', new Set(['padding-block-start', 'padding-block-end'])],
  ['padding-inline', new Set(['padding-inline-start', 'padding-inline-end'])],
  ['margin', new Set(['margin-top', 'margin-right', 'margin-bottom', 'margin-left'])],
  ['margin-block', new Set(['margin-block-start', 'margin-block-end'])],
  ['margin-inline', new Set(['margin-inline-start', 'margin-inline-end'])],
  ['inset', new Set(['top', 'right', 'bottom', 'left'])],
  ['inset-block', new Set(['inset-block-start', 'inset-block-end'])],
  ['inset-inline', new Set(['inset-inline-start', 'inset-inline-end'])],
  ['flex', new Set(['flex-grow', 'flex-shrink', 'flex-basis'])],
  ['flex-flow', new Set(['flex-direction', 'flex-wrap'])],
  ['gap', new Set(['row-gap', 'column-gap'])],
  [
    'transition',
    new Set([
      'transition-duration',
      'transition-timing-function',
      'transition-delay',
      'transition-property',
    ]),
  ],
  [
    'grid',
    new Set([
      'grid-template-rows',
      'grid-template-columns',
      'grid-template-areas',
      'grid-auto-flow',
      'grid-auto-columns',
      'grid-auto-rows',
    ]),
  ],
  [
    'grid-template',
    new Set(['grid-template-rows', 'grid-template-columns', 'grid-template-areas']),
  ],
  ['grid-row', new Set(['grid-row-start', 'grid-row-end'])],
  ['grid-column', new Set(['grid-column-start', 'grid-column-end'])],
  ['grid-gap', new Set(['grid-row-gap', 'grid-column-gap'])],
  ['place-content', new Set(['align-content', 'justify-content'])],
  ['place-items', new Set(['align-items', 'justify-items'])],
  ['place-self', new Set(['align-self', 'justify-self'])],
  ['columns', new Set(['column-width', 'column-count'])],
  ['column-rule', new Set(['column-rule-width', 'column-rule-style', 'column-rule-color'])],
  ['list-style', new Set(['list-style-type', 'list-style-position', 'list-style-image'])],
  [
    'offset',
    new Set([
      'offset-position',
      'offset-path',
      'offset-distance',
      'offset-rotate',
      'offset-anchor',
    ]),
  ],
  ['overflow', new Set(['overflow-x', 'overflow-y'])],
  ['overscroll-behavior', new Set(['overscroll-behavior-x', 'overscroll-behavior-y'])],
  [
    'scroll-margin',
    new Set([
      'scroll-margin-top',
      'scroll-margin-right',
      'scroll-margin-bottom',
      'scroll-margin-left',
    ]),
  ],
  [
    'scroll-padding',
    new Set([
      'scroll-padding-top',
      'scroll-padding-right',
      'scroll-padding-bottom',
      'scroll-padding-left',
    ]),
  ],
  [
    'text-decaration',
    new Set(['text-decoration-line', 'text-decoration-style', 'text-decoration-color']),
  ],
  ['text-stroke', new Set(['text-stroke-color', 'text-stroke-width'])],
  [
    'animation',
    new Set([
      'animation-duration',
      'animation-timing-function',
      'animation-delay',
      'animation-iteration-count',
      'animation-direction',
      'animation-fill-mode',
      'animation-play-state',
      'animation-name',
    ]),
  ],
  [
    'mask',
    new Set([
      'mask-image',
      'mask-mode',
      'mask-repeat-x',
      'mask-repeat-y',
      'mask-position-x',
      'mask-position-y',
      'mask-clip',
      'mask-origin',
      'mask-size',
      'mask-composite',
    ]),
  ],
  ['mask-repeat', new Set(['mask-repeat-x', 'mask-repeat-y'])],
  ['mask-position', new Set(['mask-position-x', 'mask-position-y'])],
  ['perspective-origin', new Set(['perspective-origin-x', 'perspective-origin-y'])],
  ['transform-origin', new Set(['transform-origin-x', 'transform-origin-y', 'transform-origin-z'])],
]);

const mozShorthandProperties = new Map([
  withVendor('animation', 'moz'),
  withVendor('border-image', 'moz'),
  withVendor('mask', 'moz'),
  withVendor('transition', 'moz'),
  withVendor('columns', 'moz'),
  withVendor('text-stroke', 'moz'),
  withVendor('column-rule', 'moz'),
  [
    '-moz-border-end',
    new Set(['-moz-border-end-color', '-moz-border-end-style', '-moz-border-end-width']),
  ],
  [
    '-moz-border-start',
    new Set(['-moz-border-start-color', '-moz-border-start-style', '-moz-border-start-width']),
  ],
  [
    '-moz-outline-radius',
    new Set([
      '-moz-outline-radius-topleft',
      '-moz-outline-radius-topright',
      '-moz-outline-radius-bottomright',
      '-moz-outline-radius-bottomleft',
    ]),
  ],
]);

const webkitShorthandProperties = new Map([
  withVendor('animation', 'webkit'),
  withVendor('border-radius', 'webkit'),
  withVendor('column-rule', 'webkit'),
  withVendor('columns', 'webkit'),
  withVendor('flex', 'webkit'),
  withVendor('flex-flow', 'webkit'),
  withVendor('mask', 'webkit'),
  withVendor('text-stroke', 'webkit'),
  withVendor('perspective-origin', 'webkit'),
  withVendor('transform-origin', 'webkit'),
  withVendor('transition', 'webkit'),
  [
    '-webkit-border-start',
    new Set([
      '-webkit-border-start-color',
      '-webkit-border-start-style',
      '-webkit-border-start-width',
    ]),
  ],
  [
    '-webkit-border-before',
    new Set([
      '-webkit-border-before-color',
      '-webkit-border-before-style',
      '-webkit-border-before-width',
    ]),
  ],
  [
    '-webkit-border-end',
    new Set(['-webkit-border-end-color', '-webkit-border-end-style', '-webkit-border-end-width']),
  ],
  [
    '-webkit-border-after',
    new Set([
      '-webkit-border-after-color',
      '-webkit-border-after-style',
      '-webkit-border-after-width',
    ]),
  ],
]);

const experimentalLonghandProperties = new Map([
  ['background-position-x', 'background-position'],
  ['background-position-y', 'background-position'],
  ['background-repeat-x', 'background-repeat'],
  ['background-repeat-y', 'background-repeat'],
]);

mozShorthandProperties.forEach((longhandSet, shorthand) =>
  shorthandProperties.set(shorthand, longhandSet),
);

webkitShorthandProperties.forEach((longhandSet, shorthand) =>
  shorthandProperties.set(shorthand, longhandSet),
);

const longhandProperties = new Set(
  Array.from(shorthandProperties.values()).reduce(
    (longhandProperties, longhandSet) => longhandProperties.concat(Array.from(longhandSet)),
    [],
  ),
);

function withVendor(shorthand, vendor) {
  const longhands = shorthandProperties.get(shorthand);
  if (longhands) {
    return [
      `-${vendor}-${shorthand}`,
      new Set(Array.from(longhands, longhand => `-${vendor}-${longhand}`)),
    ];
  }
}

function isShorthandFor(shorthand, longhand) {
  const longhands = shorthandProperties.get(shorthand);
  return longhands ? longhands.has(longhand) : false;
}

function hasShorthand(longhand) {
  return longhandProperties.has(longhand);
}

function hasShorthandWithin(longhand, shorthands) {
  return shorthands.some(shorthand => isShorthandFor(shorthand, longhand));
}

function preferredShorthand(longhand) {
  return experimentalLonghandProperties.get(longhand);
}

exports.isShorthandFor = isShorthandFor;
exports.hasShorthand = hasShorthand;
exports.hasShorthandWithin = hasShorthandWithin;
exports.preferredShorthand = preferredShorthand;
