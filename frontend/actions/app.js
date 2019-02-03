import DjangoURL from '../middleware/api'

export const login = (email, password, remember) => {
  return async dispatch => {
    dispatch({
      type: 'LOGIN'
    })
    try {
      const api = new DjangoURL()
      const res = await api.v1.auth.login.post({ email, password })
      if (remember) {
        localStorage.setItem('token', res.data.token)
      }
      dispatch({
        type: 'LOGIN_SUCCESSFUL',
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAILED',
        payload: err.response.data
      })
    }
  }
}
