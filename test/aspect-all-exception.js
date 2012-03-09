var twill = require("../lib/twill");

exports["when aspecting exceptions on all methods"] = {
    "it handles the exception for each method" : function (test) {
        var target = {
                eeny: function () {
                    throw "eeny"
                }, 
                meeny: function () {
                    throw "meeny"
                }, 
                miny: function () {
                    throw "miny"
                },
                moe: function () {
                    throw "bob"
                }
            };

        twill.aspect(target, function (weave) {
            weave.all.exception(function (method) {});
        });

        target.eeny();
        target.meeny();
        target.miny();
        target.moe();

        test.done();
    }
};
