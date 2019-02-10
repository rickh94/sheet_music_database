import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Button from 'react-bulma-components/lib/components/button'
import { Field } from 'react-bulma-components/lib/components/form'
import Level from 'react-bulma-components/lib/components/level'

import TextFieldWithErrors from '../TextFieldWithErrors'

import './FieldDisplay.scss'

export default class FieldDisplay extends Component {
  state = { newValue: '' }

  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string.isRequired,
    saveCallback: PropTypes.func.isRequired,
    backendFieldName: PropTypes.string.isRequired,
    errors: PropTypes.any,
    linkTo: PropTypes.string
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
    const valueEl = this.props.linkTo ? (
      <Link to={this.props.linkTo}>{this.props.value}</Link>
    ) : (
      this.props.value
    )
    return (
      <div style={{ ...this.props.style, paddingBottom: '0.8rem' }}>
        {this.props.label && <strong>{this.props.label}</strong>}
        <Level>
          {this.state.edit ? (
            <React.Fragment>
              <TextFieldWithErrors
                type="text"
                value={newValue}
                onChange={e => this.setState({ newValue: e.target.value })}
                error={errors}
                name=""
                inputClass="field-display-input"
                className="level-item level-left is-4 is-grouped"
              />
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
              <div className="level-item level-left is-2">
                {valueEl}
                <a
                  className="edit-link"
                  id="edit-first-name"
                  onClick={() => this.setState({ edit: true })}
                  style={{ marginLeft: '0.3rem' }}
                >
                  edit
                </a>
              </div>
            </React.Fragment>
          )}
        </Level>
      </div>
    )
  }
}
