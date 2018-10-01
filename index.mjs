import silo from './output.mjs'
import truth from './node_modules/truth/truth.mjs'
const {config,input,logic,output,util}=silo

export default async function color(url='/node_modules/color-picker/')
{
	const
	[css]=await util.importFiles([url+'index.css'])
	config.css=css
	console.log(silo)

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
		//@todo copy resize observer from code-editor & integrate it here
	}
}