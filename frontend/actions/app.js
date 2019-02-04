import DjangoURL from '../middleware/api'

export function login(email, password, remember) {
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
      return true
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAILED',
        payload: err.response.data
      })
      return false
    }
  }
}

export function register(email, password1, password2, remember) {
  return async dispatch => {
    dispatch({
      type: 'REGISTER'
    })
    try {
      const api = new DjangoURL()
      const res = await api.v1.auth.registration.post({ email, password1, password2 })
      if (remember) {
        localStorage.setItem('token', res.data.token)
      }
      dispatch({
        type: 'REGISTER_SUCCESSFUL',
        payload: res.data
      })
      return true
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAILED',
        payload: err.response.data
      })
      return false
    }
  }
}