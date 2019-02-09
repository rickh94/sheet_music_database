import DjangoURL from '../middleware/api'

export function getTags(token) {
  return async dispatch => {
    dispatch({
      type: 'GET_TAGS'
    })
    try {
      const api = DjangoURL(token)
      const res = await api.v1.music.tags().get()
      dispatch({
        type: 'GET_TAGS_SUCCESSFUL',
        payload: res.data
      })
      return true
    } catch (err) {
      dispatch({
        type: 'GET_TAGS_FAILED',
        payload: err.response.data
      })
      return false
    }
  }
}

export function createTag(token, name) {
  return async dispatch => {
    dispatch({ type: 'CREATE_TAG' })
    try {
      const api = DjangoURL(token)
      const res = await api.v1.music.tags().post({ name })
      dispatch({
        type: 'CREATE_TAG_SUCCESSFUL',
        payload: res.data
      })
      return true
    } catch (err) {
      dispatch({
        type: 'CREATE_TAG_FAILED',
        payload: err.response.data
      })
      return false
    }
  }
}

export function updateTag(token, id, name) {
  return async dispatch => {
    dispatch({ type: 'UPDATE_TAG' })
    try {
      const api = DjangoURL(token)
      const res = await api.v1.music.tags(id).patch({ name })
      dispatch({
        type: 'UPDATE_TAG_SUCCESSFUL',
        payload: res.data
      })
      return true
    } catch (err) {
      dispatch({
        type: 'UPDATE_TAG_FAILED',
        payload: err.response.data
      })
      return false
    }
  }
}

export function deleteTag(token, id) {
  return async dispatch => {
    dispatch({ type: 'DELETE_TAG' })
    try {
      const api = DjangoURL(token)
      await api.v1.music.tags(id).delete()
      dispatch({
        type: 'DELETE_TAG_SUCCESSFUL',
        payload: id
      })
      return true
    } catch (err) {
      dispatch({
        type: 'DELETE_TAG_FAILED',
        payload: err.response.data
      })
      return false
    }
  }
}
