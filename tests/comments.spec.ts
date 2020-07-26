import * as Chai  from 'chai'
import Comments   from '@other/comment'

// Comments tests

describe('#Comments', function () {
    // Checking if the comment is the excepted result.
    it('Should return correct comment', function () {
        Chai.expect(Comments.generate('Quark lang', 'Transpiler')).to.equal('/*//////////////////////////////////////\n               Quark lang               \n               Transpiler               \n//////////////////////////////////////*/')
    })
})
