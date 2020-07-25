"use strict";
/*//////////////////////////////////////
               Quark lang
                Comments
//////////////////////////////////////*/
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var Comments = /** @class */ (function () {
    function Comments() {
    }
    /**
     * @private
     * @static
     *
     * @name        set_trails_length
     * @description Set trails length
     * @author      NessMC
     */
    Comments.set_trails_length = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.correct_text), _c = _b.next(); !_c.done; _c = _b.next()) {
                var line = _c.value;
                if (((line.length * this.coefficient - line.length) / 2) % 1 ===
                    0) {
                    this.trails_length.push(line.length * this.coefficient);
                }
                else {
                    this.trails_length.push(line.length * this.coefficient + 1);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.trails_length = Math.max.apply(Math, __spread(this.trails_length));
    };
    /**
     * @private
     * @static
     *
     * @name        set_space_length
     * @description Set space length
     * @author      NessMC
     */
    Comments.set_space_length = function () {
        var e_2, _a;
        try {
            for (var _b = __values(this.correct_text), _c = _b.next(); !_c.done; _c = _b.next()) {
                var line = _c.value;
                if (((this.trails_length - line.length) / 2) % 1 === 0) {
                    this.space_length.push((this.trails_length - line.length) / 2);
                }
                else {
                    this.space_length.push((this.trails_length - line.length + 1) / 2);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    /**
     * @public
     * @static
     *
     * @name        generate
     * @description Generate comment
     * @author      NessMC
     */
    Comments.generate = function () {
        var _this = this;
        var text = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            text[_i] = arguments[_i];
        }
        this.correct_text = text.filter(function (x) {
            return x.length % 2 === text[0].length % 2 ? x.length : '';
        });
        this.set_trails_length();
        this.set_space_length();
        var trails_content = __spread(this.trails_start).concat(new Array(this.trails_length - 3).fill('/')), space_content = this.correct_text.map(function (x, index) {
            return new Array(_this.space_length[index]).fill(' ');
        }), text_content = this.correct_text.map(function (x, index) {
            return space_content[index]
                .join('')
                .concat(x)
                .concat(space_content[index].join(''));
        }), result = trails_content.join('') +
            '\n' +
            text_content.join('\n') +
            '\n' +
            trails_content.reverse().join('');
        return result;
    };
    Comments.correct_text = [];
    Comments.coefficient = 4;
    Comments.trails_start = '/*/';
    Comments.trails_length = [];
    Comments.space_length = [];
    return Comments;
}());
exports["default"] = Comments;
