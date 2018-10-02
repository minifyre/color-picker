import silo from './input.mjs'
import v from './node_modules/v/v.mjs'
const
{config,input,logic,util}=silo,
output=function output(editor)
{
	const
	{r,b,g,a}=editor.state,
	color=util.color.rgba(r,g,b,a/100),
	update=evt=>input(evt,editor),
	props=(value,max=255)=>({min:0,max,value,on:{input:update}})
	return [v('style',{},silo.config.css),
		v('fieldset',{},
			v('legend',{style:`background-color:${color};`},color),
			output.slider('Red',props(r)),
			output.slider('Green',props(g)),
			output.slider('Blue',props(b)),
			output.slider('Alpha',props(a,100)),
		)
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
		util[fn](r,g,b,a).forEach((color,i)=>gradient.addColorStop(i,color))
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
*/


output.slider=function(label,opts)
{
	const
	props=Object.assign({min:0,max:100,value:50},opts),
	name=label[0].toLowerCase()
	return v('.row',{},
		v('label',{},label),
		v('button',{},'-'),
		v('span.gradient',{},
			v('canvas',{data:{name},height:1,width:255}),
			v('input',{...props,data:{name},type:'range'})
		),
		v('button',{},'+'),
		v('input',{...props,data:{name},type:'number'})
	)
}
export default silo