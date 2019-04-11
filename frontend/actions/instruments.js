import DjangoURL from '../middleware/api'
import { getAction, createAction, updateAction, deleteAction } from './helpers'

export function getInstruments(token) {
  const api = DjangoURL(token)
  return getAction('INSTRUMENTS', api.v1.music.instruments())
}

export function createInstrument(token, name) {
  const api = DjangoURL(token)
  return createAction('INSTRUMENT', api.v1.music.instruments(), { name })
}

export function updateInstrument(token, id, name) {
  const api = DjangoURL(token)
  return updateAction('INSTRUMENT', api.v1.music.instruments(id), { name })
}

export function deleteInstrument(token, id) {
  const api = DjangoURL(token)
  return deleteAction('INSTRUMENT', api.v1.music.instruments(id), id)
}
