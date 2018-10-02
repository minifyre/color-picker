const util=
{
	id:()=>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,util.idHelper),
	idHelper:c=>(c^util.idRand()[0]&15>>c/4).toString(16),
	idRand:()=>crypto.getRandomValues(new Uint8Array(1)),

	importFiles:paths=>Promise.all(paths.map(x=>fetch(x).then(x=>x.text())))
}

util.elAttrs2Nums=(el,attrs)=>attrs.split(',').map(attr=>parseFloat(el.getAttribute(attr))),

util.color={}
util.color.rgba=(r,g,b,a)=>`rgba(${[r,g,b,a].join(',')})`
const {rgba}=util.color

util.gradientR=(r,g,b,a)=>[rgba(0,g,b,a),rgba(255,g,b,a)]
util.gradientG=(r,g,b,a)=>[rgba(r,0,b,a),rgba(r,255,b,a)]
util.gradientB=(r,g,b,a)=>[rgba(r,g,0,a),rgba(r,g,255,a)]
util.gradientA=(r,g,b,a)=>[rgba(r,g,b,0),rgba(r,g,b,100)]


export default util