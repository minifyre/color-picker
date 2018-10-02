import silo from './logic.mjs'
silo.input=function(evt,picker)
{
	//default event hanlder
	picker.state[evt.target.getAttribute('data-name')]=evt.target.value
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



	console.log(inc,max,min,oldVal,newVal)
	if(oldVal!==newVal) editor.state[type]=newVal
	//@todo how is this a string?
	console.log(editor.state)
}
export default silo