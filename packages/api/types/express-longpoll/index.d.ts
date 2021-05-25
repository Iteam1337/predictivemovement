declare module 'express-longpoll' {

import type Express from 'express'

interface Longpoll {
  create: (path: string) => void,
  publish: (path: string, payload: Object) => void
}

export default function lp(app: Express, config: Object): Longpoll

}