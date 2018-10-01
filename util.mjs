const util=
{
	id:()=>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,util.idHelper),
	idHelper:c=>(c^util.idRand()[0]&15>>c/4).toString(16),
	idRand:()=>crypto.getRandomValues(new Uint8Array(1)),

	importFiles:paths=>Promise.all(paths.map(x=>fetch(x).then(x=>x.text())))
}
export default util