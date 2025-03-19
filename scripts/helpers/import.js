/* global hexo */

'use strict';

hexo.extend.helper.register('import_js', function(base, relative, ex = '') {
  if (!Array.isArray(this.page.script_snippets)) {
    this.page.script_snippets = [];
  }
  if (relative === 'umami-view.js') {
   return
  }
  this.page.script_snippets.push(this.js_ex(base, relative, ex));
});

const urlJoin = require('hexo-theme-fluid/scripts/utils/url-join');

hexo.extend.helper.register('url_join', function(base, relative) {
  if (relative === 'waline.js') {
    relative = 'waline.umd.js';
  }
  return this.url_for(urlJoin(base, relative));
});


hexo.extend.helper.register = function(name, fn) {
  if (!name)
      throw new TypeError('name is required');
  if (typeof fn !== 'function')
      throw new TypeError('fn must be a function');
  if (this.store[name])
      return
  this.store[name] = fn;
}
