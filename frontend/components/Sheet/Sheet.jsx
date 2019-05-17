import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withAlert } from 'react-alert'
import { connect } from 'react-redux'
import FileDownload from 'js-file-download'

import Container from 'react-bulma-components/lib/components/container'
import Box from 'react-bulma-components/lib/components/box'
import Level from 'react-bulma-components/lib/components/level'
import Heading from 'react-bulma-components/lib/components/heading'
import Button from 'react-bulma-components/lib/components/button'
import { FilePond } from 'react-filepond'

import 'filepond/dist/filepond.css'

import { sheets } from '../../actions'
import { getDataOrLogIn } from '../../helpers'
import Header from '../Header'
import FieldDisplay from '../FieldDisplay'
import FieldWithErrors from '../FieldWithErrors'
import Axios from 'axios'

export class Sheet extends Component {
  static propTypes = {
    token: PropTypes.string,
    alert: PropTypes.object.isRequired,
    sheets: PropTypes.object.isRequired,
    getSheet: PropTypes.func.isRequired,
    updateSingleSheet: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { errors: {}, changeFileMode: false, newFileName: '' }
  }

  componentDidMount() {
    getDataOrLogIn(
      this.props.token,
      this.props.alert,
      this.props.history,
      this.props.getSheet,
      'Sheet',
      [this.props.match.params.id]
    )
  }

  updateFromFieldDisplay = async (fieldName, value) => {
    this.updateFields({ [fieldName]: value })
  }

  updateFields = async updated => {
    const { id } = this.props.match.params
    const success = await this.props.updateSingleSheet(this.props.token, id, updated)
    if (!success) {
      this.setState({ errors: this.props.sheets.errors })
    } else {
      this.setState({ changeFileMode: false })
    }
  }

  render() {
    const { filename, file_format, sheet_type, sheet_file } = this.props.sheets.sheet
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Box className="margin-default">
            <Heading size={3} className="absolutely-no-margin level-left">
              {filename}
            </Heading>
            <FieldDisplay
              value={file_format || ''}
              saveCallback={this.updateFromFieldDisplay}
              backendFieldName="file_format"
              label="File Format"
              errors={this.state.errors.file_format}
            />
            <FieldDisplay
              value={sheet_type || ''}
              saveCallback={this.updateFromFieldDisplay}
              backendFieldName="sheet_type"
              label="Type"
              errors={this.state.errors.sheet_type}
            />
            {this.state.changeFileMode ? (
              <FieldWithErrors label="File" error={this.state.errors.sheet_file}>
                <FilePond
                  file={this.file}
                  allowMultiple={false}
                  onupdatefiles={fileItems => {
                    this.file = fileItems[0]
                  }}
                />
                <Button
                  type="primary"
                  color="primary"
                  onClick={() => {
                    this.updateFields({
                      sheet_file: this.file.file,
                      filename: this.file.filename
                    })
                  }}
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    this.file = null
                    this.setState({ changeFileMode: false })
                  }}
                >
                  Cancel
                </Button>
              </FieldWithErrors>
            ) : (
              <Level>
                <a href={sheet_file}>
                  <Button color="primary">Download File</Button>
                </a>
                <Button
                  color="danger"
                  onClick={() => {
                    this.setState({ changeFileMode: true })
                  }}
                >
                  Change File
                </Button>
              </Level>
            )}
          </Box>
        </Container>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    token: state.account.token,
    sheets: state.sheets
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateSingleSheet: (token, id, updated) => {
      return dispatch(sheets.updateSingleSheet(token, id, updated))
    },
    getSheet: (token, id) => {
      return dispatch(sheets.getSheet(token, id))
    },
    deleteSheet: (token, id) => {
      return dispatch(sheets.deleteSheet(token, id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert(Sheet))
