import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Heading from 'react-bulma-components/lib/components/heading'
import DatePicker from 'react-datepicker'
import { Field, Control } from 'react-bulma-components/lib/components/form'
import Button from 'react-bulma-components/lib/components/button'
import TextFieldWithErrors from '../TextFieldWithErrors'
import FieldWithErrors from '../FieldWithErrors/FieldWithErrors'

export default class ComposerForm extends Component {
  static propTypes = {
    errors: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    id: PropTypes.number
  }

  state = {
    name: null,
    era: null,
    shortName: null,
    born: null,
    died: null
  }

  render() {
    const { errors, id } = this.props
    const { name, era, shortName, born, died } = this.state
    return (
      <form>
        <Heading className="absolutely-no-margin little-padding-bottom" size={3}>
          {id ? 'Edit Composer' : 'Create Composer'}
        </Heading>
        <TextFieldWithErrors
          type="text"
          label="Name"
          placeholder="Name..."
          onChange={e => this.setState({ name: e.target.value })}
          error={errors.name}
          value={name || ''}
        />
        <TextFieldWithErrors
          type="text"
          label="Era"
          placeholder="Era..."
          onChange={e => this.setState({ era: e.target.value })}
          error={errors.era}
          value={era || ''}
        />
        <TextFieldWithErrors
          type="text"
          label="Shortened Name"
          placeholder="Short Name"
          onChange={e => this.setState({ shortName: e.target.value })}
          error={errors.short_name}
          value={shortName || ''}
        />
        <FieldWithErrors label="Birth Date" error={errors.born}>
          <DatePicker
            selected={born}
            onChange={date => this.setState({ born: date })}
            showYearDropdown
            showMonthDropdown
          />
        </FieldWithErrors>
        <FieldWithErrors label="Death Date" error={errors.died}>
          <DatePicker
            selected={died}
            onChange={date => this.setState({ died: date })}
            showYearDropdown
            showMonthDropdown
          />
        </FieldWithErrors>
        <Field type="group">
          <Control>
            <Button
              type="primary"
              color="primary"
              onClick={e => {
                e.preventDefault()
                this.props.onSubmit(id, { name, era, shortName, born, died })
              }}
            >
              Submit
            </Button>
            <Button onClick={this.props.onCancel} color="danger">
              Cancel
            </Button>
          </Control>
        </Field>
      </form>
    )
  }
}
