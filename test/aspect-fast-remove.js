var twill = require("../lib/twill");

exports["when removing a method"] = {
    "it can remove an existing method" : function (test) {
        var target = {
            ninja: function () { }
        };

        twill.fastAspect(target, function (weave) {
            weave.remove('ninja');
        });

        test.ok(!target.ninja);
        test.done();
    },

    "it throws an exception if the method doesn't exist" : function (test) {
        test.throws(function () {
            twill.fastAspect({}, function (weave) {
                weave.remove('foo');
            });
        });
        test.done();
    }
};
