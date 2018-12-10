util.elAttrs2Nums=(el,attrs)=>attrs.split(',').map(attr=>parseFloat(el.getAttribute(attr))),
util.numWithinRange=(min,val,max)=>Math.max(min,Math.min(max,val))

util.color={}
util.color.rgba=(r,g,b,a)=>`rgba(${[r,g,b,a].join(',')})`
const {rgba}=util.color

util.gradientR=(r,g,b,a)=>[rgba(0,g,b,a),rgba(255,g,b,a)]
util.gradientG=(r,g,b,a)=>[rgba(r,0,b,a),rgba(r,255,b,a)]
util.gradientB=(r,g,b,a)=>[rgba(r,g,0,a),rgba(r,g,255,a)]
util.gradientA=(r,g,b,a)=>[rgba(r,g,b,0),rgba(r,g,b,100)]

util.evt2customEl=({path})=>path.find(x=>(x.tagName||'').match('-'))

util.cssFn2arr=function(txt)
{
	return txt
	.replace(/^\w+\(/,'')
	.replace(/\)$/,'')
	.replace(/%/g,'')
	.split(/, */g)
	.map(num=>parseFloat(num))
}