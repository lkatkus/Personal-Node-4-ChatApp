const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString',() => {
    it('should reject non-string values',() => {
        let string = 123;
        expect(isRealString(string)).toBeFalsy();
    });

    it('should reject string with only spaces',() => {
        let string = '   ';
        expect(isRealString(string)).toBeFalsy();
    });

    it('should allow string with non-space charaters',() => {
        let string = '  herpas derpas  ';
        expect(isRealString(string)).toBeTruthy();
    });
})