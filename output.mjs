import silo from './input.mjs'
import v from './node_modules/v/v.mjs'
const
{config,input,logic,util}=silo,
output=function output(editor)
{
	const
	{r,b,g,a}=editor.state,
	rgba=util.color.rgba(r,g,b,a/100),
	hexa=logic.rgba2hexaStr(r,g,b,Math.round(a*255/100)),
	hsla=logic.rgba2hslaStr(r,g,b,a/100),
	update=evt=>input(evt,editor),
	props=(value,max=255)=>({min:0,max,value,on:{input:update}})
	return [v('style',{},silo.config.css),
		v('.tabs',{},
			...['hexa','hsla','rgba']
			.map(x=>v('button.tab',{class:editor.state.mode===x?'active':''},x))
		),
		v('div',{},
			output.slider('Red',props(r)),
			output.slider('Green',props(g)),
			output.slider('Blue',props(b)),
			output.slider('Alpha',props(a,100)),
		),
		...[hexa,hsla,rgba]
		.map(function(color)
		{
			const style=`background-color:${color};`
			return v('output',{style,on:{pointerup:input.selectColor}},color)
		})
	]
}
silo.output=output
silo.v=v
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
		util[fn](r,g,b,a/100).forEach((color,i)=>gradient.addColorStop(i,color))
		ctx.fillStyle=gradient
		ctx.clearRect(0,0,255,1)
		ctx.fillRect(0,0,255,1)
	})
}
/*
named colors
#rgb
#rgba
#rrggbb
#rrggbbaa
rgb()
rgba()
hsl()
hsla()

[css4?](https://developer.mozilla.org/en-US/docs/Web/CSS/color#Specifications)
color()
cmyk()
hwb()

hsb
hsv
color schemes*/


output.slider=function(legend,opts)
{
	const
	name=legend[0].toLowerCase(),
	rangeProps=Object.assign({min:0,max:100,value:50},opts),
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
export default silo