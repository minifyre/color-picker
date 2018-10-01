import config from './config.mjs'
import util from './util.mjs'
function logic(opts)
{
	return Object.assign({},config.state,opts)
}
const silo={config,logic,util}

export default silo