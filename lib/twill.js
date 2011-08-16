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

function _pointcut(target) {
    return {
        before: function (name) {
            var orig = target[name];

            return function (func) {
                target[name] = function () {
                    func.apply(target, arguments);
                    return orig.apply(target, arguments);
                };
            };
        },
        after: function (name) {
            var orig = target[name];

            return function (func) {
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
            weave = {
                before: {
                },
                after: {
                },
                around: {
                },
                create: {
                },
                all: {
                    before: function (method) {
                        var funcs = _funcs(target);

                        funcs.forEach(function (f) {
                            _pointcut(target).before(f)(function () {
                                method(f, arguments);
                            });
                        });
                    },
                    after: function (method) {
                        var funcs = _funcs(target);

                        funcs.forEach(function (f) {
                            _pointcut(target).after(f)(function () {
                                method(f, arguments);
                            });
                        });
                    },
                    around: function (method) {
                        var funcs = _funcs(target);

                        funcs.forEach(function (f) {
                            _pointcut(target).around(f)(function (args, orig) {
                                return method(f, args, orig);
                            });
                        });
                    }
                }
            };

        functions.forEach(function (f) { 
            weave.before[f] = _pointcut(target).before(f);
            weave.after[f] = _pointcut(target).after(f);
            weave.around[f] = _pointcut(target).around(f);
        });

        advice.apply(target, [weave]);

        _funcs(weave.create).forEach(function (f) {
            if (target[f]) {
                throw "attempt to create a method that already existed";
            }
            target[f] = weave.create[f];
        });
    },
    unweave: function () {
        throw "not done :(";
    }
};
