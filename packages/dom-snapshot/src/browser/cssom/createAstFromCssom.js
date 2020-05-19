'use strict';

const csstree = require('css-tree');
const {preferredShorthand} = require('./styleProperties');

const CSSOM_TYPES = {
  UNKNOWN_RULE: 0,
  STYLE_RULE: 1,
  CHARSET_RULE: 2,
  IMPORT_RULE: 3,
  MEDIA_RULE: 4,
  FONT_FACE_RULE: 5,
  PAGE_RULE: 6,
  KEYFRAMES_RULE: 7,
  KEYFRAME_RULE: 8,
  NAMESPACE_RULE: 10,
  COUNTER_STYLE_RULE: 11,
  SUPPORTS_RULE: 12,
  DOCUMENT_RULE: 13,
  FONT_FEATURE_VALUES_RULE: 14,
  VIEWPORT_RULE: 15,
  REGION_STYLE_RULE: 16,
};
const RULE_PROPS = {
  [CSSOM_TYPES.CHARSET_RULE]: {atrule: 'charset', prelude: 'charset'},
  [CSSOM_TYPES.IMPORT_RULE]: {atrule: 'import', prelude: 'import'},
  [CSSOM_TYPES.NAMESPACE_RULE]: {atrule: 'namespace', prelude: 'namespace'},
  [CSSOM_TYPES.STYLE_RULE]: {prelude: 'selector', block: 'style'},
  [CSSOM_TYPES.KEYFRAME_RULE]: {prelude: 'key', block: 'style'},
  [CSSOM_TYPES.PAGE_RULE]: {atrule: 'page', prelude: 'selector', block: 'style'},
  [CSSOM_TYPES.FONT_FACE_RULE]: {atrule: 'font-face', block: 'style'},
  [CSSOM_TYPES.MEDIA_RULE]: {atrule: 'media', prelude: 'condition', block: 'nested'},
  [CSSOM_TYPES.SUPPORTS_RULE]: {atrule: 'supports', prelude: 'condition', block: 'nested'},
  [CSSOM_TYPES.DOCUMENT_RULE]: {atrule: 'document', prelude: 'condition', block: 'nested'},
  [CSSOM_TYPES.KEYFRAMES_RULE]: {atrule: 'keyframes', prelude: 'name', block: 'nested'},
};

function createAstFromCssom(cssomRules) {
  return Array.from(cssomRules, cssomRule => {
    const props = RULE_PROPS[cssomRule.type];
    const rule = {};
    if (props.atrule) {
      rule.type = 'Atrule';
      const [_, vendor] = cssomRule.cssText.match(new RegExp(`^@(-\\w+-)?${props.atrule}`));
      rule.name = vendor ? vendor + props.atrule : props.atrule;
    } else {
      rule.type = 'Rule';
    }

    let cssomPrelude;
    if (props.prelude === 'selector') {
      cssomPrelude = cssomRule.selectorText;
    } else if (props.prelude === 'key') {
      cssomPrelude = cssomRule.keyText;
    } else if (props.prelude === 'condition') {
      cssomPrelude = cssomRule.conditionText;
    } else if (props.prelude === 'name') {
      cssomPrelude = cssomRule.name;
    } else if (props.prelude === 'import') {
      cssomPrelude = `url("${cssomRule.href}") ${cssomRule.media.mediaText}`;
    } else if (props.prelude === 'namespace') {
      cssomPrelude = `${cssomRule.prefix} url("${cssomRule.namespaceURI}")`;
    } else if (props.prelude === 'charset') {
      cssomPrelude = `"${cssomRule.encoding}"`;
    }
    if (cssomPrelude) {
      const parseOptions = props.atrule
        ? {context: 'atrulePrelude', atrule: props.atrule}
        : {context: 'selectorList'};
      rule.prelude = csstree.toPlainObject(csstree.parse(cssomPrelude, parseOptions));
    } else {
      rule.prelude = null;
    }

    if (props.block === 'style') {
      const children = Array.from(cssomRule.style).reduce((children, longhand) => {
        const property = preferredShorthand(longhand) || longhand;
        children.set(property, {
          type: 'Declaration',
          important: Boolean(cssomRule.style.getPropertyPriority(property)),
          property,
          value: {type: 'Raw', value: cssomRule.style.getPropertyValue(property)},
        });
        return children;
      }, new Map());
      rule.block = {type: 'Block', children: Array.from(children.values())};
    } else if (props.block === 'nested') {
      rule.block = {type: 'Block', children: createAstFromCssom(cssomRule.cssRules)};
    } else {
      rule.block = null;
    }
    return rule;
  });
}

module.exports = createAstFromCssom;
