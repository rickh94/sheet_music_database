import React from 'react'
import PropTypes from 'prop-types'
import {
  Field,
  Label,
  Input,
  Help,
  Control
} from 'react-bulma-components/lib/components/form'
import FieldWithErrors from '../FieldWithErrors/FieldWithErrors'

function TextFieldWithErrors(props) {
  return (
    <FieldWithErrors
      className={props.className}
      label={props.label}
      error={props.error}
    >
      <Input
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={e => props.onChange(e, props.name)}
        color={props.error ? 'danger' : null}
        className={`is-expanded ${props.inputClass}`}
      />
    </FieldWithErrors>
  )
}

TextFieldWithErrors.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.any,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  group: PropTypes.bool,
  className: PropTypes.string,
  inputClass: PropTypes.string
}

export default TextFieldWithErrors
