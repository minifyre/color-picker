import silo from './input.mjs'
const
{config,input,logic,util}=silo,
{v}=util
output=function output(editor)
{
	const
	{r,b,g,a}=editor.state,
	//@todo simplify
	rgba=logic.rgba2rgbStr(r,g,b,a),
	hexa=logic.rgba2hexStr(r,g,b,a),
	hsla=logic.rgba2hslStr(r,g,b,a),
	update=evt=>input(evt,editor),
	//@todo adjusting the slider is not always updating the color previews
	props=(value,opts)=>(Object.assign({min:0,max:255,step:1,value,on:{input:update}},opts))
	return [v('style',{},silo.config.css),
		v('.tabs',{},
			...['hexa','hsla','rgba']
			.map(x=>v('button.tab',{class:editor.state.mode===x?'active':''},x))
		),
		v('div',{},
			output.slider('Red',props(r)),
			output.slider('Green',props(g)),
			output.slider('Blue',props(b)),
			output.slider('Alpha',props(a,{max:1,step:0.01})),
		),
		...[hexa,hsla,rgba]
		.map(function(color)
		{
			const style=`background-color:${color};`
			return v('output',{style,on:{pointerup:input.selectColor}},color)
		})
	]
}
output.render=function(picker)
{
	const newDom=output(picker)
	v.flatUpdate(picker.shadowRoot,newDom,picker.dom)
	this.dom=newDom

	//@todo make this more performant! & integrate directly into v
	const
	{r,g,b,a}=picker.state,
	tmp=[...picker.shadowRoot.querySelectorAll('canvas')]
	.forEach(function(canvas)
	{
		const
		ctx=canvas.getContext('2d'),
		color=canvas.getAttribute('data-name'),
		fn=`gradient${color.toUpperCase()}`,
		gradient=ctx.createLinearGradient(0,0,255,1)
		util[fn](r,g,b,a).forEach((color,i)=>gradient.addColorStop(i,color))
		ctx.fillStyle=gradient
		ctx.clearRect(0,0,255,1)
		ctx.fillRect(0,0,255,1)
	})
}


output.slider=function(legend,opts)
{
	const
	name=legend[0].toLowerCase(),
	rangeProps=Object.assign({min:0,max:100,step:1,value:50},opts),
	btnProps={data:{name,sensativity:150},on:{pointerdown:input.increment}},
	width=rangeProps.max
	return v('fieldset',{},
		v('legend',{},legend),
		v('.row',{},
			v('button',{...btnProps,value:-1},'-'),
			v('span.gradient',{},
				v('canvas',{data:{name},height:1,width}),
				v('input',{...rangeProps,data:{name},type:'range'})
			),
			v('button',{...btnProps,value:1},'+'),
			v('input',{...rangeProps,data:{name},type:'number'})
		)
	)
}
export default Object.assign(silo,{output})