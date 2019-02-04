import React from 'react'
import '../setupTests'
import alertText from './alertText';

describe('alertText', () => {
  it('returns the correct jsx', () => {
    expect(alertText('test text')).toEqual(<span className={'alert-text'}>test text</span>)
  })
})
