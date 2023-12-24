import { require } from 'BPM/.js'

(async () => {
	// Modules
	const { NBT, Event } = await require('@core');
	const { Item } = await require('@sapling');
	// Code
	const TABLES = {
		'minecraft:guardian': {
			property: 'guardianDropSponges',
			item: 'minecraft:sponge',
			amount: () => 1
		},
		'minecraft:ghast': {
			property: 'ghastDropQuartz',
			item: 'minecraft:quartz',
			amount: () => Math.floor(Math.random()*6) || 1
		},
		'minecraft:husk': {
			property: 'huskDropSand',
			item: 'minecraft:sand',
			amount: () => Math.floor(Math.random()*4) || 1
		},
		'minecraft:silverfish': {
			property: 'silverfishDropGravel',
			item: 'minecraft:gravel',
			amount: () => 1
		}
	};
	
	Event.follow('after/entityDie', (ev) => {
		let { deadEntity } = ev;
		let loot = TABLES[deadEntity.typeId]
		if (!loot) return;
		else if (Math.floor(Math.random()*2) == 0) return;
		else if (!NBT.getData(loot.property)) return;
		// Drop
		Item.spawn({
			dimension: deadEntity.dimension,
			item: loot.item,
			amount: loot.amount(),
			location: deadEntity.location
		});
	});
})();