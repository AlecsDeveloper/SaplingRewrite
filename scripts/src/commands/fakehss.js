import { require, module } from 'BPM/.js'

const TYPES = ['fortress','monument','outpost','hut'];
const hssType = {
	fortress: 'fhssNether',
	monument: 'fhssOverworld',
	outpost: 'fhssOverworld',
	hut: 'fhssOverworld'
}, hssComp = {
	fortress: [1,1],
	monument: [1,0],
	outpost: [2,0],
	hut: [3,0]
}

async function Main() {
	// Modules
	const Slash = await require('@slash::Slash');
	const { NBT, World } = await require('@core');
	//const { hssArea } = await require('@sapling');
	await require('@colors')
	// Code
	Slash.Register({
		type: 'simple',
		name: 'hss',
		callback: function(client, args) {
			const L = module.exports['LANG'][NBT.getData('lang')];
			let { option, type, x, y, z } = {
				option: args[0].toLowerCase(),
				type: args[1].toLowerCase(),
				x: args[2] != '' ? Number(args[2]) : null,
				y: args[3] != '' ? Number(args[3]) : null,
				z: args[4] != '' ? Number(args[4]) : null
			}
			if (option == 'create') {
				// Check args
				if (!TYPES.includes(type)) return World.ephemeral(L['invalidValue'].red, client);
				else if ([x,y,z].includes(null)) return World.ephemeral(L['invalidValue'].red, client);
				// Check hss's 
				let coords = [x,y,z].join('/');
				let hssOb = JSON.parse(NBT.getData(hssType[type]));
				if (hssOb[coords]) return World.ephemeral('Already created'.yellow, client);
				// Set hss
				hssOb[coords] = hssComp[type];
				NBT.setData(hssType[type], JSON.stringify(hssOb));
				World.ephemeral(`${type} hss created at ${coords}`.gray, client);
			} else if (option == 'remove') {
				// Check args
				if (!TYPES.includes(type)) return World.ephemeral(L['invalidValue'].red, client);
				else if ([x,y,z].includes(null)) return World.ephemeral(L['invalidValue'].red, client);
				// Check hss's 
				let coords = [x,y,z].join('/');
				let hssOb = JSON.parse(NBT.getData(hssType[type]));
				if (!hssOb[coords]) return World.ephemeral('It\'s not created'.yellow, client);
				// Set hss
				delete hssOb[coords];
				NBT.setData(hssType[type], JSON.stringify(hssOb));
				World.ephemeral(`${type} hss deleted at ${coords}`.gray, client);
			} else if (option == 'list') {
				// Check args
				if (!TYPES.includes(type)) return World.ephemeral(L['invalidValue'].red, client);
				// Check hss's 
				let hssOb = JSON.parse(NBT.getData(hssType[type]));
				// Get hss
				let txt = '';
				for (let x in hssOb) {
					if (hssOb[x] == type) txt += `§q${x.split('/').join(' ')} §rhss type: ${type}\n`;
				}
				if (txt == '') World.ephemeral(L['notData'].gray, client);
				else World.ephemeral(`§3Fake HSS List \n${txt.trim()}`, client);
			}
		}
	});
};

Main();