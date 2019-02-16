import React from 'react'
import PropTypes from 'prop-types'

import { Field, Control, Label, Help } from 'react-bulma-components/lib/components/form'

export default function FieldWithErrors(props) {
  return (
    <Field className={props.className}>
      {props.label && <Label>{props.label}</Label>}
      <Control className="is-expanded">{props.children}</Control>
      {props.error && <Help color="danger">{props.error}</Help>}
    </Field>
  )
}

FieldWithErrors.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.any,
  error: PropTypes.any
}
