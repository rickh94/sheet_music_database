import { combineReducers } from 'redux'
import account from './account'
import tags from './tags'
import composers from './composers'

const stuff = combineReducers({account, tags, composers})

export default stuff
