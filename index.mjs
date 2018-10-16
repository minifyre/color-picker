import silo from './output.mjs'
const
{config,input,logic,output,util}=silo,
{truth,v}=util

export default async function color(url='/node_modules/color-picker/')
{
	const
	[css]=await util.importFiles([url+'index.css'])
	config.css=css

	customElements.define('color-picker',color.picker)
}
color.picker=class extends silo.viewer
{
	constructor(state={})
	{
		super()
		let renderer=x=>x
		this.state=truth(logic(state),(...args)=>renderer(args)).state
		this.render=renderer=v.render(this.shadowRoot,this,output)
		// this.dom=output(this)
		// v.flatUpdate(this.shadowRoot,this.dom)
		// renderer=()=>output.render(this)
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
Object.assign(color,silo,{picker:color.picker})