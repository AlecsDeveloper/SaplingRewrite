import { require, module } from 'BPM/.js'

const HSS = module.exports['Hss'];

const HsaTypes = {
	netherfortress: 'NetherFortress',
	swamphut: 'SwampHut',
	pillageroutpost: 'PillagerOutpost',
	oceanmonument: 'OceanMonument'
}

const DimTypes = {
	nether: 'minecraft:nether',
	the_end: 'minecraft:the_end',
	overworld: 'minecraft:overworld'
}


async function Main() {
	// Modules
	const { NBT, World } = await require('@core');
	const { Slash } = await require('@slash');
	//const { HSA } = await requite('@sapling');
	const { MyDB } = await require('@mysql');
	await require('@colors');
	// Code
	/* Database */
	for (let x in HSS) {
		HSS[x] = new MyDB(x);
	}
	/* Command */
	Slash.Register({
		type: 'simple',
		name: 'hss',
		callback: function(client, args) {
			// Lang
			const L = module.exports['LANG'][NBT.getData('lang')];
			// Command
			let [op, a, b, c, d, e] = args;
			if (!op) return World.ephemeral(L['invalidValue'].red, client);
			
			let option = op.toLowerCase();
			switch (option) {
				case 'create':
					// Data
					let { x, y, z, dm, ht } = {
						x: a != '' ? Number(a) : null,
						y: b != '' ? Number(b) : null,
						z: c != '' ? Number(c) : null,
						dm: DimTypes[d.toLowerCase()],
						ht: HsaTypes[e.toLowerCase()]
					}
					// Closures
					if ([x,y,z,dm,ht].includes(null)) return World.ephemeral(L['invalidValue'].red, client);
					// Option
					let data = [x,y,z,dm].join('/');
					let key = genKey();
					
										
					if (HSS['SwampHut'].values().includes(data)) return World.ephemeral('Already created'.yellow, client);
					else if (HSS['NetherFortress'].values().includes(data)) return World.ephemeral('Already created'.yellow, client);
					else if (HSS['PillagerOutpost'].values().includes(data)) return World.ephemeral('Already created'.yellow, client);
					else if (HSS['OceanMonument'].values().includes(data)) return World.ephemeral('Already created'.yellow, client);
					else HSS[ht].set(key, data);
					
					World.ephemeral(`${ht} hss §a[${key}]`.gray + ` created at ${data.split('/').join(' ')}`.gray, client);
					break;
				
				case 'remove': 
					// Closures
					if (!a) return World.ephemeral(L['invalidValue'].red, client);
					// Option
					if (HSS['SwampHut'].has(a)) {
						HSS['SwampHut'].remove(a);
						World.ephemeral(`[${a}]`.green + ' hss deleted'.gray, client);
					} else if (HSS['NetherFortress'].has(a)) {
						HSS['NetherFortress'].remove(a);
						World.ephemeral(`[${a}]`.green + ' hss deleted'.gray, client);
					} else if (HSS['PillagerOutpost'].has(a)) {
						HSS['PillagerOutpost'].remove(a);
						World.ephemeral(`[${a}]`.green + ' hss deleted'.gray, client);
					} else if (HSS['OceanMonument'].has(a)) {
						HSS['OceanMonument'].remove(a);
						World.ephemeral(`[${a}]`.green + ' hss deleted'.gray, client);
					} else {
						World.ephemeral(`§7hss §e${a} §7not found`, client);
					}
					
					break;
					
				case 'list':
					let txt = '';
					
					for (let x in HSS) {
						for (let h of HSS[x].keys()) {
							txt += `§¶§7  - §e[${h}] §7${HSS[x].get(h).split('/').join(' ')} §s(${x})\n`;
						}
					}
					
					World.print('§qFake hss list:')
					World.print(txt.trim());
					break;
				
			}
		}
	});
	
	// Functions
	function genKey() {
		let chars = '123456789abcdefg';
		let c = Array(8)
			.fill('')
			.map(_ => chars[Math.floor(Math.random() * chars.length)]);
		let r = c.join('');
		return r;
	}
}

Main();