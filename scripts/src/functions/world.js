import * as mc from '@minecraft/server'
import { require } from 'BPM/.js'

(async () => {
	// Modules 
	const { NBT, Event, World } = await require('@core');
	// Code
	
	/* renewableSoulSand */
	let mobs = [
		'zombie',
		'skeleton',
		'stray',
		'enderman'
	].join('&');
	
	Event.follow(`die::${mobs}`, (ev) => {
		if (!NBT.getData('renewableSoulSand')) return;
		else if (!['fireTick','fire'].includes(ev.damageSource.cause)) return;
		ev.deadEntity.runCommandAsync('execute if block ~~-1~ sand run setblock ~~-1~ soul_sand [] replace');
	});
	
	/* world features */
	mc.system.runInterval(() => {
		// database
		World.command('run::function Sapling/database');
		// features
		if (NBT.getData('endPortalGBD')) World.command('run::function Sapling/gbd');
		if (NBT.getData('pigmansFarmWarts')) World.command('run::execute at @e[type=zombie_pigman] if block ~~1~ nether_wart ["age": 3] run setblock ~~1~ nether_wart destroy');
	}, 3);
	
	mc.system.runInterval(() => {
		if (!NBT.getData('ravagerDestroyCherryLeaves')) return;
		let over = mc.world.getDimension('overworld');
		let ravagers = over.getEntities({ type: 'minecraft:ravager' });
	
		ravagers.forEach((e) => {
			const { location, dimension } = e;
			let x = location.x - 1;
			let y = location.y;
			let z = location.z - 1;
			
			for (let i=0; i<3; i++) {
				for (let j=0; j<3; j++) {
					for (let k=0; k<3; k++) {
						replaceBlock(x+j, y+i, z+k, dimension);
					}
				}
			}
		});
	}, 2);
	
	
	// Functions
	function replaceBlock(x, y, z, d) {
		let loc = new mc.Vector(x, y, z);
		let b = d.getBlock(loc);
		if (b.typeId == 'minecraft:cherry_leaves') {
			b.setType('minecraft:air');
		}
	}
})();