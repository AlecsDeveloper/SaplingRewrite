import * as mc from '@minecraft/server'
import { require } from 'BPM/.js'

(async () => {
	// Module
	const { NBT, Event } = await require('@core');
	const { Item } = await require('@sapling');
	// Code 
	Event.follow('after/entityHitBlock', (ev) => {
		const { damagingEntity, hitBlock } = ev;
		if (damagingEntity.typeId != 'minecraft:player' || !hitBlock) return;
		/* toolChanger */
		if (NBT.getData('toolChanger')) {
			// Conditions
			const tags = hitBlock.getTags();
			if (tags.includes('dirt')) toolChanger(damagingEntity,'_shovel');
			else if (tags.includes('stone')) toolChanger(damagingEntity,'_pickaxe');
			else if (tags.includes('wood')) toolChanger(damagingEntity,'_axe');
		}
		/* instamineObsidian */
		if (NBT.getData('instamineObsidian')) {
			const item = damagingEntity.getComponent('inventory').container.getItem(damagingEntity.selectedSlot);
			if (!item) return;
			if (!['minecraft:diamond_pickaxe','minecraft:netherite_pickaxe'].includes(item.typeId)) return;
			else if (hitBlock.typeId != 'minecraft:obsidian') return;
			Item.spawn({
				dimension: damagingEntity.dimension,
				item: 'minecraft:obsidian',
				amount: 1,
				location: hitBlock.location
			});
			hitBlock.setType('minecraft:air');
		}
	});
	
	/* silkTouchGetSpawners */
	Event.follow('before/playerBreakBlock', (ev) => {
		const { itemStack, block } = ev;
		
		if (!itemStack || !itemStack.typeId.endsWith('_pickaxe')) return;
		
		let enchants = itemStack.getComponent('enchantments').enchantments;			
		if (enchants.hasEnchantment('silk_touch') == 0) return;

		if (NBT.getData('silkTouchGetSpawners') && block.typeId == 'minecraft:mob_spawner') {
			ev.cancel = true;
			mc.system.run(() => {
				block.dimension.spawnItem(block.getItemStack(1, true), block.location);
				block.setType('minecraft:air')
			});
		};
		
		if (NBT.getData('silkTouchGetBuddingAmethyst') && block.typeId == 'minecraft:budding_amethyst') {
			mc.system.run(() => {
				let drop = new mc.ItemStack('minecraft:budding_amethyst', 1);
				block.dimension.spawnItem(drop, block.location);
			});
		};
	});
})();

function toolChanger(player,tool) {
	try {
		const inv = player.getComponent('inventory').container;
		for (let x = 0; x < 9; x++) {
			const item = inv.getItem(x);
			if (!item) continue;
			if (item.typeId.includes(tool)) return player.selectedSlot = x;
		}
	} catch { }
}