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
    <Field className={props.className}>
      {props.label && <Label>{props.label}</Label>}
      <Control className="is-expanded">
        <Input
          type={props.type}
          placeholder={props.placeholder}
          value={props.value}
          onChange={e => props.onChange(e, props.name)}
          color={props.error ? 'danger' : null}
          className={`is-expanded ${props.inputClass}`}
        />
      </Control>
      {props.error && <Help color="danger">{props.error}</Help>}
    </Field>
  )
}

TextFieldWithErrors.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.any,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  group: PropTypes.bool,
  className: PropTypes.string,
  inputClass: PropTypes.string
}

export default TextFieldWithErrors
