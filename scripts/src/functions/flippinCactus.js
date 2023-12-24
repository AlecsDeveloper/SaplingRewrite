import { require } from 'BPM/.js'

(async () => {
	// Modules
	const { NBT, Event, World } = await require('@core');
	// Code
	Event.follow('before/itemUseOn', (ev) => {
		const { itemStack, source, block } = ev;
		if (!NBT.getData('flippinCactus')) return;
		else if (itemStack.typeId != 'minecraft:cactus') return;
		
		ev.cancel = true;
		if (source.isSneaking) rotateBlock(block);
		else invertBlock(block);
	});
})();

const invertStates = ['up','down','north','south','west','east']
const directions = {
	0: 'down',
	1: 'up',
	2: 'south',
	3: 'north',
	4: 'east',
	5: 'west',
	'down': 0,
	'up': 1,
	'south': 2,
	'north': 3,
	'east': 4,
	'west': 5
}
const invertDegrees = {
	'north': '0_degrees',
	'south': '180_degrees',
	'east': '90_degrees',
	'west': '270_degrees'
}
const ddInvert = ['up','down','south','north','east','west']

function invertBlock(block) {
	const { x, y, z } = block;
	const data = block.typeId.replace('minecraft:','');
	if (data == 'observer') {
		const state = block.permutation.getState('minecraft:facing_direction');
		let dat = `${data}:${invertStates[directions[state]]}`;
		setBlock(dat, block.location, block.dimension);
	} else if (data.endsWith('repeater')) {
		let perm = block.permutation.getAllStates();
		let [dir, bit] = [
			perm['minecraft:cardinal_direction'],
			perm['repeater_delay']
		];
		
		let dat = `${data.split('_')[1]}:bit${bit}`;
		let deg = invertDegrees[dir];
		
		setBlock(dat, block.location, block.dimension, deg);
	} else if (data.endsWith('comparator')) {
		let perm = block.permutation.getAllStates();
		let [dir, bit] = [
			perm['minecraft:cardinal_direction'],
			perm['output_subtract_bit']
		];
		
		let dat = `${data.split('_')[1]}:${bit}`;
		let deg = invertDegrees[dir];
		
		setBlock(dat, block.location, block.dimension, deg);		
	} else if (['dispenser','dropper','hopper'].includes(data)) {
		const state = block.permutation.getState('facing_direction');
		let dat = `${data}:${ddInvert[state]}`;
		setBlock(dat, block.location, block.dimension);
	}else {
		const state = block.permutation.getState('facing_direction');
		let dat = `${data}:${invertStates[state]}`;
		setBlock(dat, block.location, block.dimension);
	}
}

function rotateBlock (block) {
	// Set Config Values
	const data = block.typeId.replace('minecraft:','');
	const LIST = [
		'piston','sticky_piston','observer',
		'dropper','dispenser','hopper',
		'unpowered_repeater','powered_repeater',
		'unpowered_comparator','powered_comparator'
	], LIST2 = [
		'piston','sticky_piston',
		'dropper','dispenser'
	]
	if (!LIST.includes(data)) return;
	// Replace Function
	if (LIST2.includes(data)) return replace(block,data);
	else if (data == 'observer') {
		const { x, y, z } = block;
		const dir = block.permutation.getAllStates()['minecraft:facing_direction'];
		if (dir == 'down') return block.dimension.runCommandAsync(`structure load ${data}:up ${x} ${y} ${z}`);
		else if (dir == 'up') return block.dimension.runCommandAsync(`structure load ${data}:north ${x} ${y} ${z}`);
		else if (dir == 'north') return block.dimension.runCommandAsync(`structure load ${data}:west ${x} ${y} ${z}`);
		else if (dir == 'west') return block.dimension.runCommandAsync(`structure load ${data}:south ${x} ${y} ${z}`);
		else if (dir == 'south') return block.dimension.runCommandAsync(`structure load ${data}:east ${x} ${y} ${z}`);
		else if (dir == 'east') return block.dimension.runCommandAsync(`structure load ${data}:down ${x} ${y} ${z}`);
	}
	else if (['unpowered_repeater','powered_repeater'].includes(data)) {
		const GETS = {
			dir: block.permutation.getAllStates()['minecraft:cardinal_direction'],
			bit: block.permutation.getAllStates()['repeater_delay']
		}
		const { x, y, z } = block;
		if (GETS.dir == 0) return block.dimension.runCommandAsync(`structure load repeater:bit${GETS.bit} ${x} ${y} ${z} 90_degrees`);
		else if (GETS.dir == 1) return block.dimension.runCommandAsync(`structure load repeater:bit${GETS.bit} ${x} ${y} ${z} 180_degrees`);
		else if (GETS.dir == 2) return block.dimension.runCommandAsync(`structure load repeater:bit${GETS.bit} ${x} ${y} ${z} 270_degrees`);
		else if (GETS.dir == 3) return block.dimension.runCommandAsync(`structure load repeater:bit${GETS.bit} ${x} ${y} ${z} 0_degrees`);
	} else if (['unpowered_comparator','powered_comparator'].includes(data)) {
		const GETS = {
			dir: block.permutation.getAllStates()['minecraft:cardinal_direction'],
			bit: block.permutation.getAllStates()['output_subtract_bit']
		}
		const { x, y, z } = block;
		if (GETS.dir == 0) return block.dimension.runCommandAsync(`structure load comparator:${GETS.bit} ${x} ${y} ${z} 90_degrees`);
		else if (GETS.dir == 1) return block.dimension.runCommandAsync(`structure load comparator:${GETS.bit} ${x} ${y} ${z} 180_degrees`);
		else if (GETS.dir == 2) return block.dimension.runCommandAsync(`structure load comparator:${GETS.bit} ${x} ${y} ${z} 270_degrees`);
		else if (GETS.dir == 3) return block.dimension.runCommandAsync(`structure load comparator:${GETS.bit} ${x} ${y} ${z} 0_degrees`);
	} else if (data == 'hopper') {
		const { x, y, z } = block;
		const direction = block.permutation.getAllStates()['facing_direction'];																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																 
		if (direction == 0) return block.dimension.runCommandAsync(`structure load ${data}:north ${x} ${y} ${z}`);																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																										  else if (direction == 2) return block.dimension.runCommandAsync(`structure load ${data}:south ${x} ${y} ${z}`);
		else if (direction == 3) return block.dimension.runCommandAsync(`structure load ${data}:west ${x} ${y} ${z}`);
		else if (direction == 4) return block.dimension.runCommandAsync(`structure load ${data}:east ${x} ${y} ${z}`);
		else if (direction == 5) return block.dimension.runCommandAsync(`structure load ${data}:down ${x} ${y} ${z}`);
	}
}

function replace(block,data) {
	const { x, y, z } = block;
	const direction = block.permutation.getAllStates()['facing_direction'];
	if (direction == 2) return block.dimension.runCommandAsync(`structure load ${data}:up ${x} ${y} ${z}`);
	else if (direction == 0) return block.dimension.runCommandAsync(`structure load ${data}:north ${x} ${y} ${z}`);
	else if (direction == 1) return block.dimension.runCommandAsync(`structure load ${data}:west ${x} ${y} ${z}`);
	else if (direction == 4) return block.dimension.runCommandAsync(`structure load ${data}:south ${x} ${y} ${z}`);
	else if (direction == 3) return block.dimension.runCommandAsync(`structure load ${data}:east ${x} ${y} ${z}`);
	else if (direction == 5) return block.dimension.runCommandAsync(`structure load ${data}:down ${x} ${y} ${z}`);
}

function setBlock(dat, loc, dim, deg = '0_degrees') {
	const { x, y, z } = loc;
	dim.runCommandAsync(`structure load ${dat} ${x} ${y} ${z} ${deg}`);
}