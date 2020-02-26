### How do you do things regularly on a timer?

Example:
When we simulate new bookings or cars moving we use `Stream.interval(1000)` but we know that this blocks the caller, meaning we can't have 2 or more intervals running at the same time.

How do we manage this:

- do we use Flow somehow to manage them?
- do we use Task async to spawn a task for every interval
- other options
