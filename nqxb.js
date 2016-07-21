/**
 * Created by WangYue on 2016/6/29.
 */
(function (window) {
    var support = {
        getElementsByClassName: false,
        getComputedStyle: false,
        eventListener: false
    };
    (function (window, document) {
        var div, span;
        if (typeof document.getElementsByClassName === 'function') {
            div = document.createElement('div');
            span = document.createElement('span');
            span.className = 'test';
            div.appendChild(span);
            if (typeof div.getElementsByClassName === 'function') {
                if (div.getElementsByClassName('test')[0] === span)
                    support.getElementsByClassName = true;
            }
        }
        if (typeof window.getComputedStyle === 'function') {
            support.getComputedStyle = true;
        }
        if (typeof document.addEventListener === 'function') {
            support.eventListener = true;
        }
    }(window, document));

    var select = (function () {

        function gebi(id, parent) {
            var dom = document.getElementById(id), parentNode;
            if (parent === document) {
                return dom;
            } else {
                parentNode = dom.parentNode;
                while (parentNode) {
                    if (parentNode === parent) {
                        return dom;
                    }
                    parentNode = parentNode.parentNode;
                }
                return null;
            }
        }

        function gebc(className, parent) {
            var elems, ret;
            if (!support.getElementsByClassName) {
                ret = [];
                elems = gebt('*', parent);
                NQXB.each(elems, function () {
                    var str = ' ' + this.className + ' ', substr = ' ' + className + ' ';
                    if (~str.indexOf(substr)) {
                        ret.push(this);
                    }
                })
            }
            return ret || parent.getElementsByClassName(className);
        }

        function gebt(tagName, parent) {
            return parent.getElementsByTagName(tagName);
        }

        function get(selector, parents) {
            var reg = /^(?:#(\w+)|\.(\w+)|(\w+|\*))$/, ret = [], name, result, temp;
            if (typeof selector === 'string') {
                if (parents === undefined) {
                    parents = [document];
                } else if (typeof parents === 'string') {
                    parents = get(parents);
                }
                else if (parents && parents.nodeType) {
                    parents = [parents];
                }
                temp = reg.exec(selector) || [];
                NQXB.each(parents, function () {
                    var parent = this;
                    if ((name = temp[1]) && (result = gebi(name, parent))) {
                        ret.push(result);
                    } else if ((name = temp[2]) && (result = gebc(name, parent))) {
                        ret.push.apply(ret, result);
                    } else if ((name = temp[3]) && (result = gebt(name, parent))) {
                        ret.push.apply(ret, result);
                    }
                });
                return ret;
            }
        }

        function $level(selector, parents) {
            var result = [], levels;
            if (typeof selector === 'string') {
                levels = selector.split(' ');
                NQXB.each(levels, function (i, level) {
                    result = i === 0 ? get(level, parents) : get(level, result);
                });
            }
            return result;
        }

        function $gal(selector, parents) {
            var result = [], levels;
            if (typeof selector === 'string') {
                levels = selector.split(',');
                NQXB.each(levels, function (i, level) {
                    result.push.apply(result, $level(level, parents));
                });
            }
            return result;
        }

        return $gal;
    })();

    function NQXB(selector, context) {
        return new NQXB.prototype.init(selector, context);
    }

    NQXB.fn = NQXB.prototype = {
        push: Array.prototype.push,
        splice: Array.prototype.splice,
        init: function (selector, context) {
            this.splice.call(this, 0, this.length - 1);
            var i = 0, len, dom, oldLoad;
            if (typeof selector === 'string') {
                if (selector[0] === '<' && selector[selector.length - 1] === '>' && selector.length > 2) {
                    this.push.apply(this, NQXB.createElems(selector));
                } else {
                    this.push.apply(this, select(selector, context));
                }
            } else if (selector instanceof NQXB) {
                return selector;
            } else if (!!selector && selector.nodeType) {
                this.push.call(this, selector);
            } else if (NQXB.isArrayLike(selector)) {
                len = selector.length;
                for (; i < len;) {
                    dom = selector[i++];
                    if (!!dom && dom.nodeType) {
                        this.push.call(this, dom);
                    }
                }
            } else if (typeof selector === 'function') {
                if (oldLoad = window.onload) {
                    window.onload = function () {
                        oldLoad();
                        selector();
                    }
                } else {
                    window.onload = selector;
                }
            }
            return this;
        }
    };
    NQXB.fn.init.prototype = NQXB.fn;

    NQXB.fn.extend = NQXB.extend = function () {
        var target, sources = [], argLen = arguments.length, i = 0, srcLen, source, k;
        if (argLen === 0) {
            return;
        }
        if (argLen === 1) {
            target = this;
            sources.push(arguments[0]);
        } else {
            target = arguments[0];
            sources.push.apply(sources, arguments);
            sources.splice(0, 1);
        }
        srcLen = sources.length;
        for (; i < srcLen;) {
            source = sources[i++];
            for (k in source) {
                if (source.hasOwnProperty(k)) {
                    target[k] = source[k];
                }
            }
        }
    };

    NQXB.extend({
        trim: function (str) {
            if (typeof str === 'string') {
                return str.replace(/^\s+|\s+$/g, '');
            }
        },
        type: function (arg) {
            var rType = /^\[object ([a-zA-Z]+)]$/, typeStr = Object.prototype.toString.call(arg);
            return rType.exec(typeStr)[1].toLowerCase();
        },
        isArrayLike: function (obj) {
            var length = !!obj && 'length' in obj && obj.length, type = NQXB.type(obj);
            if (type === 'function' || type === 'window') {
                return false;
            }
            return type === 'array' || length === 0 ||
                typeof length === 'number' && length > 0 && (length - 1) in obj;
        },
        each: function (arr, callback) {
            var i = 0, len;
            if (NQXB.isArrayLike(arr)) {
                len = arr.length;
                for (; i < len;) {
                    if (callback.call(arr[i], i, arr[i++]) === false) {
                        break;
                    }
                }
            } else if (typeof arr === 'object') {
                for (i in arr) {
                    if (arr.hasOwnProperty(i)) {
                        if (callback.call(arr[i], i, arr[i]) === false) {
                            break;
                        }
                    }
                }
            }
        },
        createElems: function (html) {
            var result = [], div, children, child, cLen, i = 0;
            if (typeof html === 'string') {
                div = document.createElement('div');
                div.innerHTML = html;
                children = div.childNodes;
                cLen = children.length;
                for (; i < cLen; i++) {
                    child = children[i];
                    if (child.nodeType === 1) {
                        result.push(child);
                    }
                }
            }
            return result;
        }
    });
    NQXB.fn.extend({
        each: function (callback) {
            NQXB.each(this, callback);
            return this;
        },
        css: function (name, val) {
            var dom, that;
            if (val === undefined) {
                if (typeof name === 'string') {
                    dom = this[0];
                    return support.getComputedStyle ?
                        window.getComputedStyle(dom, null)[name] :
                        dom.currentStyle[name];
                } else {
                    this.each(function () {
                        that = this;
                        NQXB.each(name, function (key, value) {
                            that.style[key] = value;
                        })
                    });
                    return this;
                }
            } else {
                this.each(function () {
                    this.style[name] = val;
                });
                return this;
            }
        },
        attr: function (name, val) {
            var that;
            if (val === undefined) {
                if (typeof name === 'string') {
                    return this[0].getAttribute(name);
                } else {
                    this.each(function () {
                        that = this;
                        NQXB.each(name, function (key, value) {
                            that.setAttribute(key, value);
                        })
                    });
                    return this;
                }
            } else {
                this.each(function () {
                    this.setAttribute(name, val);
                });
                return this;
            }
        },
        hasClass: function (className) {
            var classNameChange, cNameChange;
            if (!this.length) {
                return false;
            } else {
                classNameChange = ' ' + className + ' ';
                cNameChange = ' ' + this[0].className + ' ';
                return !!~cNameChange.indexOf(classNameChange);
            }
        },
        addClass: function (className) {
            if (typeof  className === 'string') {
                var classNames = NQXB.trim(className).split(' ');
                this.each(function () {
                    var that = this;
                    that.className = NQXB.trim(that.className);
                    NQXB.each(classNames, function (i, singleName) {
                        if (!NQXB(that).hasClass(singleName)) {
                            that.className += (' ' + singleName);
                        }
                    });
                    that.className = NQXB.trim(that.className);
                })
            }
            return this;
        },
        removeClass: function (className) {
            var classNames, name;
            if (className === undefined) {
                this.each(function () {
                    this.className = '';
                })
            } else if (typeof className === 'string') {
                classNames = NQXB.trim(className).split(' ');
                this.each(function () {
                    name = ' ' + this.className + ' ';
                    NQXB.each(classNames, function (i, cName) {
                        name = name.replace(' ' + cName + ' ', ' ');
                    });
                    this.className = NQXB.trim(name);
                })
            }
            return this;
        },
        append: function (arg) {
            if (arg === undefined) {
                return this;
            }
            this.each(function (parentIndex) {
                var parent = this;
                NQXB(arg).each(function () {
                    parent.appendChild((parentIndex === 0) ? this : this.cloneNode(true));
                })
            });
            return this;
        },
        appendTo: function (arg) {
            NQXB(arg).prepend(this);
            return this;
        },
        prepend: function (arg) {
            if (arg === undefined) {
                return this;
            }
            this.each(function (parentIndex) {
                var parent = this;
                NQXB(arg).each(function () {
                    parent.insertBefore((parentIndex === 0) ? this : this.cloneNode(true), parent.firstChild);
                })
            });
            return this;
        },
        prependTo: function (arg) {
            NQXB(arg).prepend(this);
            return this;
        },
        empty: function () {
            this.each(function () {
                this.innerHTML = '';
            });
            return this;
        },
        remove: function () {
            this.each(function () {
                this.parentNode.removeChild(this);
            });
            return this;
        },
        on: function (type, fn) {
            if (type + '' === type) {
                this.each(function () {
                    if (support.eventListener) {
                        this.addEventListener(type, fn);
                    } else {
                        this.attachEvent('on' + type, fn);
                    }
                });
            }
            return this;
        },
        off: function (type, callback) {
            if (typeof type === 'string') {
                this.each(function () {
                    if (support.eventListener) {
                        this.removeEventListener(type, callback);
                    } else {
                        this.detachEvent("on" + type, callback);
                    }
                });
            }
            return this;
        }
    });
    var eventTypes = 'click dblclick keyup keydown mouseenter mouseleave mouseover load mousedown'.split(" ");
    NQXB.each(eventTypes, function (i, type) {
        NQXB.fn[type] = function (callback) {
            this.on(type, callback);
            return this;
        }
    });
    window.$ = window.NQXB = NQXB;
})(window);