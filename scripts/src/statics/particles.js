import * as mc from '@minecraft/server'
import { require } from 'BPM/.js'

(async () => {
	// Modules
	const { NBT, ChunkData, Dimension } = await require('@core');
	const { Particle } = await require('@sapling');
	// Code
	mc.system.runInterval(() => {
		/* chunkBorders */
		if (NBT.getData('chunkBorders')) {
			const players = mc.world.getAllPlayers();
			players.forEach(player => {
				const cd = ChunkData(player.location);
				const { minX, maxX, minZ, maxZ } = cd;
	
				Particle.create(player, 'll:chunkm', vec3(minX-0.1, 0, minZ+7.98));
				Particle.create(player, 'll:chunkm', vec3(maxX+0.98, 0, maxZ-6.98));
				Particle.create(player, 'll:chunkp', vec3(minX+7.98, 0, minZ-0.001));
				Particle.create(player, 'll:chunkp', vec3(minX+7.98, 0, minZ+15.98));
			});
		}
		
		/* tpBoxes */
		if (NBT.getData('tpBoxes')) {
			const shulkers = Dimension.overworld.getEntities({ type: 'shulker' });
				shulkers.forEach(shulker => {
				const { x, y, z } = shulker.getHeadLocation();
				const a = Math.floor(y);
				Particle.create(shulker, 'sa:shulkerY', vec3(x, a+8.5, z));
				Particle.create(shulker, 'sa:shulkerY', vec3(x, a-8.5, z));
				Particle.create(shulker, 'sa:shulkerX', vec3(x+8.49, a, z));
				Particle.create(shulker, 'sa:shulkerX', vec3(x-8.49, a, z));
				Particle.create(shulker, 'sa:shulkerZ', vec3(x, a, z+8.49));
				Particle.create(shulker, 'sa:shulkerZ', vec3(x, a, z-8.49));
			});
		}
	}, 20);
	
	/* redstoneIndicator */
	mc.system.runInterval(() => {
		if (!NBT.getData('redstoneIndicator')) return;
	
		let redstoneKeys = new Map();
		let players = mc.world.getAllPlayers();
		
		players.forEach((player) => {
			let _block = player.getBlockFromViewDirection({ maxDistance: 10 });			
			if (!_block) return;
			let block = _block.block;
			
			let reds = genCoords(block.location, 2);
	
			reds.forEach((_) => {
				try {
					let dust = getBlock(_, block);
					if (dust.typeId != 'minecraft:redstone_wire') return;
					
					let key = rkey(dust.dimension, dust.location);
					if (redstoneKeys.has(key)) return;
					
					let signal = dust.permutation.getState('redstone_signal');
					let { x, y, z } = dust.location;
					Particle.dimension(key.split('/')[0], `sa:ss${signal}`, vec3(x, y+0.04, z));
					redstoneKeys.set(key, signal);
				} catch {};
			});
		});
	
	}, 1)
	
	/* slimeChunks & magmaChunks */
	mc.system.runInterval(() => {
		const slimeNbt = NBT.getData('slimeChunks');
	
		const chunksDB = new Map();
		const players = mc.world.getAllPlayers();
		
		/* get & set keys */
		players.forEach(user => {
			const { dimension } = user;
			if (dimension.id == 'minecraft:overworld' && !slimeNbt) return;
	
			const { x, z } = user.getHeadLocation();
			const m = ChunkData({ x, z });
			
			for (let i=0; i<10; i++) {
				for (let j=0; j<10; j++) {
					const c = ChunkData({ 
						x: m.minX + (15 * j),
						z: z - (15 * i)
					});
					if (!c.slime) continue;
					let k = ckey(dimension, c);
					if (chunksDB.has(k)) continue;
					else chunksDB.set(k,c);
				}
				for (let j=0; j<10; j++) {
					const c = ChunkData({ 
						x: m.minX - (15 * j),
						z: z - (15 * i)
					});
					if (!c.slime) continue;
					let k = ckey(dimension, c);
					if (chunksDB.has(k)) continue;
					else chunksDB.set(k,c);
				}
			}
			for (let i=0; i<10; i++) {
				for (let j=0; j<10; j++) {
					const c = ChunkData({ 
						x: m.minX + (15 * j),
						z: z + (15 * i)
					});
					if (!c.slime) continue;
					let k = ckey(dimension, c);
					if (chunksDB.has(k)) continue;
					else chunksDB.set(k,c);
				}
				for (let j=0; j<10; j++) {
					const c = ChunkData({ 
						x: m.minX + (15 * j),
						z: z - (15 * i)
					});
					if (!c.slime) continue;
					let k = ckey(dimension, c);
					if (chunksDB.has(k)) continue;
					else chunksDB.set(k,c);
				}
			}
		});
	
		/* create particles */
		const pt = {
			'overworld': ['ll:slime_side1','ll:slime_side2'],
		}
		try {
			chunksDB.forEach((c, key) => {
				let [dim] = key.split('/');
				let [side1, side2] = pt[dim];
	
				Particle.dimension(dim, side1, vec3(c.minX-0.1, 0, c.minZ+7.98));
				Particle.dimension(dim, side1, vec3(c.maxX+0.98, 0, c.maxZ-6.98));
				Particle.dimension(dim, side2, vec3(c.minX+7.98, 0, c.minZ-0.001));
				Particle.dimension(dim, side2, vec3(c.minX+7.98, 0, c.minZ+15.98));
	
				chunksDB.delete(key);
			});
		} catch {}
		
	}, 20);
	
	// Functions 
	function vec3 (x,y,z) {
		return { x, y, z };
	};
	
	function ckey (dim, loc) {
		return `${dim.id.replace('minecraft:','')}/${loc.minX}/${loc.minZ}`;
	};
	
	function rkey (dim, loc) {
		return `${dim.id.replace('minecraft:','')}/${loc.x}/${loc.y}/${loc.z}`;
	};
	
	function getBlock(loc, block) {
		return block.dimension.getBlock(loc);
	};
	
	function genCoords(center, range) {
		const coordinates = [];
		for (let x = -range; x <= range; x++) {
			for (let y = -range; y <= range; y++) {
				for (let z = -range; z <= range; z++) {
					coordinates.push({
						x: center.x + x,
						y: center.y + y,
						z: center.z + z,
					});
				}
			}
		}
	  return coordinates;
	};
})();
