import EventEmitter from 'events'

// interface Config {
//   log?: (msg: any) => void
// }


/**
 * TODO:
 
  Logging:
    - .debug for all events that happen
    - .debug for all subscriptions

  Garbage collection:
    - calls to `for` "expire" eventually, the listener should be removed
 */

export class Poll {
  private ee: EventEmitter

  constructor(EE: EventEmitter) {
    this.ee = EE
  }

  /**
   * Return the latest message for a certain channel
   */
  for = (eventId: string) : Promise<any> => {
    return new Promise((resolve) => {
      this.ee.once(eventId, resolve)
    })
  }

  /**
   * Publish a message to the channel
   */
  publish = (eventId: string, payload: Object) => {
    this.ee.emit(eventId, payload)
  }
}

export default function longpoll() {
  const dispatcher = new EventEmitter()

  return new Poll(dispatcher)
}