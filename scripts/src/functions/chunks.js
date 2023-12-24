import * as mc from '@minecraft/server';
import { require } from 'BPM/.js'

(async () => {
	// Modules
	const { NBT, Event, World, ChunkData } = await require('@core');
	const { sleep } = await require('@extras');
	const { MyDB } = await require('@mysql');
	// Code
	const ROSES = new MyDB('witherRoses');
	
	Event.follow('before/itemUseOn', (ev) => {
		if (!NBT.getData('witherRoseLoadChunk')) return;
		// Check rose 
		const { itemStack, block } = ev;
		
		let iId = itemStack.typeId.replace('minecraft:','');
		let bId = block.typeId.replace('minecraft:','');
		
		const d = block.dimension.id.replace('minecraft:','');
		const c = ChunkData(block.location);
		let potKey = createKey(d, block.location);
			
		if (iId == 'wither_rose' && bId == 'flower_pot') {
			if (ROSES.has(potKey)) return;
			else ROSES.set(potKey, c);
		} else if (iId != 'wither_rose' && bId == 'flower_pot') {
			let potKey = createKey(block.location);
			if (ROSES.has(potKey)) ROSES.remove(potKey);
		}
	});
	
	/*mc.system.runInterval(() => {
		let roseNbt = NBT.getData('witherRoseLoadChunk');
		if (!roseNbt) return World.command('run::tickingarea remove rosechunk');
		ROSES.forEach(async (key, value) => {
			let [dim,loc] = key.split(':');
			let [x,y,z] = loc.split('/').map(_ => Number(_));
			
			let d = mc.world.getDimension(dim);
			let b = d.getBlock({ x, y, z });
			
			const { minX, maxX, minZ, maxZ } = value;
			
			await d.runCommandAsync('tickingarea remove rosechunk');
			if (b.typeId != 'minecraft:flower_pot') {
				return ROSES.remove(key);
			} else {
				console.warn(dim, x, y, z);
				//d.runCommand(`execute in ${dim} run particle ll:slime_side ${x} ${y} ${z}`)
				await d.runCommandAsync(`execute in ${dim} run tickingarea add ${minX} 0 ${minZ} ${maxX} 0 ${maxZ} rosechunk`);
			}
		});
	}, 100);*/
	let loaded = [];
	mc.system.runInterval(() => {
		World.command('run::tickingarea remove rosechunk');
		if (!NBT.getData('witherRoseLoadChunk')) return loaded = [];
		let KEYS = Object.keys(ROSES.parse());
		
		if (KEYS.length == 0) return;
		if (loaded.length >= KEYS.length) loaded = [];
		
		let r = Math.floor(Math.random() * KEYS.length);
		let key = KEYS[r];
		if (loaded.includes(key)) return;
		
		let [dim, loc] = key.split(':');
		let [x, y, z] = loc.split('/').map(_ => Number(_));
		
		let d = mc.world.getDimension(dim);
		let b = d.getBlock({ x, y, z });
			
		const { minX, maxX, minZ, maxZ } = ROSES.get(key);
		
		try {
			if (b.typeId != 'minecraft:flower_pot') return ROSES.remove(key);
		} catch {} 
		
		let a = d.runCommand(`execute in ${dim} run tickingarea add ${minX} 0 ${minZ} ${maxX} 0 ${maxZ} rosechunk`);
		loaded.push(key);
	}, 4);
	
	// Functions
	function createKey (dim, { x, y, z }) {
		return `${dim}:${x}/${y}/${z}`;
	};
})();