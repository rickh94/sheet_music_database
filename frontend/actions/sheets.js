import DjangoURL from '../middleware/api'
import { getAction, updateAction, createAction, deleteAction } from './helpers'

export function getSheets(token) {
  const api = DjangoURL(token)
  return getAction('SHEETS', api.v1.music.sheets())
}

export function getSheet(token, id) {
  const api = DjangoURL(token)
  return getAction('SHEET', api.v1.music.sheets(id))
}

export function createSheet(token, sheet) {
  const api = DjangoURL(token)
  const data = new FormData()
  data.append('filename', sheet.filename)
  data.append('file_format', sheet.file_format)
  data.append('sheet_type', sheet.sheet_type)
  data.append('sheet_file', sheet.sheet_file)
  return createAction('SHEET', api.v1.music.sheets(), data, {
    'Content-Type': 'multipart/form-data'
  })
}

export function updateSheet(token, id, updatedFields) {
  const api = DjangoURL(token)
  const data = new FormData()
  Object.entries(updatedFields).forEach(entry => {
    const [key, val] = entry
    data.append(key, val)
  })
  return updateAction('SHEET', api.v1.music.sheets(id), data, {
    'Content-Type': 'multipart/form-data'
  })
}

export function updateSingleSheet(token, id, updatedFields) {
  const api = DjangoURL(token)
  const data = new FormData()
  Object.entries(updatedFields).forEach(entry => {
    const [key, val] = entry
    data.append(key, val)
  })
  return updateAction('SINGLE_SHEET', api.v1.music.sheets(id), data, {
    'Content-Type': 'multipart/form-data'
  })
}

export function deleteSheet(token, id) {
  const api = DjangoURL(token)
  return deleteAction('SHEET', api.v1.music.sheets(id), id)
}
