import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withAlert } from 'react-alert'

import Container from 'react-bulma-components/lib/components/container'
import Box from 'react-bulma-components/lib/components/box'
import Level from 'react-bulma-components/lib/components/level'
import Heading from 'react-bulma-components/lib/components/heading'
import Modal from 'react-bulma-components/lib/components/modal'
import Button from 'react-bulma-components/lib/components/button'
import { Field, Control } from 'react-bulma-components/lib/components/form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FilePond } from 'react-filepond'

import 'filepond/dist/filepond.css'

import Header from '../Header'
import TextFieldWithErrors from '../TextFieldWithErrors'
import { sheets } from '../../actions'
import { getDataOrLogIn } from '../../helpers'
import FieldWithErrors from '../FieldWithErrors'
import ListItem from '../ListItem'
import alertText from '../../middleware/alertText'

export class Sheets extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
      createMode: false,
      newSheetFilename: '',
      newSheetFormat: '',
      newSheetType: '',
      newSheetFile: null
    }
  }

  static propTypes = {
    token: PropTypes.string,
    history: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired,
    sheets: PropTypes.object.isRequired,
    getSheets: PropTypes.func.isRequired,
    createSheet: PropTypes.func.isRequired,
    deleteSheet: PropTypes.func.isRequired
  }

  componentDidMount() {
    getDataOrLogIn(
      this.props.token,
      this.props.alert,
      this.props.history,
      this.props.getSheets,
      'Sheets'
    )
  }

  clearForm = () => {
    this.setState({
      newSheetFilename: '',
      newSheetFormat: '',
      newSheetType: '',
      newSheetFile: null
    })
  }

  handleSubmit = async e => {
    e.preventDefault()
    if (!this.state.newSheetFilename) {
      this.setState({ errors: { filename: 'File name is required' } })
      return
    }
    if (this.state.newSheetFile === null) {
      this.setState({ errors: { sheet_file: 'File is required' } })
      return
    }
    this.setState({ errors: {} })
    const newSheet = {
      filename: this.state.newSheetFilename,
      file_format: this.state.newSheetFormat,
      sheet_type: this.state.newSheetType,
      sheet_file: this.state.newSheetFile
    }
    const success = await this.props.createSheet(this.props.token, newSheet)
    if (success) {
      this.clearForm()
      this.setState({ createMode: false })
      this.props.alert.show(alertText('Sheet Created'))
    } else {
      this.setState({ errors: { ...this.props.sheets.errors } })
      this.props.alert.show(alertText('Sheet Creation Failed'), { type: 'error' })
    }
  }

  render() {
    const sheetList = this.props.sheets.list
    const { newSheetFilename, newSheetFormat, newSheetType, errors } = this.state
    const { token } = this.props
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Box className="margin-default">
            <Level>
              <Heading size={3} className="absolutely-no-margin level-item level-left">
                Sheets
              </Heading>
              <a
                style={{ verticalAlign: 'top' }}
                id="activate-create"
                className="level-item level-right edit-link"
                onClick={() => this.setState({ createMode: true })}
              >
                <FontAwesomeIcon icon="plus" style={{ paddingRight: '0.2rem' }} />{' '}
                Create
              </a>
            </Level>
            {sheetList.map(sheet => (
              <ListItem
                link="sheets"
                item={{ name: sheet.filename, id: sheet.id }}
                key={sheet.id}
                deleteCallback={id => this.props.deleteSheet(token, id)}
                errors={this.state.errors[sheet.id]}
              />
            ))}
          </Box>
        </Container>
        <Modal
          show={this.state.createMode}
          onClose={() => this.setState({ creatMode: false })}
          closeOnBlur
        >
          <Modal.Content>
            <Box>
              <Heading size={4} className="absolutely-no-margin little-padding-bottom">
                New Sheet
              </Heading>
              <form>
                {/* <TextFieldWithErrors
                  type="text"
                  label="File Name"
                  placeholder="file.pdf"
                  onChange={e => this.setState({ newSheetFilename: e.target.value })}
                  error={errors.filename}
                  value={newSheetFilename || ''}
                /> */}
                <TextFieldWithErrors
                  type="text"
                  label="File format"
                  placeholder="PDF"
                  onChange={e => this.setState({ newSheetFormat: e.target.value })}
                  error={errors.file_format}
                  value={newSheetFormat || ''}
                />
                <TextFieldWithErrors
                  type="text"
                  label="Sheet Type"
                  placeholder="part"
                  onChange={e => this.setState({ newSheetType: e.target.value })}
                  error={errors.sheet_type}
                  value={newSheetType || ''}
                />
                <FieldWithErrors label="File" error={errors.sheet_file}>
                  <FilePond
                    file={this.state.newSheetFile}
                    allowMultiple={false}
                    onupdatefiles={fileItems => {
                      this.setState({ newSheetFilename: fileItems[0].filename })
                      this.setState({ newSheetFile: fileItems[0].file })
                    }}
                  />
                </FieldWithErrors>
                <Field type="group">
                  <Control>
                    <Button type="primary" color="primary" onClick={this.handleSubmit}>
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        this.clearForm()
                        this.setState({ createMode: false })
                      }}
                    >
                      Cancel
                    </Button>
                  </Control>
                </Field>
              </form>
            </Box>
          </Modal.Content>
        </Modal>
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
    getSheets: token => {
      return dispatch(sheets.getSheets(token))
    },
    createSheet: (token, name) => {
      return dispatch(sheets.createSheet(token, name))
    },
    deleteSheet: (token, id) => {
      return dispatch(sheets.deleteSheet(token, id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert(Sheets))
