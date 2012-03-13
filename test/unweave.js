var twill = require("../lib/twill");

exports["when unweaving"] = {
    "we can call the unweave method with the id returned from aspect" : function (test) {
        var id = twill.aspect({}, function () {});
        twill.unweave(id);
        test.done();
    },

    "it throws an exception when calling with an invalid id" : function (test) {
        test.throws(function () {
            twill.unweave(333);
        });
        test.done();
    },

    "it throws an exception when unweaving twice" : function (test) {
        var id = twill.aspect({}, function () {});
        twill.unweave(id);
        test.throws(function () {
            twill.unweave(id);
        });
        test.done();
    }
};
