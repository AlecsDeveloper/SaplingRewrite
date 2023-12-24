import * as mc from '@minecraft/server'
import { require } from 'BPM/.js'

(async () => {
	// Modules
	const { NBT, Event, World } = await require('@core');
	const { sleep } = await require('@extras');
	// Code
	/* cauldronBedrockBreaker */
	Event.follow('before/itemUseOn', (ev) => {
		if (!NBT.getData('cauldronBedrockBreaker')) return;
		
		const { itemStack, source, block } = ev;
		const liquid = block.permutation.getState('cauldron_liquid');
		if (itemStack.typeId != 'minecraft:powder_snow_bucket') return;
		else if (block.typeId != 'minecraft:cauldron') return;
		else if (liquid != 'powder_snow') return;
		
		const { x, y, z } = block.location;
		let b = block.dimension.getBlock(new mc.Vector(x,y+1,z));
		mc.system.run(() => {
			b.setType('powder_snow');
		});
	});
	
	/* anvilBedrockBreaker */
	Event.follow('spawn::falling_block', async (ev) => {
		if (!NBT.getData('anvilBedrockBreaker')) return;
		
		const { location, dimension } = ev.entity
		const loc = {
			x: Math.floor(location.x),
			y: Math.floor(location.y),
			z: Math.floor(location.z)
		}
		
		await sleep(700);
		
		const b = dimension.getBlock(loc);
		if (b.typeId != 'minecraft:anvil') return;
		
		if (getBlock(b,[1,-1,0]).typeId.includes('arm_collision')) mc.system.run(() => getBlock(b,[1,-2,0]).setType('minecraft:air'))
		if (getBlock(b,[-1,-1,0]).typeId.includes('arm_collision')) mc.system.run(() => getBlock(b,[-1,-2,0]).setType('minecraft:air'))
		if (getBlock(b,[0,-1,1]).typeId.includes('arm_collision')) mc.system.run(() => getBlock(b,[0,-2,1]).setType('minecraft:air'))
		if (getBlock(b,[0,-1,-1]).typeId.includes('arm_collision')) mc.system.run(() => getBlock(b,[0,-2,-1]).setType('minecraft:air'))
	});
	
	/* signBedrockBreaker */
	/*Event.follow('before/itemUseOn', (ev) => {
		if (!NBT.getData('signBedrockBreaker')) return;
		
		const { itemStack, source, block } = ev;
		let id = itemStack.typeId;
		
		if (id.endsWith('_sign') && id.includes('handing')) return;
	});*/
	
	// Functions
	function getBlock(base, coords) {
		let locB = {
			x: base.location.x + coords[0],
			y: base.location.y + coords[1],
			z: base.location.z + coords[2]
		};
		return base.dimension.getBlock(locB);
	}
})();