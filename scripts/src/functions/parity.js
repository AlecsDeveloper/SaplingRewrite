import * as mc from '@minecraft/server'
import { require } from 'BPM/.js'

(async () => {
	// Modules
	const { NBT, Event, Dimension } = await require('@core');
	// Code
	let data = new Map();
	let worldGT = 0;
	
	/* blockSplit */
	mc.system.runInterval(() => {
		if (!NBT.getData('blockSplit')) return worldGT = 0;
		worldGT++;
	}, 1);
	
	Event.follow('before/pistonActivate', (ev) => {
		if (!NBT.getData('blockSplit')) return;
		const { x, y, z } = ev.piston;
		// Event
		const key = `${x} ${y} ${z}`;
		if (ev.isExpanding) {
			let hasBlocks = ev.piston.getAttachedBlocks().length;
			data.set(key, {
				tick: worldGT,
				hasBlocks
			});
			return;
		}
		if (!data.has(key)) return;
		const { tick, hasBlocks } = data.get(key);
		let tickDifference = worldGT - tick;
		if (tickDifference <= 4 && hasBlocks) ev.cancel = true;
		data.delete(key);
	});
	
	/* entityCramming */
	const over = Dimension.overworld;
	const skipMobs = [
		'minecraft:item',
		'minecraft:armor_stand'
	];
	
	mc.system.runInterval(() => {
		if (!NBT.getData('entityCramming')) return;
		// Function 
		let entities = over.getEntities();
		let locations = {};
		
		entities.forEach(entity => {
			if (skipMobs.includes(entity.typeId)) return;
			let key = createKey(entity, entity.dimension);
			locations[key] = locations[key] || [];
			locations[key].push(entity);
		});
		
		for (let block in locations) {
			let _entities = locations[block];
			if (_entities.length < 24) continue;
			
			const players = _entities.filter(e => e.typeId == 'minecraft:player');
			let damage = false;
	
			if (players.length > 0) {
				let _playersGM = [
					...getPlayers('survival'),
					...getPlayers('adventure')
				];
				
				players.forEach((p) => {
					if (!_playersGM.includes(p.id)) return;
					p.applyDamage(6)
					damage = !damage;
				});
			}
			
			if (players.length < 1 || !damage) {
				_entities = _entities.slice(24);
				_entities.forEach(entity => {
					if (entity.typeId.endsWith('cart')) return;
					entity.applyDamage(6)
				});
			}
		}
	}, 10);
	
	function createKey(entity, dimension) {
		const { x, y, z } = entity.location;
		let _x = Math.round(x);
		let _y = Math.round(y);
		let _z = Math.round(z);
		
		let dim = dimension.id.replace('minecraft:', '');
		return `${dim}/${_x},${_y},${_z}`;
	}
	
	function getPlayers(gameMode) {
		return over.getPlayers({ gameMode }).map(p => p.id);
	}
})();