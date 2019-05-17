import React from 'react'

export default function alertText(text) {
  return <span className={'alert-text'}>{text}</span>
}


function couldNotGet(thing) {
  return [alertText(`Could not get ${thing}`), {type: 'error'}]
}

export const messages = {
  notLoggedIn: alertText('Please log in'),
  couldNotGet
}

