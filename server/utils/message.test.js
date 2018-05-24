const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should return a message object', () => {
        let message = generateMessage('From', 'Some text');

        expect(message).toMatchObject({from:'From', text:'Some text'});
        expect(typeof message.createdAt).toBe('number');

    })
})