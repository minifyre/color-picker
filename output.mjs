import silo from './input.mjs'
import v from './node_modules/v/v.mjs'
silo.output=function(state)
{
	return [v('style',{},silo.config.css),
		v('fieldset',{},
			v('legend',{},'rgba'),
			output.slider('Red',{min:0,max:255,value:153}),
			output.slider('Green',{min:0,max:255,value:153}),
			output.slider('Blue',{min:0,max:255,value:153}),
			output.slider('Alpha',{min:0,max:100,value:100}),
		)
	]
}

silo.v=v

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

const {config,input,logic,output,util}=silo

output.slider=function(label,opts)
{
	const props=Object.assign({min:0,max:100,value:50},opts)
	return v('.row',{},
		v('label',{},label),
		v('button',{},'-'),
		v('input',{...props,type:'range'}),
		v('button',{},'+'),
		v('input',{...props,type:'number'})
	)
}
output.render=function()
{
	
}

export default silo