import { Event, NBT } from 'BPM/@core/src/main.js'
import { world } from '@minecraft/server';
import { module } from 'BPM/.js'

const SAPLING = {
	/* TNT Tweaks */
	tntduping: 'tntDuping', 
	tntdropallblocks: 'tntDropAllBlocks', 
	tntnodrops: 'tntNoDrops', 
	tntnotexplodes: 'tntNotExplodes', 
	tntdropice: 'tntDropIce', 
	/* Loot Tables*/
	guardiandropsponges: 'guardianDropSponges', 
	ghastdropquartz: 'ghastDropQuartz', 
	huskdropsand: 'huskDropSand', 
	silverfishdropgravel: 'silverfishDropGravel', 
	/* World */
	pigmansfarmwarts: 'pigmansFarmWarts', 
	endportalgbd: 'endPortalGBD', 
	anvilbedrockbreaker: 'anvilBedrockBreaker', 
	renewablesoulsand: 'renewableSoulSand', 
	cauldronbedrockbreaker: 'cauldronBedrockBreaker', 
	//signbedrockbreaker: 'signBedrockBreaker',
	//witherroseloadchunk: 'witherRoseLoadChunk',
	ravagerdestroycherryleaves: 'ravagerDestroyCherryLeaves',
	/* Tweaks */
	//autocrafting: 'autoCrafting',
	flippincactus: 'flippinCactus', 
	toolchanger: 'toolChanger', 
	instamineobsidian: 'instamineObsidian', 
	silktouchgetspawners: 'silkTouchGetSpawners',
	silktouchgetbuddingamethyst: 'silkTouchGetBuddingAmethyst',
	/* Parity */
	blocksplit: 'blockSplit', 
	entitycramming: 'entityCramming'
}, DATA = {
	chunkborders: 'chunkBorders',
	slimechunks: 'slimeChunks',
	tpboxes: 'tpBoxes',
	redstoneindicator: 'redstoneIndicator',
	chestpeek: 'chestPeek',
	tntblocks: 'tntBlocks',
	infodisplay: 'infoDisplay'
}, HSS = {
	SwampHut: 'SwampHut',
	NetherFortress: 'NetherFortress',
	PillagerOutpost: 'PillagerOutpost',
	OceanMonument: 'OceanMonument'
}

NBT.Create({
	name: 'lang',
	type: 'string',
	size: 4
});


for (let x in SAPLING) {
	NBT.Create({
		name: SAPLING[x],
		type: 'boolean'
	});
}

for (let x in DATA) {
	NBT.Create({
		name: DATA[x],
		type: 'boolean'
	});
}


world.afterEvents.worldInitialize.subscribe(async ev => {
	await NBT.Reader(ev);
	if (!NBT.getData('lang')) {
		NBT.setData('lang','EN');
	}
});

module({
	Sapling: SAPLING, 
	Data: DATA,
	Hss: HSS 
});