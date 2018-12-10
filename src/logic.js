logic.colorType=function(txt)
{
	const color=txt.toLowerCase().replace(/, /g,',')
	if(/^#/.test(color))
	{
		const
		types=
		{
			4:'hex',
			5:'hexa',
			7:'hheexx',
			9:'hheexxaa'
		},
		valid=color
		.slice(1)
		.toLowerCase()
		.split('')
		.every(char=>/[0-9a-f]/.test(char))
		return (valid&&types[color.length])||false		
	}
	//@todo simplify by validating css fn & then figuring out what type
	return	/^rgb\((\d{1,3}%?,\s?){2}\d+\)$/.test(color)?'rgb':
			/^rgba\((\d{1,3}%?,\s?){3}(1|0?\.\d+)\)$/.test(color)?'rgba':
			/^hsl\((\d{1,3}%?,\s?){2}\d+\)$/.test(color)?'hsl':
			/^hsla\((\d{1,3}%?,\s?){3}(1|0?\.\d+)\)$/.test(color)?'hsla':
			//@todo cmyk can have an opacity value as well
			color==='black'?'named':
			//@todo find a better way to detect named colors (is there a way to get the css list programatically?)
			logic.namedColor2rgba().join('')!=='0001'?'named':
			false
	//@todo cmyk,hwb,hsb,hsv
}
logic.namedColor2rgba=function(fillStyle)
{
	const//@todo find a way to allow this on node JS without a giant list
	can=Object.assign(document.createElement('canvas'),{height:1,width:1}),
	ctx=Object.assign(can.getContext('2d'),{fillStyle})
	ctx.fillRect(0,0,1,1)
	const [r,g,b,a]=ctx.getImageData(0,0,1,1).data
	return [r,g,b,a/255]
}
//hex codes
logic.hex2rgba=hex=>logic.hexa2rgba(hex+'f')
logic.hexa2rgba=hexa=>logic.hheexxaa2rgba('#'+hexa.slice(1).split('').map(c=>c+c).join(''))
logic.hheexx2rgba=hheexx=>logic.hheexxaa2rgba(hheexx+'ff')
logic.hheexxaa2rgba=function(hheexxaa)
{
	const [r,g,b,a]=hheexxaa.slice(1).match(/.{2}/g).map(c=>parseInt(c,16))
	return [r,g,b,a/255]
}
//css functions
logic.cmyk2rgba=function(cmyk)
{
	const cmykArr=util.cssFn2arr(cmyk)
	if(cmykArr.length===4) cmykArr.push(100)
	const [c,m,y,k,a]=cmykArr.map(x=>x/100)
	return [...[c,m,y].map(x=>Math.round(255-((Math.min(1,x*(1-k)+k))*255))),a]
}
logic.hsl2rgba=hsl=>logic.hsla2rgba(hsl.replace(/\(/,'a(').replace(/\)/,',1'))
logic.hsla2rgba=function(hsla)
{
	const 
	[h,s,l,a]=util.cssFn2arr(hsla),
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
logic.rgb2rgba=rgb=>[...util.cssFn2arr(rgb),1]
logic.rgba2rgba=rgba=>util.cssFn2arr(rgba)
logic.rgba2hexStr=function(r,g,b,a=1)
{
	a=Math.round(a*255)
	const
	dec=a===255?[r,g,b]:[r,g,b,a],//omit unecessary alpha
	hex=dec
	.map(num=>num.toString(16))
	.map(str=>['00','0',''][str.length]+str),//pad string
	shorten=hex.map(x=>x.split('')).every(([a,b])=>a===b)
	return '#'+(shorten?hex.map(x=>x[0]):hex).join('')
}
logic.hslaStr=(h,s,l,a=1)=>`hsla(${h},${s}%,${l}%,${a})`
logic.rgba2rgbStr=(r,g,b,a=1)=>`rgba(${r},${g},${b},${a})`
logic.rgba2hslStr=(...args)=>logic.hslaStr(...logic.rgba2hsla(...args))
logic.rgba2hwbaStr=function(r,g,b,a=1)
{
	r/=255
	g/=255
	b/=255
	const
	[max,min]=[Math.max,Math.min].map(fn([r,g,b])),
	diff=max-min,
	tmp=diff===0?0:
		r===max?((g-b)/diff):
		g===max?(((b-r)/diff)+2):
				(((r-g)/diff)+4)
	return `hwba(${[(tmp%6)*360,min,1-max,a].join(',')})`
}
logic.rgba2cmykStr=function(r,g,b,a=1)
{
	const
	max=Math.max(r,g,b)/255,
	k=1-max,
	[c,m,y]=k===1?[0,0,0]:[r,g,b].map(x=>y=(1-(x/255)-k)/(1-k)),
	arr=a===1?[c,m,y,k]:[c,m,y,k,a]
	return `cmyk(${arr.join(',')})`
}
logic.hwba2rgba=function(h,w,b,a=1)
{
	const
	sum=w+b,
	[r,g,blue]=logic.hsla2rgba(h,1,0.50).map(x=>x/255)
	if(sum>1) [w,b]=[w,b].map(x=>parseFloat((x/sum).toFixed(2)))
	return [...[r,g,blue].map(x=>((x*(1-w-b))+w)*255),a]
}

logic.hexToHsl=hex=>logic.rgb2hsl(logic.hex2rgb(hex))
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