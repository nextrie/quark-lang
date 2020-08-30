/*//////////////////////////////////////
               Quark lang
              Comment test
//////////////////////////////////////*/

import * as Chai from 'chai';
import Comments from 'other/comment';
import commentContent from 'tests/content/comment.content';

// Comments tests

describe('#Comments', () => {
  // Checking if the comment is the excepted result.
  it('Should return correct comment', () => {
    Chai.expect(Comments.generate('Quark lang', 'Transpiler')).to.equal(
      commentContent,
    );
  });
});
