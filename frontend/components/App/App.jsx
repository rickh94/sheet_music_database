import React, { Component } from 'react'
import APICall from '../../scratch/api'

export default class App extends Component {
  async componentDidMount() {
    const api = new APICall()
    const res = await api.v1.auth.login.post({ email: 'fredericmhenry@gmail.com', password: 'this is a test' })
    const authApi = new APICall(res.data.token)
    await authApi.v1.music.composers().post({name: 'Test', era:'test'})
    const composer1 = await authApi.v1.music.composers(1).get()
    console.log(composer1.data)

  }
  render() {
    return (
      <div>
        <h1>I am an app</h1>
      </div>
    )
  }
}
