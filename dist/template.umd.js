!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Template={})}(this,(function(t){"use strict";
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */var extendStatics=function(t,e){return(extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])})(t,e)};function __spreadArray(t,e,r){if(r||2===arguments.length)for(var n,o=0,i=e.length;o<i;o++)!n&&o in e||(n||(n=Array.prototype.slice.call(e,0,o)),n[o]=e[o]);return t.concat(n||Array.prototype.slice.call(e))}var markGenerator=function(t){return void 0===t&&(t="-"),"\x3c!--"+t+"--\x3e"},isEndMark=function(t){return"string"==typeof t?markGenerator()===t:t.nodeType===Node.COMMENT_NODE&&"-"===t.nodeValue},escapePart=function(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")},e=/\s(\S+)\=[\"\']([^\"]*)$/,startAttrParser=function(t){var r=e.exec(t);return null!==r?[r[1],r[2]]:null},r=/^([^\"]*)[\"|\'][\s|\>]/,endAttrParser=function(t){var e=r.exec(t);return null!==e?e[1]:null},n={1:"injected functions cannot be inlined, reference it instead",2:"the requested slot is not found",3:"every list items must be a Template instance"},o=function(t){function TemplateError(e,r,n){void 0===r&&(r=-1);var o=t.call(this,e)||this;return o.name="TemplateError",o.message=e,o.code=r,o.metadata=n,o}return function __extends(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function __(){this.constructor=t}extendStatics(t,e),t.prototype=null===e?Object.create(e):(__.prototype=e.prototype,new __)}(TemplateError,t),TemplateError.create=function(t,e){return new TemplateError(n[t],t,e)},TemplateError.INLINE_FN=1,TemplateError.NOT_SLOT=2,TemplateError.NOT_TEMPLATE=3,TemplateError}(Error),acceptNode=function(t){var e=t.nodeType,r=t.nodeValue;return e===Node.COMMENT_NODE&&parseInt(r)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT},i=function(){function Processor(t,e){this.template=t,this.container=e}return Processor.prototype.getSlot=function(t){for(var e,r=this.template.slots.length,n=0;n<r;n++){var i=this.template.slots[n];if(i.slotIndex===t)return i}throw e={template:this.template,slot:t},o.create(o.NOT_SLOT,e)},Processor.prototype.render=function(){var t=document.createNodeIterator(this.container,NodeFilter.SHOW_COMMENT,{acceptNode:acceptNode}),e=t.nextNode();if(null!==e)for(var r=0;e;){var n=parseInt(e.nodeValue);if(n>r)this.getSlot(n).commit(e),r=n;e=t.nextNode()}else this.container.appendChild(this.template.element)},Processor}(),s=function(){function Slot(t,e,r){this.slotIndex=t,this.attr=r,this.value=e}return Object.defineProperty(Slot.prototype,"isAttr",{get:function(){return null!==this.attr&&void 0!==this.attr},enumerable:!1,configurable:!0}),Slot.prototype.commit=function(t){if(this.isAttr)this.commitAttr(t.nextSibling);else{var e=this.value;if(Array.isArray(e)){for(var r=[],n=t.nextSibling;!isEndMark(n);)r.push(n),n=n.nextSibling;this.commitTemplates(r,t,n,e)}else{var o=t.nextSibling;"Template"===e.constructor.name?this.commitTemplate(o,t,e):this.commitValue(o,t,e)}}},Slot.prototype.commitAttr=function(t){var e=this.attr,r=Array.isArray(this.value)?this.value.join(" "):this.value;t.getAttribute(e)!==r&&t.setAttribute(e,r)},Slot.prototype.commitValue=function(t,e,r){null==t?e.parentNode.insertBefore(document.createTextNode(r),e.nextSibling):t.nodeValue!==r&&(t.nodeValue=r)},Slot.prototype.commitTemplate=function(t,e,r){void 0===t?e.parentNode.insertBefore(r.element,e.nextSibling):isEndMark(t)?t.parentNode.insertBefore(r.element,t):r.match(t)?new i(r,t).render():t.parentNode.replaceChild(r.element,t)},Slot.prototype.commitTemplates=function(t,e,r,n){for(var i,s=n.length,l=t.length,a=s>l?s:l,u=0;u<a;u++){var p=[t[u],n[u]],c=p[0],f=p[1];if(void 0!==f){if("Template"!==f.constructor.name)throw i={node:c,template:f},o.create(o.NOT_TEMPLATE,i);this.commitTemplate(c||r,e,f)}else void 0!==c&&c.parentNode.removeChild(c)}},Slot}(),l=function(){function Template(t,e){void 0===e&&(e=[]),this.strings=t,this.slots=[],this.prepare(e)}return Object.defineProperty(Template.prototype,"regexp",{get:function(){for(var t="",e=this.strings.length-1,r=0;r<e;r++)t+=escapePart(this.strings[r])+"(.*)",this.slots[r].isAttr||(t+=escapePart(markGenerator()));return t+=escapePart(this.strings[e]),new RegExp(t)},enumerable:!1,configurable:!0}),Object.defineProperty(Template.prototype,"html",{get:function(){for(var t="",e=this.strings.length-1,r=0;r<e;r++){var n=this.slots[r].value;Array.isArray(n)&&(n=n.join("")),t+=this.strings[r]+n,this.slots[r].isAttr||(t+=markGenerator())}return t+this.strings[e]},enumerable:!1,configurable:!0}),Object.defineProperty(Template.prototype,"element",{get:function(){return document.createRange().createContextualFragment(this.html)},enumerable:!1,configurable:!0}),Template.prototype.toString=function(){return this.html},Template.prototype.match=function(t){var e=t.outerHTML;return this.regexp.test(e)},Template.prototype.prepare=function(t){for(var e,r=0,n=this.strings.length-1,i=0;i<n;i++){var l=this.strings[i],a=t[i];if("function"==typeof a){var u=a.name;if(""===u)throw e={part:l,value:a},o.create(o.INLINE_FN,e);a=u+"()"}var p=startAttrParser(l);if(null!==p){var c=l.lastIndexOf("<");if(-1!=c&&r++,0===c)this.strings[i]=markGenerator(r)+l;else if(c>0){var f=l.substring(0,c-1),h=l.substring(c);this.strings[i]=f+markGenerator(r)+h}var m=p[0],d=p[1];if(""!==d){var g=this.strings[i].length-d.length;this.strings[i]=this.strings[i].slice(0,g)}for(var v="",T=this.strings[i+1],y=endAttrParser(T);null===y;)v+=T+t[i+1],this.strings.splice(i+1,1),t.splice(i+1,1),n--,T=this.strings[i+1],y=endAttrParser(T);this.strings[i+1]=T.slice(y.length);var _=d+a+v+y;this.slots.push(new s(r,_,m))}else r++,this.strings[i]=l+markGenerator(r),this.slots.push(new s(r,a))}},Template}();t.Template=l,t.html=function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];return new l(__spreadArray([],t.raw),e)},t.render=function(t,e){return new i(t,e).render()},Object.defineProperty(t,"__esModule",{value:!0})}));
