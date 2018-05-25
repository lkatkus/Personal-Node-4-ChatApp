const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should return a message object', () => {
        let message = generateMessage('From', 'Some text');

        expect(message).toMatchObject({from:'From', text:'Some text'});
        expect(typeof message.createdAt).toBe('number');

    })
})

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        let message = generateLocationMessage('From', 111, 222);

        expect(message).toMatchObject({from:'From', url:'https://www.google.com/maps?q=111,222'});
        expect(typeof message.createdAt).toBe('number');
    })
})