import {messages} from './middleware/alertText'

export function getDataOrLogIn(token, alert, history, getFunction, nameInMessage) {
  if (!token) {
    alert.show(messages.notLoggedIn, { type: 'error' })
    history.push('/login')
  } else {
    const success = getFunction(token)
    if (!success) {
      alert.show(...messages.couldNotGet(nameInMessage))
    }
  }
}
