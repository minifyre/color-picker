silo.input=function(evt,picker)
{
	//default event hanlder
	picker.state.file[evt.target.getAttribute('data-name')]=parseFloat(evt.target.value)
}
input.selectColor=function(evt)
{
	const
	editor=evt.path.find(x=>(x.tagName||'').toLowerCase()==='color-picker'),
	value=evt.target.innerHTML,
	type='change'
	editor.state.file.value=value
	editor.dispatchEvent(new CustomEvent(type,{type,detail:{value}}))
}
input.increment=function(evt)
{//@todo fix bug where 0 displays as one in [type=number]
	let timer
	const
	{path,target}=evt,
	type=target.getAttribute('data-name'),
	[direction,sensativity]=util.elAttrs2Nums(target,'value,data-sensativity'),
	range=target.parentElement.querySelector('[type="range"]'),
	editor=path.find(x=>(x.tagName||'').toLowerCase()==='color-picker'),
	update=function()
	{
		const
		[max,min,inc,oldVal]=util.elAttrs2Nums(range,'max,min,step,value'),
		newVal=util.numWithinRange(min,oldVal+(inc*direction),max)
		//@todo tiny numbers (e.g. 0.01 break this & the decimal places)
		if(oldVal!==newVal) editor.state.file[type]=newVal
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