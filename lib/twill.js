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
        }
    };
}

module.exports = {
    aspect: function (target, advice) {
        if (!target) {
            throw "missing target object to aspect";
        }

        if (!advice) {
            throw "missing advice";
        }

        var functions = _funcs(target),
            handle = {
                target: target,
                aspects: [],
                create: []
            },
            weave = {
                before: {},
                after: {},
                around: {},
                create: {},
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
                    }
                }
            };

        functions.forEach(function (f) { 
            weave.before[f] = _pointcut(handle).before(f);
            weave.after[f] = _pointcut(handle).after(f);
            weave.around[f] = _pointcut(handle).around(f);
        });

        advice.apply(target, [weave]);

        _funcs(weave.create).forEach(function (f) {
            if (target[f]) {
                throw "attempt to create a method that already existed";
            }
            target[f] = weave.create[f];
            handle.create.push(f);
        });

        return _handles.push(handle) - 1;
    },

    unweave: function (id) {
        var handle = _handles[id],
            target = handle.target;

        handle.create.forEach(function (method) {
            delete target[method];
        });

        handle.aspects.forEach(function (aspect) {
            target[aspect.name] = aspect.orig;
        });
    }
};
