import React from 'react'
import PropTypes from 'prop-types'
import {
  Field,
  Label,
  Input,
  Help,
  Control
} from 'react-bulma-components/lib/components/form'

function TextFieldWithErrors(props) {
  return (
    <Field>
      <Label>{props.label}</Label>
      <Control>
        <Input
          type={props.type}
          placeholder={props.placeholder}
          value={props.value}
          onChange={e => props.onChange(e, props.name)}
          color={props.error ? 'danger' : null}
        />
      </Control>
      {props.error && <Help color="danger">{props.error}</Help>}
    </Field>
  )
}

TextFieldWithErrors.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.any,
  name: PropTypes.string.isRequired,
}

export default TextFieldWithErrors
