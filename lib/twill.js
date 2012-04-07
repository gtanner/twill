var _handles = [];

function _funcs(obj) {
    var funcs = [],
        item;

    for (item in obj) {
        if (typeof obj[item] === "function") {
            funcs.push(item);
        }
    }

    return funcs;
}

function _pointcut(handle) {
    var target = handle.target;

    return {
        before: function (name) {
            var orig = target[name];

            return function (func) {
                handle.aspects.push({name: name, orig: orig});
                target[name] = function () {
                    func.apply(target, arguments);
                    return orig.apply(target, arguments);
                };
            };
        },
        after: function (name) {
            var orig = target[name];

            return function (func) {
                handle.aspects.push({name: name, orig: orig});
                target[name] = function () {
                    var result = orig.apply(target, arguments);
                    func.apply(target, arguments);
                    return result;
                };
            };
        },
        around: function (name) {
            var orig = target[name];

            return function (func) {
                handle.aspects.push({name: name, orig: orig});
                target[name] = function () {
                    return func.apply(target, [arguments, orig]);
                };
            };
        },
        exception: function (name) {
            var orig = target[name];
            return function (func) {
                handle.aspects.push({name: name, orig: orig});
                target[name] = function () {
                    try {
                        orig.apply(target, arguments);
                    }
                    catch (e) {
                        func.apply(target, [e]);
                    }
                };
            };
        },
        remove: function (name) {
            var orig = target[name];
            return function () {
                handle.aspects.push({name: name, orig: orig});
                delete target[name];
            };
        }
    };
}

function _fastWeave(handle) {
    return {
        add: {},
        before: function(name, method) {
            _pointcut(handle).before(name)(method);
        },
        after: function(name, method) {
            _pointcut(handle).after(name)(method);
        },
        around: function(name, method) {
            _pointcut(handle).around(name)(method);
        },
        remove: function(name) {
            if (typeof handle.target[name] === 'undefined') {
                throw new Error(name + " not defined");
            }
            _pointcut(handle).remove(name)();
        },
        exception: function(name, method) {
            _pointcut(handle).exception(name)(method);
        }
    };
}

function _weave(handle) {
    var target = handle.target,
        functions = _funcs(target),
        weave = {
            before: {},
            after: {},
            around: {},
            add: {},
            remove: {},
            exception: {},
            all: {
                before: function (method) {
                    var funcs = _funcs(target);

                    funcs.forEach(function (f) {
                        _pointcut(handle).before(f)(function () {
                            method(f, arguments);
                        });
                    });
                },
                after: function (method) {
                    var funcs = _funcs(target);

                    funcs.forEach(function (f) {
                        _pointcut(handle).after(f)(function () {
                            method(f, arguments);
                        });
                    });
                },
                around: function (method) {
                    var funcs = _funcs(target);

                    funcs.forEach(function (f) {
                        _pointcut(handle).around(f)(function (args, orig) {
                            return method(f, args, orig);
                        });
                    });
                },
                exception: function (method) {
                    var funcs = _funcs(target);

                    funcs.forEach(function (f) {
                        _pointcut(handle).around(f)(function () {
                            return method.apply(target, arguments);
                        });
                    });
                }
            }
        };
    functions.forEach(function (f) {
        weave.before[f] = _pointcut(handle).before(f);
        weave.after[f] = _pointcut(handle).after(f);
        weave.around[f] = _pointcut(handle).around(f);
        weave.exception[f] = _pointcut(handle).exception(f);
        weave.remove[f] = _pointcut(handle).remove(f);
    });
    return weave;
};

function _aspect(target, advice, getWeave) {
    if (!target) {
        throw "missing target object to aspect";
    }

    if (!advice) {
        throw "missing advice";
    }

    var handle = {
            target: target,
            aspects: [],
            add: []
        },
        weave = getWeave(handle);
    advice.apply(target, [weave]);

    _funcs(weave.add).forEach(function (f) {
        if (target[f]) {
            throw "attempt to add a method that already existed";
        }
        target[f] = weave.add[f];
        handle.add.push(f);
    });

    return _handles.push(handle) - 1;
}

module.exports = {
    fastAspect: function(target, advice) {
        return _aspect(target, advice, _fastWeave);
    },

    aspect: function (target, advice) {
        return _aspect(target, advice, _weave);
    },

    unweave: function (id) {
        var handle = _handles[id],
            target = handle.target;

        handle.add.forEach(function (method) {
            delete target[method];
        });

        handle.aspects.forEach(function (aspect) {
            target[aspect.name] = aspect.orig;
        });

        delete _handles[id];
    }
};
