import { combineReducers } from 'redux'
import account from './account'
import tags from './tags'
import composers from './composers'
import instruments from './instruments'

const stuff = combineReducers({account, tags, composers, instruments})

export default stuff
