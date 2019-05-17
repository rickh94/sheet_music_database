import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Button from 'react-bulma-components/lib/components/button'
import { Field } from 'react-bulma-components/lib/components/form'
import Level from 'react-bulma-components/lib/components/level'

import DatePicker from 'react-datepicker'

import TextFieldWithErrors from '../TextFieldWithErrors'

import './FieldDisplay.scss'
import FieldWithErrors from '../FieldWithErrors/FieldWithErrors'

export default class FieldDisplay extends Component {
  state = { newValue: '' }

  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string.isRequired,
    saveCallback: PropTypes.func,
    backendFieldName: PropTypes.string.isRequired,
    errors: PropTypes.any,
    linkTo: PropTypes.string,
    type: PropTypes.string
  }

  componentDidMount() {
    this.setState({ newValue: this.props.value })
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props
    if (oldProps.value != newProps.value) {
      this.setState({ newValue: newProps.value })
    }
  }

  render() {
    const { edit, newValue, errors } = this.state
    let displayValue = this.props.value
    if (this.props.type === 'date') {
      const date = new Date(this.props.value)
      displayValue = date.toLocaleDateString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    const valueEl = this.props.linkTo ? (
      <Link to={this.props.linkTo} className="field-link">
        {displayValue}
      </Link>
    ) : (
      displayValue
    )
    return (
      <div style={{ ...this.props.style, paddingBottom: '0.8rem' }}>
        {this.props.label && <strong>{this.props.label}</strong>}
        <Level>
          {this.state.edit ? (
            <React.Fragment>
              {this.props.type === 'date' ? (
                <FieldWithErrors error={errors}>
                  <DatePicker
                    utcOffset={0}
                    selected={new Date(newValue)}
                    onChange={date => this.setState({ newValue: date })}
                    showYearDropdown
                    showMonthDropdown
                  />
                </FieldWithErrors>
              ) : (
                <TextFieldWithErrors
                  type="text"
                  value={newValue}
                  onChange={e => this.setState({ newValue: e.target.value })}
                  error={errors}
                  name=""
                  inputClass="field-display-input"
                  className="level-item level-left is-4 is-grouped"
                />
              )}
              <Field type="group" className="level-item level-left">
                <Button
                  onClick={() => {
                    this.props.saveCallback(this.props.backendFieldName, newValue)
                    this.setState({ edit: false })
                  }}
                  color="primary"
                  style={{ verticalAlign: 'top' }}
                >
                  Save
                </Button>
                <Button
                  onClick={() =>
                    this.setState({ edit: false, newValue: this.props.value })
                  }
                  style={{ marginLeft: '0.3vw' }}
                  color="danger"
                >
                  Cancel
                </Button>
              </Field>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className={'level-item level-left is-2'}>
                {valueEl}
                {this.props.saveCallback && (
                  <a
                    className="edit-link"
                    onClick={() => this.setState({ edit: true })}
                    style={{ marginLeft: '0.3rem' }}
                  >
                    edit
                  </a>
                )}
              </div>
            </React.Fragment>
          )}
        </Level>
      </div>
    )
  }
}
