import config from './config.mjs'
import util from './util.mjs'
function logic(opts)
{
	return Object.assign({},config.state,opts)
}
const silo={config,logic,util}

logic.rgba2hexa=(...args)=>'#'+args.map(num=>num.toString(16)).join('')

export default silo