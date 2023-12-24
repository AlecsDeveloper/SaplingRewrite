import * as mc from '@minecraft/server'
import { require } from 'BPM/.js'

(async () => {
	// Modules
	const { NBT, Event } = await require('@core');
	const { Particle } = await require('@sapling');
	// Code
	let DATA = new Map();

	Event.follow('before/explosion', (ev) => {
		// Get blocks 
		let blocks = ev.getImpactedBlocks();
		// * tntNotExplodes & tntNoDrops
		if (NBT.getData('tntNotExplodes')) return ev.cancel = true;
		if (NBT.getData('tntNoDrops')) {
			blocks.forEach((loc) => {
				mc.system.run(() => {
					ev.dimension.getBlock(loc).setType('minecraft:air');
				});
			});
			return ev.setImpactedBlocks([]);
		}
		
		/* tntBlocks */
		if (NBT.getData('tntBlocks')) {
			blocks.forEach((loc) => {
				mc.system.run(() => {
					const { x, y, z } = loc;
					let dim = ev.dimension;
					dim.runCommand(`execute positioned ${x} ${y} ${z} run particle sa:blockX ~0.5 ~0.5 ~`)
					dim.runCommand(`execute positioned ${x} ${y} ${z} run particle sa:blockX ~-0.5 ~0.5 ~`)
					dim.runCommand(`execute positioned ${x} ${y} ${z} run particle sa:blockY ~ ~ ~`);
					dim.runCommand(`execute positioned ${x} ${y} ${z} run particle sa:blockY ~ ~1 ~`);
					dim.runCommand(`execute positioned ${x} ${y} ${z} run particle sa:blockZ ~ ~0.5 ~0.5`)
					dim.runCommand(`execute positioned ${x} ${y} ${z} run particle sa:blockZ ~ ~0.5 ~-0.5`)
				});
			});
		}
		
		/* tntDropAllBlocks & tntDropIce */
		let tntDrop = NBT.getData('tntDropAllBlocks');
		let tntIce = NBT.getData('tntDropIce');
		
		if (tntDrop && tntIce) {
			blocks.forEach((loc) => {
				const block = ev.dimension.getBlock(loc);
				let key = createKey(block);
				if (DATA.has(key)) return;
				else DATA.set(key, block);
			});
			
			ev.setImpactedBlocks([]);
		} else if (tntDrop) {
			let ice = [];
			blocks.forEach((loc) => {
				const block = ev.dimension.getBlock(loc);
				
				if (block.typeId.includes('ice')) ice.push(loc);
				else {
					let key = createKey(block);
					if (DATA.has(key)) return;
					else DATA.set(key, block);
				}
			});
			
			ev.setImpactedBlocks(ice);
		} else if (tntIce) {
			let tnt = [];
			blocks.forEach((loc) => {
				const block = ev.dimension.getBlock(loc);
				if (!block.typeId.includes('ice')) tnt.push(loc);
				else {
					let key = createKey(block);
					if (DATA.has(key)) return;
					else DATA.set(key, block);
				}
			});
			
			ev.setImpactedBlocks(tnt);
		}
	});
	
	mc.system.runInterval(() => {
		if (DATA.size == 0) return;
		DATA.forEach(async (b, key) => {
			let block = DATA.get(key);
			
			try {
				if (block.typeId == 'minecraft:tnt') {
					let { x, y, z, dimension } = block;
					let dim = dimension.id.replace('minecraft:', '');
					block.dimension.runCommand(`execute in ${dim} run summon tnt ${x} ${y} ${z}`);
				} else {
					let item = new mc.ItemStack(block.typeId, 1);
					block.dimension.spawnItem(item, block.location);
				}
			} catch {}
			
			DATA.delete(key);
			block.setType('minecraft:air');
		});
	}, 1);
	
	function createKey(block) {
		const { x, y, z, dimension } = block;
		let dim = dimension.id.replace('minecraft:','');
		// key
		return `${dim}:${x}/${y}/${z}`;
	}
	
	function vec3(x,y,z) {
		return { x, y, z }
	}
})();