import DjangoURL from '../middleware/api'
import { getAction, createAction, updateAction, deleteAction } from './helpers'

export function getComposers(token) {
  const api = DjangoURL(token)
  return getAction('COMPOSERS', api.v1.music.composers())
}

export function getComposer(token, id) {
  const api = DjangoURL(token)
  return getAction('COMPOSER', api.v1.music.composers(id))
}

export function createComposer(token, composer) {
  const api = DjangoURL(token)
  return createAction('COMPOSER', api.v1.music.composers(), composer)
}

export function updateComposer(token, id, updatedFields) {
  const api = DjangoURL(token)
  return updateAction('COMPOSER', api.v1.music.composers(id), updatedFields)
}

export function updateSingleComposer(token, id, updatedFields) {
  const api = DjangoURL(token)
  return updateAction('SINGLE_COMPOSER', api.v1.music.composers(id), updatedFields)
}

export function deleteComposer(token, id) {
  const api = DjangoURL(token)
  return deleteAction('COMPOSER', api.v1.music.composers(id), id)
}
