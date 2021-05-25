/**
 * Stuff we add to the express request object.
 * Note that neither TS/Express will enforce that this is actually done.
 */

declare namespace Express {
  import type { Poll } from '../../src/poll'

  interface Request {
    id: string
    poller: Poll
  }
}