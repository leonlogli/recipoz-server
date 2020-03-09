import Agenda from 'agenda'

import { HELLO_WORLD } from '../constants'

const helloWorld = (agenda: Agenda) => {
  agenda.define(HELLO_WORLD, (_job: Agenda.Job) => {
    console.log('Hello world Job!')
  })
}

export { helloWorld }
