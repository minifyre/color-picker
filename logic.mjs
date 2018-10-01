import config from './config.mjs'
import util from './util.mjs'
const silo={config,util}
silo.logic=function(opts)
{
	return Object.assign({},config.state,opts)
}
const {config,logic,util}=silo

export default silo