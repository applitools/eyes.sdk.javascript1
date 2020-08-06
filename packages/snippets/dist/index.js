exports.blurElement=function(arg){
var s=function(){"use strict";return function(e){var t=(void 0===e?{}:e).element,n=void 0===t?document.activeElement:t;return n&&n.blur(),n}}();
return s(arg)
}
exports.focusElement=function(arg){
var s=function(){"use strict";return function(n){var t=(void 0===n?{}:n).element;t&&t.focus()}}();
return s(arg)
}
exports.getChildFramesInfo=function(arg){
var s=function(){"use strict";return function(){var r=document.querySelectorAll("frame, iframe");return Array.prototype.map.call(r,(function(r){return{isCORS:!r.contentDocument,element:r,src:r.src}}))}}();
return s(arg)
}
exports.getContextInfo=function(arg){
var s=function(){"use strict";var e=function(e){var t=(void 0===e?{}:e).element,n="",r=t.ownerDocument;if(!r)return n;for(var o=t;o!==r;){var c=Array.prototype.filter.call(o.parentNode.childNodes,(function(e){return e.tagName===o.tagName})).indexOf(o);n="/"+o.tagName+"["+(c+1)+"]"+n,o=o.parentNode}return n};return function(){var t,n,r;try{t=window.top.document===window.document}catch(e){t=!1}try{n=!window.parent.document===window.document}catch(e){n=!0}if(!n)try{r=e({element:window.frameElement})}catch(e){r=null}return{isRoot:t,isCORS:n,selector:r,documentElement:document.documentElement}}}();
return s(arg)
}
exports.getDocumentSize=function(arg){
var s=function(){"use strict";return function(){var t=document.documentElement.scrollWidth,e=document.documentElement.scrollHeight,n=document.documentElement.clientHeight,c=document.body.scrollWidth,o=document.body.scrollHeight,d=document.body.clientHeight;return{width:Math.max(t,c),height:Math.max(n,e,d,o)}}}();
return s(arg)
}
exports.getElementComputedStyleProperties=function(arg){
var s=function(){"use strict";return function(e){var t=void 0===e?{}:e,r=t.element,n=t.properties,o=void 0===n?[]:n,u=window.getComputedStyle(r);return console.log(r),u?o.map((function(e){return u.getPropertyValue(e)})):[]}}();
return s(arg)
}
exports.getElementContentSize=function(arg){
var s=function(){"use strict";return function(t){var i=(void 0===t?{}:t).element;return{width:Math.max(i.clientWidth,i.scrollWidth),height:Math.max(i.clientHeight,i.scrollHeight)}}}();
return s(arg)
}
exports.getElementFixedAncestor=function(arg){
var s=function(){"use strict";return function(e){for(var t=(void 0===e?{}:e).element;t.offsetParent&&t.offsetParent!==document.body&&t.offsetParent!==document.documentElement;)t=t.offsetParent;return"fixed"===window.getComputedStyle(t).getPropertyValue("position")?t:null}}();
return s(arg)
}
exports.getElementInnerOffset=function(arg){
var s=function(){"use strict";var e=function(e){var r=(void 0===e?{}:e).element;return r?{x:r.scrollLeft,y:r.scrollTop}:{x:window.scrollX||window.pageXOffset,y:window.scrollY||window.pageYOffset}};var r=function(e){var r=void 0===e?{}:e,t=r.element,n=r.properties;return(void 0===n?[]:n).reduce((function(e,r){return e[r]=t.style[r],e}),{})};var t=function(e){var t=(void 0===e?{}:e).element,n=void 0===t?document.scrollingElement||document.documentElement:t,o=r({element:n,properties:["transform","webkitTransform"]}),i=Object.keys(o).reduce((function(e,r){if(o[r]){var t=o[r].match(/^translate\s*\(\s*(\-?[\d, \.]+)px\s*(,\s*(-?[\d, \.]+)px)?\s*\)/);if(!t)throw new Error("Can't parse CSS transition: "+o[r]+"!");var n=t[1],i=void 0!==t[3]?t[3]:0;e.push({x:Math.round(-parseFloat(n)),y:Math.round(-parseFloat(i))})}return e}),[]);if(!i.every((function(e){return i[0].x===e.x||i[0].y===e.y})))throw new Error("Got different css positions!");return i[0]||{x:0,y:0}};return function(r){var n=(void 0===r?{}:r).element,o=e({element:n}),i=t({element:n});return{x:o.x+i.x,y:o.y+i.y}}}();
return s(arg)
}
exports.getElementProperties=function(arg){
var s=function(){"use strict";return function(r){var e=void 0===r?{}:r,n=e.element,t=e.properties;return(void 0===t?[]:t).reduce((function(r,e){return r[e]=n[e],r}),{})}}();
return s(arg)
}
exports.getElementRect=function(arg){
var s=function(){"use strict";var e=function(e){for(var t=(void 0===e?{}:e).element;t.offsetParent&&t.offsetParent!==document.body&&t.offsetParent!==document.documentElement;)t=t.offsetParent;return"fixed"===window.getComputedStyle(t).getPropertyValue("position")?t:null};var t=function(e){var t=(void 0===e?{}:e).element;return t.scrollWidth>t.clientWidth||t.scrollHeight>t.clientHeight};var r=function(e){var t=(void 0===e?{}:e).element;return t?{x:t.scrollLeft,y:t.scrollTop}:{x:window.scrollX||window.pageXOffset,y:window.scrollY||window.pageYOffset}};var n=function(e){var t=void 0===e?{}:e,r=t.element,n=t.properties;return(void 0===n?[]:n).reduce((function(e,t){return e[t]=r.style[t],e}),{})};var o=function(e){var t=(void 0===e?{}:e).element,r=void 0===t?document.scrollingElement||document.documentElement:t,o=n({element:r,properties:["transform","webkitTransform"]}),i=Object.keys(o).reduce((function(e,t){if(o[t]){var r=o[t].match(/^translate\s*\(\s*(\-?[\d, \.]+)px\s*(,\s*(-?[\d, \.]+)px)?\s*\)/);if(!r)throw new Error("Can't parse CSS transition: "+o[t]+"!");var n=r[1],i=void 0!==r[3]?r[3]:0;e.push({x:Math.round(-parseFloat(n)),y:Math.round(-parseFloat(i))})}return e}),[]);if(!i.every((function(e){return i[0].x===e.x||i[0].y===e.y})))throw new Error("Got different css positions!");return i[0]||{x:0,y:0}};var i=function(e){var t=(void 0===e?{}:e).element,n=r({element:t}),i=o({element:t});return{x:n.x+i.x,y:n.y+i.y}};return function(r){var n=void 0===r?{}:r,o=n.element,l=n.isClient,a=void 0!==l&&l,d=o.getBoundingClientRect(),s={x:d.left,y:d.top,width:d.width,height:d.height};if(a){var u=window.getComputedStyle(o);s.x+=parseInt(u.getPropertyValue("border-left-width")),s.y+=parseInt(u.getPropertyValue("border-top-width")),s.width=o.clientWidth,s.height=o.clientHeight}var f=e({element:o});if(f){var c=t({element:f});if(f!==o&&c){var v=i({element:f});s.x+=v.x,s.y+=v.y}}else{var m=i();s.x+=m.x,s.y+=m.y}return s}}();
return s(arg)
}
exports.getElementScrollOffset=function(arg){
var s=function(){"use strict";return function(o){var e=(void 0===o?{}:o).element;return e?{x:e.scrollLeft,y:e.scrollTop}:{x:window.scrollX||window.pageXOffset,y:window.scrollY||window.pageYOffset}}}();
return s(arg)
}
exports.getElementStyleProperties=function(arg){
var s=function(){"use strict";return function(e){var r=void 0===e?{}:e,t=r.element,n=r.properties;return(void 0===n?[]:n).reduce((function(e,r){return e[r]=t.style[r],e}),{})}}();
return s(arg)
}
exports.getElementTranslateOffset=function(arg){
var s=function(){"use strict";var r=function(r){var e=void 0===r?{}:r,t=e.element,n=e.properties;return(void 0===n?[]:n).reduce((function(r,e){return r[e]=t.style[e],r}),{})};return function(e){var t=(void 0===e?{}:e).element,n=void 0===t?document.scrollingElement||document.documentElement:t,o=r({element:n,properties:["transform","webkitTransform"]}),s=Object.keys(o).reduce((function(r,e){if(o[e]){var t=o[e].match(/^translate\s*\(\s*(\-?[\d, \.]+)px\s*(,\s*(-?[\d, \.]+)px)?\s*\)/);if(!t)throw new Error("Can't parse CSS transition: "+o[e]+"!");var n=t[1],s=void 0!==t[3]?t[3]:0;r.push({x:Math.round(-parseFloat(n)),y:Math.round(-parseFloat(s))})}return r}),[]);if(!s.every((function(r){return s[0].x===r.x||s[0].y===r.y})))throw new Error("Got different css positions!");return s[0]||{x:0,y:0}}}();
return s(arg)
}
exports.getElementXpath=function(arg){
var s=function(){"use strict";return function(e){var r=(void 0===e?{}:e).element,t="",n=r.ownerDocument;if(!n)return t;for(var a=r;a!==n;){var o=Array.prototype.filter.call(a.parentNode.childNodes,(function(e){return e.tagName===a.tagName})).indexOf(a);t="/"+a.tagName+"["+(o+1)+"]"+t,a=a.parentNode}return t}}();
return s(arg)
}
exports.getPixelRatio=function(arg){
var s=function(){"use strict";return function(){return window.devicePixelRatio}}();
return s(arg)
}
exports.getUserAgent=function(arg){
var s=function(){"use strict";return function(){return window.navigator.userAgent}}();
return s(arg)
}
exports.getViewportSize=function(arg){
var s=function(){"use strict";return function(){var e=0,t=0;return window.innerHeight?t=window.innerHeight:document.documentElement&&document.documentElement.clientHeight?t=document.documentElement.clientHeight:document.body&&document.body.clientHeight&&(t=document.body.clientHeight),window.innerWidth?e=window.innerWidth:document.documentElement&&document.documentElement.clientWidth?e=document.documentElement.clientWidth:document.body&&document.body.clientWidth&&(e=document.body.clientWidth),{width:e,height:t}}}();
return s(arg)
}
exports.isElementScrollable=function(arg){
var s=function(){"use strict";return function(t){var e=(void 0===t?{}:t).element;return e.scrollWidth>e.clientWidth||e.scrollHeight>e.clientHeight}}();
return s(arg)
}
exports.scrollTo=function(arg){
var s=function(){"use strict";return function(o){var l=void 0===o?{}:o,e=l.element,r=void 0===e?document.documentElement:e,t=l.offset;return r.scrollTo?r.scrollTo(t.x,t.y):(r.scrollLeft=t.x,r.scrollTop=t.y),{x:r.scrollLeft,y:r.scrollTop}}}();
return s(arg)
}
exports.setElementAttribute=function(arg){
var s=function(){"use strict";return function(t){var e=t.element,r=t.attr,n=t.value;e.setAttribute(r,n)}}();
return s(arg)
}
exports.setElementStyleProperties=function(arg){
var s=function(){"use strict";return function(e){var t=void 0===e?{}:e,r=t.element,n=t.properties;return Object.keys(n).reduce((function(e,t){return e[t]=r.style[t],r.style[t]=n[t],e}),{})}}();
return s(arg)
}
exports.translateTo=function(arg){
var s=function(){"use strict";var e=function(e){var t=void 0===e?{}:e,r=t.element,n=t.properties;return Object.keys(n).reduce((function(e,t){return e[t]=r.style[t],r.style[t]=n[t],e}),{})};return function(t){var r=void 0===t?{}:t,n=r.offset,o=r.element,s=void 0===o?document.documentElement:o,u="translate("+-n.x+"px, "+-n.y+"px)";return e({element:s,properties:{transform:u,webkitTransform:u}}),n}}();
return s(arg)
}