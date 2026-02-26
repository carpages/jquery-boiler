(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.jQuery = factory(global.$));
})(this, (function ($) { 'use strict';

  $.boiler = function (namespace, base) {
    $.fn[namespace] = function () {
      var args = Array.prototype.slice.call(arguments);
      var method = args[0];
      var options = args.slice(1);
      return this.each(function () {
        var cachedPlugin = $(this).data(namespace);
        if (cachedPlugin === undefined) {
          // make a clone of the base
          var plugin = {};
          $.extend(plugin, base);

          // cache the element
          plugin.el = this;
          plugin.$el = $(this);

          // cache the plugin
          plugin.$el.data(namespace, plugin);

          // cache the options
          if (method !== undefined) plugin.options = method;

          // check for data attributes
          if (plugin.data) {
            var dataList = plugin.data;
            plugin.data = {};
            $.each(dataList, function (index, name) {
              plugin.data[name] = plugin.$el.data(name);
            });
          }

          // overwrite options with data and defaults
          plugin.settings = $.extend({}, plugin.defaults, plugin.options, plugin.data);

          // check for events
          if (plugin.events) {
            $.each(plugin.events, function (eventString, handler) {
              var tmp = eventString.split(' ');
              var event = tmp[0];
              var selector = tmp.slice(1).join(' ') || null;
              plugin.$el.on(event, selector, function (e) {
                plugin[handler].call(plugin, e, this);
              });
            });
          }

          // fire up the plugin!
          if (plugin.init) plugin.init();
        } else if (cachedPlugin[method] && method.charAt(0) !== '_') {
          // if method is a function
          if (typeof cachedPlugin[method] === 'function') {
            cachedPlugin[method].apply(cachedPlugin, options);
            // otherwise, treat it as a propery and reset it
          } else {
            cachedPlugin[method] = options[0];
          }
        }
      });
    };
  };

  return $;

}));
