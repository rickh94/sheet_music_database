import { combineReducers } from 'redux'
import account from './account'
import tags from './tags'
import composers from './composers'
import instruments from './instruments'
import sheets from './sheets'

const stuff = combineReducers({account, tags, composers, instruments, sheets})

export default stuff
