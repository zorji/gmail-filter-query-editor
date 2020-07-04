import { And, From, HasAttachment, Or, Subject, serialise } from './GmailQuery'

describe('GmailQuery', () => {

  it('should generate query correctly', () => {

    const node = Or(
      And(From('account@strata1.com'), HasAttachment()),
      And(From('account@strata2.com'), HasAttachment()),
      And(
        Or(
          From('noreply@strata3.com'),
          From('account@strata3.com'),
        ),
        Subject('Levy'),
        HasAttachment(),
      ),
      And(
        From('noreply@internet.co'),
        Subject('Invoice'),
      ),
      And(From('donotreply@reates.govt'), HasAttachment()),
    )

    expect(serialise(node))
      .toEqual('((from:(account@strata1.com) AND has:attachment) OR (from:(account@strata2.com) AND has:attachment) OR ((from:(noreply@strata3.com) OR from:(account@strata3.com)) AND subject:(Levy) AND has:attachment) OR (from:(noreply@internet.co) AND subject:(Invoice)) OR (from:(donotreply@reates.govt) AND has:attachment))')

  })

})
