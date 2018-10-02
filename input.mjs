import silo from './logic.mjs'
silo.input=function(evt,picker)
{
	//default event hanlder
	picker.state[evt.target.getAttribute('data-name')]=parseFloat(evt.target.value)
}
const {config,input,logic,util}=silo


input.increment=function(evt)
{//@todo fix bug where 0 displays as one in [type=number]
	const
	{path,target}=evt,
	type=target.getAttribute('data-name'),
	[inc]=util.elAttrs2Nums(target,'value'),
	range=target.parentElement.querySelector('[type="range"]'),
	editor=path.find(x=>(x.tagName||'').toLowerCase()==='color-picker'),
	updateUntilRelease=function()
	{
		const
		[max,min,oldVal]=util.elAttrs2Nums(range,'max,min,value'),
		newVal=util.numWithinRange(min,oldVal+inc,max)
		if(oldVal!==newVal) editor.state[type]=newVal
	}
	updateUntilRelease()
}
export default silo