import React from 'react'

export default function alertText(text) {
  return <span className={'alert-text'}>{text}</span>
}

export const messages = {
  notLoggedIn: alertText('Please log in')
}
