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

export function logout(token, all = false) {
  return async dispatch => {
    dispatch({
      type: 'LOGOUT'
    })
    try {
      const api = new DjangoURL(token)
      if (all) {
        await api.v1.auth.logoutall.post()
      } else {
        await api.v1.auth.logout.post()
      }
      localStorage.removeItem('token')
      dispatch({
        type: 'LOGOUT_SUCCESSFUL'
      })
      return true
    } catch (err) {
      dispatch({
        type: 'LOGOUT_FAILED',
        payload: err.response.data
      })
      return false
    }
  }
}

export function getProfile(token, all = false) {
  return async dispatch => {
    dispatch({
      type: 'PROFILE'
    })
    try {
      const api = new DjangoURL(token)
      const res = await api.v1.auth.user.get()
      dispatch({
        type: 'PROFILE_GET_SUCCESSFUL',
        payload: res.data
      })
      return true
    } catch (err) {
      dispatch({
        type: 'PROFILE_GET_FAILED',
        payload: err.response.data
      })
      return false
    }
  }
}

export function updateProfile(token, data) {
  return async dispatch => {
    dispatch({
      type: 'PROFILE'
    })
    try {
      const api = new DjangoURL(token)
      const res = await api.v1.auth.user.patch(data)
      dispatch({
        type: 'PROFILE_UPDATE_SUCCESSFUL',
        payload: res.data
      })
      return true
    } catch (err) {
      dispatch({
        type: 'PROFILE_UPDATE_FAILED',
        payload: err.response.data
      })
      return false
    }
  }
}

export function changePassword(token, new_password1, new_password2) {
  return async dispatch => {
    dispatch({ type: 'CHANGE_PASSWORD' })
    try {
      const api = new DjangoURL(token)
      await api.v1.auth.password.change.post({ new_password1, new_password2 })
      dispatch({
        type: 'CHANGE_PASSWORD_SUCCESSFUL'
      })
      return true
    } catch (err) {
      dispatch({
        type: 'CHANGE_PASSWORD_FAILED',
        payload: err.response.data
      })
      return false
    }
  }
}
