;(function (window, document, $) {

    Function.prototype.before = function( beforefn ){
        var __self = this;
        return function(){
            beforefn.apply( this, arguments );
            return __self.apply( this, arguments );
        }
    };

    Function.prototype.after = function( afterfn ){
        var __self = this;
        return function(){
            var ret = __self.apply( this, arguments );
            afterfn.apply( this, arguments );
            return ret;
        }
    };

    $(function () {
        $.ajaxSetup({
            error: function (xhr, status, error) {
                console.log(arguments);
            }
        });
    });

    function loadWebFragment(name, successCallback, errorCallback) {
        $.get(name).done(function (data) {
            if (data && data.control) {
                var result = eval(data.control);
                if(result){result.viewContext=data;}
                if (successCallback) successCallback.call(result, data);
            }
        }).fail(errorCallback || function () {
            alert(JSON.stringify(arguments));
        });
    }

    window.loadWebFragment = loadWebFragment;

    var Type = (function () {
        var isObjFunc = function (name) {
            var toString = Object.prototype.toString;
            return function () {
                return toString.call(arguments[0]) === '[object ' + name + ']'
            }
        };
        return {
            isObject: isObjFunc('Object'),
            isArray: isObjFunc('Array'),
            isFunction: isObjFunc('Function'),
            isBoolean: isObjFunc('Boolean')
        };
    }());

    var extend = (function () {
        return function extend() {
            var index = 0, isDeep = false, obj, copy, destination, source, i;
            if (Type.isBoolean(arguments[0])) {
                index = 1;
                isDeep = arguments[0]
            }
            for (i = arguments.length - 1; i > index; i--) {
                destination = arguments[i - 1];
                source = arguments[i];
                if (Type.isObject(source) || Type.isArray(source)) {
                    for (var property in source) {
                        obj = source[property];
                        if (isDeep && (Type.isObject(obj) || Type.isArray(obj))) {
                            copy = Type.isObject(obj) ? {} : [];
                            var extended = extend(isDeep, copy, obj);
                            destination[property] = extended;
                        } else {
                            destination[property] = source[property];
                        }
                    }
                } else {
                    destination = source;
                }
            }
            return destination;
        }
    }());

    var Event = (function () {
        var global = this,
            Event,
            _default = 'default';
        Event = function () {
            var _listen,
                _trigger,
                _remove,
                _slice = Array.prototype.slice,
                _shift = Array.prototype.shift,
                _unshift = Array.prototype.unshift,
                namespaceCache = {},
                _create,
                find,
                each = function (ary, fn) {
                    var ret;
                    for (var i = 0, l = ary.length; i < l; i++) {
                        var n = ary[i];
                        ret = fn.call(n, i, n);
                    }
                    return ret;
                };

            _listen = function (key, fn, cache) {
                if (!cache[key]) {
                    cache[key] = [];
                }
                cache[key].push(fn);
            };

            _remove = function (key, cache, fn) {
                if (cache[key]) {
                    if (fn) {
                        for (var i = cache[key].length; i >= 0; i--) {
                            if (cache[key][i] === fn) {
                                cache[key].splice(i, 1);
                            }
                        }
                    } else {
                        cache[key] = [];
                    }
                }
            };

            _trigger = function () {
                var cache = _shift.call(arguments),
                    key = _shift.call(arguments),
                    args = arguments,
                    _self = this,
                    ret,
                    stack = cache[key];

                if (!stack || !stack.length) {
                    return;
                }

                return each(stack, function () {
                    return this.apply(_self, args);
                });
            };

            _create = function (namespace) {
                var namespace = namespace || _default;
                var cache = {},
                    offlineStack = [],    // 离线事件
                    ret = {
                        listen: function (key, fn, last) {
                            _listen(key, fn, cache);
                            if (offlineStack === null) {
                                return;
                            }
                            if (last === 'last') {
                                offlineStack.length && offlineStack.pop()();
                            } else {
                                each(offlineStack, function () {
                                    this();
                                });
                            }

                            offlineStack = null;
                        },
                        one: function (key, fn, last) {
                            _remove(key, cache);
                            this.listen(key, fn, last);
                        },
                        remove: function (key, fn) {
                            _remove(key, cache, fn);
                        },
                        trigger: function () {
                            var fn,
                                args,
                                _self = this;

                            _unshift.call(arguments, cache);
                            args = arguments;
                            fn = function () {
                                return _trigger.apply(_self, args);
                            };

                            if (offlineStack) {
                                return offlineStack.push(fn);
                            }
                            return fn();
                        }
                    };

                return namespace ?
                    (namespaceCache[namespace] ? namespaceCache[namespace] :
                        namespaceCache[namespace] = ret)

                    : ret;
            };

            return {
                create: _create,
                one: function (key, fn, last) {
                    var event = this.create();
                    event.one(key, fn, last);
                },
                remove: function (key, fn) {
                    var event = this.create();
                    event.remove(key, fn);
                },
                listen: function (key, fn, last) {
                    var event = this.create();
                    event.listen(key, fn, last);
                },
                trigger: function () {
                    var event = this.create();
                    event.trigger.apply(this, arguments);
                }
            };
        }();

        return Event;

    }());

    var uniqueId = function () {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    var replaceId = function(string, prefix, suffix){
        suffix = suffix||prefix;
        string = string.replace(/id=(['"]?)([^'"]*)(['"]?)/g, "id=$1"+prefix+"$2"+suffix+"$3");
        return string;
    };

    var V = (function () {
        var item;
        var View = function () {
            this.__vid = uniqueId();
            this.__event = Event.create(this.__vid);
        };
        View.fn = View.prototype;
        View.fn.__replaceId = replaceId;
        View.fn.set=function(name, value){
            this[name]=value;
        };
        View.fn.listen = function (key, fn, last) {
            this.__event.listen(key, fn, last);
        };
        View.fn.unlisten = function (key, fn) {
            this.__event.remove(key, fn);
        };
        View.fn.trigger = function () {
            this.__event.trigger.apply(this, arguments);
        };
        View.fn.listenOne = function (key, fn, last) {
            this.__event.one(key, fn, last);
        };
        View.fn.loadFragment = loadWebFragment;
        View.fn.msg = function(){
            var args = arguments;
            var pattern = Array.prototype.shift.call(args);
            var nargs = args.length;
            for(var i=0; i<nargs; i++){
                pattern = pattern.replace('{'+i+'}', args[i]);
            }
            return pattern;
        };
        View.fn.bindTo = function(selector){
            this.$el = $(selector);
        };
        View.fn.__display = function(){
            if(this.$el && this.viewContext && this.viewContext.template){
                this.$el.html(replaceId(this.viewContext.template, this.__vid));
            }
        };
        View.fn.$=function(selector){
            selector = selector.replace(/#([^ ]*)/g, "#"+this.__vid+"$1"+this.__vid);
            selector = selector.replace(/id=(['"]?)([^'" ]*)(['"]?)/g, "id=$1"+this.__vid+"$2"+this.__vid+"$3");
            selector = selector.replace(/id\^=(['"]?)([^'" ]*)(['"]?)/g, "id^=$1"+this.__vid+"$2$3");
            selector = selector.replace(/id\$=(['"]?)([^'" ]*)(['"]?)/g, "id$=$1$2"+this.__vid+"$3");
            return $(selector);
        };
        return {
            extend: function (obj) {
                for (prop in obj) {
                    item = obj[prop];
                    if (Type.isFunction(item)) {
                        View.fn[prop] = item;
                    } else {
                        View.fn.set(prop, item);
                    }
                }
                if(Type.isFunction(View.fn.display)){
                    View.fn.display = View.fn.display.before(function(){
                        View.fn.__display.apply(this, arguments);
                    });
                    if(Type.isFunction(View.fn.bindEvent)){
                        View.fn.display = View.fn.display.after(function(){
                            View.fn.bindEvent.apply(this, arguments);
                        });
                        if(Type.isFunction(View.fn.handleEvent)){
                            View.fn.bindEvent = View.fn.bindEvent.after(function(){
                                View.fn.handleEvent.apply(this, arguments);
                            });
                        }
                    }
                }
                return View;
            },
            loadWebFragment:loadWebFragment
        };
    }());

    window.V = V;

}(window, document, jQuery));