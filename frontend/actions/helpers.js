export function getAction(name, api) {
  return async dispatch => {
    dispatch({ type: `GET_${name}` })
    try {
      const res = await api.get()
      dispatch({
        type: `GET_${name}_SUCCESSFUL`,
        payload: res.data
      })
      return true
    } catch (err) {
      dispatch({
        type: `GET_${name}_FAILED`,
        payload: err.response.data
      })
      return false
    }
  }
}

export function createAction(name, api, item, headers = {}) {
  return async dispatch => {
    dispatch({ type: `CREATE_${name}` })
    try {
      const res = await api.post(item, {headers})
      dispatch({
        type: `CREATE_${name}_SUCCESSFUL`,
        payload: res.data
      })
      return true
    } catch (err) {
      dispatch({
        type: `CREATE_${name}_FAILED`,
        payload: err.response.data
      })
      return false
    }
  }
}

export function updateAction(name, api, item) {
  return async dispatch => {
    dispatch({ type: `UPDATE_${name}` })
    try {
      const res = await api.patch(item)
      dispatch({
        type: `UPDATE_${name}_SUCCESSFUL`,
        payload: res.data
      })
      return true
    } catch (err) {
      dispatch({
        type: `UPDATE_${name}_FAILED`,
        payload: err.response.data
      })
      return false
    }
  }
}

export function deleteAction(name, api, id) {
  return async dispatch => {
    dispatch({ type: `DELETE_${name}` })
    try {
      const res = await api.delete()
      dispatch({
        type: `DELETE_${name}_SUCCESSFUL`,
        payload: id
      })
      return true
    } catch (err) {
      dispatch({
        type: `DELETE_${name}_FAILED`,
        payload: err.response.data
      })
      return false
    }
  }
}
