import silo from './logic.mjs'
silo.input=function(evt,picker)
{
	//default event hanlder
	picker.state[evt.target.getAttribute('data-name')]=parseFloat(evt.target.value)
}
const {config,input,logic,util}=silo

input.selectColor=function(evt)
{
	const
	editor=evt.path.find(x=>(x.tagName||'').toLowerCase()==='color-picker'),
	value=evt.target.innerHTML,
	type='change'

	editor.dispatchEvent(new CustomEvent(type,{type,detail:{value}}))
}

input.increment=function(evt)
{//@todo fix bug where 0 displays as one in [type=number]
	let timer
	const
	{path,target}=evt,
	type=target.getAttribute('data-name'),
	[inc,sensativity]=util.elAttrs2Nums(target,'value,data-sensativity'),
	range=target.parentElement.querySelector('[type="range"]'),
	editor=path.find(x=>(x.tagName||'').toLowerCase()==='color-picker'),
	update=function()
	{
		const
		[max,min,oldVal]=util.elAttrs2Nums(range,'max,min,value'),
		newVal=util.numWithinRange(min,oldVal+inc,max)
		if(oldVal!==newVal) editor.state[type]=newVal
		timer=setTimeout(update,sensativity)
	},
	release=function()
	{
		target.removeEventListener('pionterup',release)
		target.removeEventListener('pointerout',release)
		clearTimeout(timer)
	}
	target.addEventListener('pointerout',release)
	target.addEventListener('pointerup',release)
	update()
}
export default silo