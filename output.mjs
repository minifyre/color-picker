import silo from './input.mjs'
import v from './node_modules/v/v.mjs'
silo.output=function(state)
{
	//generate v-based dom here
}
silo.v=v
const {config,input,logic,output,util}=silo

export default silo