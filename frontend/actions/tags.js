import DjangoURL from '../middleware/api'
import { getAction, createAction , updateAction, deleteAction} from './helpers'

export function getTags(token) {
  const api = DjangoURL(token)
  return getAction('TAGS', api.v1.music.tags())
}

export function createTag(token, name) {
  const api = DjangoURL(token)
  return createAction('TAG', api.v1.music.tags(), {name})
}

export function updateTag(token, id, name) {
  const api = DjangoURL(token)
  return updateAction('TAG', api.v1.music.tags(id), {name})
}

export function deleteTag(token, id) {
  const api = DjangoURL(token)
  return deleteAction('TAG', api.v1.music.tags(id), id)
}
