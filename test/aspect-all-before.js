var twill = require("../lib/twill");

exports["when aspecting before all methods"] = {

    "it calls the aspect before each method" : function (test) {
        var result = [],
            target = {
                larry: function () {
                    result.push("yrral");
                },
                curly: function () {
                    result.push("ylruc");
                },
                moe: function () {
                    result.push("eom");
                }
            };


        twill.aspect(target, function (weave) {
            weave.all.before(function (method) {
                result.push(method);
            });
        });

        target.larry();
        target.moe();
        target.curly();

        test.equal(6, result.length);
        test.equal("larry", result[0]);
        test.equal("yrral", result[1]);
        test.equal("moe", result[2]);
        test.equal("eom", result[3]);
        test.equal("curly", result[4]);
        test.equal("ylruc", result[5]);
        test.done();
    },

    "it passes the arguments to the aspect" : function (test) {
        var target = {
            foo: function (a, b, c) {
                return a + b + c;
            }
        };

        twill.aspect(target, function (weave) {
            weave.all.before(function (method, args) {
                test.equal(3, args.length);
                test.done();
            });
        });

        target.foo(1, 2, 3);
    }
};
