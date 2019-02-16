import React from 'react'
import PropTypes from 'prop-types'

export default function ItalicLink(props) {
  return (
    <a
      className={`${props.className} italic-link`}
      onClick={e => {
        e.preventDefault()
        props.onClick()
      }}
      style={props.style}
    >
      {props.children}
    </a>
  )
}

ItalicLink.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired
}
