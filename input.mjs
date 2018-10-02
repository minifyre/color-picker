import silo from './logic.mjs'
silo.input=function(evt,picker)
{
	//default event hanlder
	picker.state[evt.target.getAttribute('data-name')]=parseFloat(evt.target.value)
}
const {config,input,logic,util}=silo


input.increment=function(evt)
{
	const
	{path,target}=evt,
	type=target.getAttribute('data-name'),
	[inc]=util.elAttrs2Nums(target,'value'),
	range=target.parentElement.querySelector('[type="range"]'),
	[max,min,oldVal]=util.elAttrs2Nums(range,'max,min,value'),
	newVal=util.numWithinRange(min,oldVal+inc,max),
	editor=path.find(x=>(x.tagName||'').toLowerCase()==='color-picker')
	if(oldVal!==newVal) editor.state[type]=newVal
}
export default silo