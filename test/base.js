exports["the twill module"] = {
    "can be required": function (test) {
        var twill = require("../lib/twill");
        test.ok(twill, "twill should be defined");
        test.done();
    },

    "exposes an aspect method": function (test) {
        var twill = require("../lib/twill");
        test.equal(typeof twill.aspect, "function");
        test.done();
    },

    "exposes an unweave method": function (test) {
        var twill = require("../lib/twill");
        test.equal(typeof twill.unweave, "function");
        test.done();
    }
};
