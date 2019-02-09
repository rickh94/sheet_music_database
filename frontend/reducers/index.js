import { combineReducers } from 'redux'
import account from './account'
import tags from './tags'

const stuff = combineReducers({account, tags})

export default stuff
