import silo from './node_modules/pane-viewer/index.mjs'
const {config}=silo
config.state=
{
	r:0,
	g:0,
	b:0,
	a:1,
	mode:'rgba',
	value:'#000',
	type:'color-picker'
}
export default silo