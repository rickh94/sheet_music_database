import React from 'react'
import '../setupTests'
import alertText, { messages } from './alertText'

describe('alertText', () => {
  it('returns the correct jsx', () => {
    expect(alertText('test text')).toEqual(
      <span className={'alert-text'}>test text</span>
    )
  })
})

describe('notLoggedIn', () => {
  it('returns a not logged in message', () => {
    expect(messages.notLoggedIn).toEqual(<span className='alert-text'>Please log in</span>)
  })
})
