import silo from './input.mjs'
import v from './node_modules/v/v.mjs'
const
{config,input,logic,util}=silo,
output=function output(editor)
{
	const
	{r,b,g,a}=editor.state,
	color=util.color.rgba(r,g,b,a),
	update=evt=>input(evt,editor),
	props=(value,max=255)=>({min:0,max,value,on:{input:update}})
	return [v('style',{},silo.config.css),
		v('fieldset',{},
			v('legend',{style:`background-color:${color};`},color),
			output.slider('Red',props(r),util.gradientR(r,g,b,a)),
			output.slider('Green',props(g),util.gradientG(r,g,b,a)),
			output.slider('Blue',props(b),util.gradientB(r,g,b,a)),
			output.slider('Alpha',props(a,100),util.gradientA(r,g,b,a)),
		)
	]
}
silo.output=output
silo.v=v
output.render=function(picker)//@todo make this more performant!
{
	const newDom=output(picker)
	v.flatUpdate(picker.shadowRoot,newDom,picker.dom)
	this.dom=newDom
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


output.slider=function(label,opts,style)
{
	const
	props=Object.assign({min:0,max:100,value:50},opts),
	name=label[0].toLowerCase()
	return v('.row',{},
		v('label',{},label),
		v('button',{},'-'),
		v('span.gradient',{style},
			v('input',{...props,data:{name},type:'range'})
		),
		v('button',{},'+'),
		v('input',{...props,data:{name},type:'number'})
	)
}
export default silo