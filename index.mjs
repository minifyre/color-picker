import silo from './output.mjs'
import truth from './node_modules/truth/truth.mjs'
const {config,input,logic,output,util,v}=silo

export default async function color(url='/node_modules/color-picker/')
{
	const
	[css]=await util.importFiles([url+'index.css'])
	config.css=css

	customElements.define('color-picker',color.picker)
}
Object.assign(color,{config,input,logic,output,util})
color.picker=class extends HTMLElement
{
	constructor(state={})
	{
		super()
		const
		shadow=this.attachShadow({mode:'open'}),
		initalState=logic(state)
		let renderer=x=>x
		this.state=truth(initalState,(...args)=>renderer(args))
		this.dom=output(this)
		v.flatUpdate(shadow,this.dom)
		renderer=()=>output.render(this)
	}
	static get observedAttributes()
	{
		return ['value']
	}
	get value()
	{
		return ''+this.state.value//don't return the proxy
	}
	set value(value)
	{
		let type=logic.colorType(value)
		if(!type) value='#000',type='hex'
		const [r,g,b,a]=logic[type+'2rgba'](value)
		Object.assign(this.state,{r,g,b,a,value})
		return value
	}
}