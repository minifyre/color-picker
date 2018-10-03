import config from './config.mjs'
import util from './util.mjs'
function logic(opts)
{
	return Object.assign({},config.state,opts)
}
const silo={config,logic,util}

logic.rgba2hexa=(...args)=>'#'+args.map(num=>num.toString(16)).join('')
logic.hslaStr=(h,s,l,a=1)=>`hsla(${h},${s}%,${l}%,${a})`,
logic.rgbaStr=(r,g,b,a=1)=>`rgba(${r},${g},${b},${a})`,
logic.hex2rgb=function(hex)
{
	//fcc to ffcccc
	if(hex.length===3) hex=hex.split('').map(char=>char+''+char).join('')
	//[r,g,b]
	return hex.match(/#?(.{2})(.{2})(.{2})/).slice(1).map(str=>parseInt(str,16))
}
logic.hexToHsl=hex=>logic.rgb2hsl(logic.hex2rgb(hex))
logic.rgba2hexa=(...args)=>'#'+args.map(num=>num.toString(16)).join('')
logic.rgba2hsla=function(r,g,b,a=1)
{
	r/=255
	g/=255
	b/=255

	const
	max=Math.max(r,g,b),
	min=Math.min(r,g,b),
	diff=max-min,
	sum=max+min,

	hue=min===max?0:
		r===max?((60*(g-b)/diff)+360)%360:
		g===max?(60*(b-r)/diff)+120:
				(60*(r-g)/diff)+240,

	lum=0.5*sum,

	sat=lum===0?0:
		lum===1?1:
		lum<=0.5?diff/sum:
		diff/(2-sum)

	return [...[hue,sat*100,lum*100].map(Math.round),a]
}
logic.hsl2rgb=function(h,s,l,a=1)
{
	const
	[hue,sat,lum]=[h/360,s/100,l/100],

	q=	lum<=.5?lum*(1+sat):
				lum+sat-(lum*sat),
	p=2*lum-q,
	rt=hue+(1/3),
	gt=hue,
	bt=hue-(1/3),

	[r,g,b]=
	[
		[rp,q,rt],
		[p,q,gt],
		[p,q,bt]
	]
	.map(logic.hue2rgb)
	.map(num=>num*255)
	.map(Math.round)

	return [r,g,b,a]
}
logic.hslToHex=(h,s,l)=>logic.rgb2hex(logic.hsl2rgb(h,s,l))
logic.hue2rgb=function(p,q,h)
{
	h+=	h<0?1:
		h>1?-1:
			0
	return	h*6<1?p+(q-p)*h*6:
			h*2<1?q:
			h*3<2?p+(q-p)*((2/3)-h)*6:
			p
}

export default silo