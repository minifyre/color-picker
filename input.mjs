import silo from './logic.mjs'
silo.input=function(evt,picker)
{
	//default event hanlder
	picker.state[evt.target.getAttribute('data-name')]=evt.target.value
}
const {config,input,logic,util}=silo

export default silo