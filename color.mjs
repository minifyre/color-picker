const
color=
{
	hslaStr:(h,s,l,a=1)=>`hsla(${h},${s}%,${l}%,${a})`,
	rgbaStr:(r,g,b,a=1)=>`rgba(${r},${g},${b},${a})`,
	hexToRgb:function(hex)
	{
		var c
		if (hex.length!==6)
		{ // expand the short hex by doubling each character,fc0 -> ffcc00
			hex=((function()
			{
				var j,len,results;
				results=[];
				for (j=0,len=hex.length; j < len; j++)
				{
					c=hex[j];
					results.push(`${c}${c}`);
				}
				return results;
			})()).join('');
		}
		color=hex.match(/#?(.{2})(.{2})(.{2})/).slice(1);
		return color=((function()
		{
			var j,len,results;
			results=[];
			for (j=0,len=color.length; j < len; j++)
			{
				c=color[j];
				results.push(parseInt(c,16));
			}
			return results;
		})()).concat([1]);
	},
	hexToHsl:function(hex)
	{
		return this.rgbToHsl(this.hexToRgb(hex));
	},
	rgbToHex:function(rgb)
	{
		var c,hex,i;
		if (typeof rgb==='string')
		{
			rgb=this.isRgb(rgb);
		}
		if (rgb)
		{
			hex=(function()
			{
				var j,len,ref,results;
				ref=rgb.slice(0,3);
				results=[];
				for (j=0,len=ref.length; j < len; j++)
				{
					c=ref[j];
					results.push(parseFloat(c).toString(16));
				}
				return results;
			})();
			hex=(function()
			{
				var j,len,results;
				results=[];
				for (j=0,len=hex.length; j < len; j++)
				{
					c=hex[j];
					if (c.length===1)
					{
						results.push(`0${c}`);
					}
					else
					{
						results.push(c);
					}
				}
				return results;
			})();
			hex=hex.join('');
			if (_.compact((function()
				{
					var j,len,ref,results;
					ref=hex.match(/.{1,2}/g);
					results=[];
					for (j=0,len=ref.length; j < len; j++)
					{
						i=ref[j];
						results.push(i[0]===i[1]);
					}
					return results;
				})()).length===3)
			{
				return `#${hex[0]}${hex[2]}${hex[4]}`;
			}
			else
			{
				return `#${hex}`;
			}
		}
	},
	rgbToHsl:function(rgb)
	{
		var a,add,b,diff,g,h,hue,l,lum,max,min,r,s,sat;
		if (typeof rgb==='string')
		{
			rgb=this.isRgb(rgb);
		}
		if (!rgb)
		{
			return false;
		}
		r=parseFloat(rgb[0]) / 255;
		g=parseFloat(rgb[1]) / 255;
		b=parseFloat(rgb[2]) / 255;
		max=Math.max(r,g,b);
		min=Math.min(r,g,b);
		diff=max - min;
		add=max + min;
		hue=min===max ? 0 :r===max ? ((60 * (g - b) / diff) + 360) % 360 :g===max ? (60 * (b - r) / diff) + 120 :(60 * (r - g) / diff) + 240;
		lum=0.5 * add;
		sat=lum===0 ? 0 :lum===1 ? 1 :lum <=0.5 ? diff / add :diff / (2 - add);
		h=Math.round(hue);
		s=Math.round(sat * 100);
		l=Math.round(lum * 100);
		a=parseFloat(rgb[3])||1;
		return [h,s,l,a];
	},
	hslToRgb:function(hsl)
	{
		var a,b,bt,g,gt,hue,lum,p,q,r,rt,sat;
		if (typeof hsl==='string')
		{
			hsl=this.isHsl(hsl);
		}
		if (!hsl)
		{
			return false;
		}
		hue=parseInt(hsl[0]) / 360;
		sat=parseInt(hsl[1]) / 100;
		lum=parseInt(hsl[2]) / 100;
		q=lum <=.5 ? lum * (1 + sat) :lum + sat - (lum * sat);
		p=2 * lum - q;
		rt=hue + (1 / 3);
		gt=hue;
		bt=hue - (1 / 3);
		r=Math.round(this.hueToRgb(p,q,rt) * 255);
		g=Math.round(this.hueToRgb(p,q,gt) * 255);
		b=Math.round(this.hueToRgb(p,q,bt) * 255);
		a=parseFloat(hsl[3])||1;
		return [r,g,b,a];
	},
	hslToHex:function(hsl)
	{
		if (typeof hsl==='string')
		{
			hsl=this.isHsl(hsl);
		}
		if (!hsl)
		{
			return false;
		}
		return this.rgbToHex(this.hslToRgb(hsl));
	},
	hueToRgb:function(p,q,h)
	{
		if (h < 0) h +=1
		if (h > 1) h -=1
		if ((h * 6) < 1) return p + (q - p) * h * 6
		else if ((h * 2) < 1) return q
		else if ((h * 3) < 2) return p + (q - p) * ((2 / 3) - h) * 6
		else return p
	}
}
export default color