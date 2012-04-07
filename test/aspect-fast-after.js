var twill = require("../lib/twill");

exports["when aspecting after a method"] = {
    "it calls the aspect after the actual" : function (test) {
        var msg = "",
            target = {
                f: function () {
                    msg += "hello ";
                }
            };

        twill.fastAspect(target, function (weave) {
            weave.after('f', function () {
                msg += "world";
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

        twill.fastAspect(target, function (weave) {
            weave.after('stuff', function (x, y, z) {
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

        twill.fastAspect(target, function (weave) {
            weave.after('merp', function () {
                test.strictEqual(this, target);
            });
        });

        target.merp();
    },

    "it still returns the value of the original method" : function (test) {
        var target = {
            doubleRainbow: function () {
                return "OMG OMG OMG OMG OMG";
            }
        };

        twill.fastAspect(target, function (weave) {
            weave.after('doubleRainbow', function () {
                return "meh";
            });
        });

        test.equal("OMG OMG OMG OMG OMG", target.doubleRainbow());
        test.done();
    },

    "it can unweave the methods added after" : function (test) {
        var untouched = true,
            target = {
                soap: function () {
                }
            };

        twill.unweave(twill.fastAspect(target, function (weave) {
            weave.after('soap', function () {
                untouched = false;
            });
        }));

        target.soap();
        test.ok(untouched);
        test.done();
    }
};
