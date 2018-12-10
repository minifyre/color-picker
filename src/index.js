import silo from './node_modules/silo/index.js'
import truth from './node_modules/truth/truth.mjs'
import v from './node_modules/v/v.mjs'

const {config,util,logic,output,input}=silo

export default silo(async function color(url='/node_modules/color-picker/')
{
	const
	[css]=await util.importFiles([url+'index.css'])
	config.css=css

	customElements.define('color-picker',color.picker)
	//@todo use util.mkCustomEl
})
color.picker=class extends silo.customElement
{
	constructor(state={})
	{
		super(state,silo)
	}
	static get observedAttributes()
	{
		return ['value']
	}
	get value()
	{
		return ''+this.state.file.value//don't return the proxy
	}
	set value(value)
	{
		let type=logic.colorType(value)
		if(!type) value='#000',type='hex'
		const [r,g,b,a]=logic[type+'2rgba'](value)
		Object.assign(this.state.file,{r,g,b,a,value})
		return value
	}
}