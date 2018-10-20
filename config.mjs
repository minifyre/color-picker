import silo from './node_modules/pane-viewer/index.mjs'
const {config}=silo
config.state=
{
	file:
	{
		r:0,
		g:0,
		b:0,
		a:1,
		value:'#000'
	},
	view:
	{
		mode:'rgba',
		type:'color-picker'
	}
}
export default silo