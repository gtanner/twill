var twill = require("../lib/twill");

exports["when aspecting around a method"] = {
    "it passes the arguments to the aspect" : function (test) {
        var target = {
                f: function (one, two, three) {
                }
            };

        twill.aspect(target, function (weave) {
            weave.around.f(function (args, orig) {
                test.equal(args[0], "a");
                test.equal(args[1], "b");
                test.equal(args[2], "c");
                test.done();
            });
        });

        target.f("a", "b", "c");
    },

    "it doesn't call the original function" : function (test) {
        var target = {
            doit: function () {
                test.ok(false, "this shouldn't have been called");
            }
        };

        twill.aspect(target, function (weave) {
            weave.around.doit(function () {
            });
        });

        target.doit();
        test.done();
    },

    "the function passed into the aspect is the original function" : function (test) {
        var target = {
            tangent: function () {
                test.done();
            }
        };

        twill.aspect(target, function (weave) {
            weave.around.tangent(function (args, orig) {
                orig();
            });
        });

        target.tangent();
    }

};
