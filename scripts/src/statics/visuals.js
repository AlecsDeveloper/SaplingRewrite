import * as mc from '@minecraft/server'
import { require, module } from 'BPM/.js'

(async () => {
	// Modules
	const { NBT, Event, World, ChunkData } = await require('@core');
	await require('@colors');
	// Code
	/* chestPeek */
	mc.system.runInterval(() => {
		if (!NBT.getData('chestPeek')) return;
		
		let players = mc.world.getAllPlayers();
		
		players.forEach((player) => {
			try {
				const { block } = player.getBlockFromViewDirection();
			
				if (!block) return;
				else if (!block.getComponent('inventory')) return;
	
				const inv = block.getComponent('inventory').container;
				const items = {};
				
				for (let i=0; i<inv.size; i++) {
					const item = inv.getSlot(i);
					if (!item.typeId) continue;
					
					let data = item.typeId.replace('minecraft:','');
					if (items[data]) items[data] += item.amount;
					else items[data] = item.amount;
				}
				
				// Return values
				let bId = block.typeId.replace('minecraft:','');
				bId = bId.replace('shulker_box','sb')
				bId = bId.split('_').join(' ');
				
				const { x, y, z } = block;
				let txt = `§s${bId}: (${x},${y},${z})`
				for (let i in items) txt += `\n§r${i}: §c${items[i]}`;
				
				player.onScreenDisplay.setTitle(txt.trim())
			} catch {} 
		});
	}, 1);
	
	/* infoDisplay */
	const DATA = {
		tps: 20,
		lastTick: Date.now(),
		timeArray: [],
		entities: 0,
	}
	
	mc.system.runInterval(() => {
		if (!NBT.getData('infoDisplay')) return;
	
		let players = mc.world.getAllPlayers();
		players.forEach((player) => {
			const { x, y, z } = player.location;
			const c = ChunkData({ x, z });
			
			let txt = '';
			DATA.tps = Math.round(DATA.tps);
			
			txt += `TPS: §${DATA.tps >= 20 ? 'a' : 'c'}${DATA.tps >= 20 ? 20 : DATA.tps}§r `; 
			txt += `Entities: §a${player.dimension.getEntities().length}§r\n`;
			txt += `Coords: ${Math.floor(x)} ${Math.floor(y)} ${Math.floor(z)}\n`;
			txt += `Chunk: ${Math.floor(x/16)} ${Math.floor(z/16)}${c.slime ? ' §aslime§r\n' : '\n'}`;
						
			player.onScreenDisplay.setActionBar(txt.trim())
		});
		
		if (DATA.timeArray.length == 20) DATA.timeArray.shift();
		DATA.timeArray.push(Math.round(1000 / (Date.now() - DATA.lastTick) * 100) / 100);
		DATA.tps = DATA.timeArray.reduce((a,b) => a + b) / DATA.timeArray.length;
		DATA.lastTick = Date.now();
	}, 1);
})()


/*
await sleep(1000);
for (let x in Event.before.events) {
	World.print('before/' + x)
}
	
for (let x in Event.after.events) {
	World.print('after/' + x)
}
*/