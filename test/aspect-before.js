var twill = require("../lib/twill");

exports["when aspecting before a method"] = {
    "it calls the aspect before the actual" : function (test) {
        var msg = "",
            target = {
                f: function () {
                    msg += " world";
                }
            };

        twill.aspect(target, function (weave) {
            weave.before.f(function () {
                msg += "hello";
            });
        });

        target.f();

        test.equal("hello world", msg);
        test.done();
    },

    "it passes the arguments to the aspect method and the orig method" : function (test) {
        var target = {
            stuff: function (a, b, c) {
                test.equal(a, "1");
                test.equal(b, "2");
                test.equal(c, "3");
                test.done();
            }
        };

        twill.aspect(target, function (weave) {
            weave.before.stuff(function (x, y, z) {
                test.equal(x, "1");
                test.equal(y, "2");
                test.equal(z, "3");
            });
        });

        target.stuff("1", "2", "3");
    },

    "the context for both the aspect method and the original are the target method" : function (test) {
        var target = {
            merp: function () {
                test.strictEqual(this, target);
                test.done();
            }
        };

        twill.aspect(target, function (weave) {
            weave.before.merp(function () {
                test.strictEqual(this, target);
            });
        });

        target.merp();
    },

    "it still returns the return value from the original method" : function (test) {
        var target = {
            kungfu : function () {
                return "i know it!";
            }
        };

        twill.aspect(target, function (weave) {
            weave.before.kungfu(function () {
                return "the matrix has you";
            });
        });

        test.equal("i know it!", target.kungfu());
        test.done();
    },

    "it can unweave the methods added before" : function (test) {
        var untouched = true,
            target = {
                bob: function () {
                }
            };

        //should be a noop ;)
        twill.unweave(twill.aspect(target, function (weave) {
            weave.before.bob(function () {
                untouched = false;
            });
        }));

        target.bob();

        test.ok(untouched);
        test.done();
    }
};
