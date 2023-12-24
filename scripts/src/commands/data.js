import { system, world } from '@minecraft/server'
import { require, module } from 'BPM/.js'

(async () => {
	// Modules
	const { Slash } = await require('@slash');
	const { NBT, World } = await require('@core');
	await require('@colors')
	// Code
	const overworld = world.getDimension('overworld');
	Slash.Register({
		type: 'simple',
		name: 'prof',
		callback: function(client, args) {
			// Lang 
			const L = module.exports['LANG'][NBT.getData('lang')];
			World.print(L['prof'].gray);
			const DATA = {
				tps: 20,
				lastTick: Date.now(),
				timeArray: [],
				entities: 0,
			}
			
			const runTime = system.runInterval(() => {
				if (DATA.timeArray.length == 20) DATA.timeArray.shift();
				DATA.timeArray.push(Math.round(1000 / (Date.now() - DATA.lastTick) * 100) / 100);
				DATA.tps = DATA.timeArray.reduce((a,b) => a + b) / DATA.timeArray.length;
				DATA.lastTick = Date.now();
			});
			
			system.runTimeout(() => {
				system.clearRun(runTime);
				DATA.tps = Math.floor(DATA.tps);
				for (let x of overworld.getEntities()) DATA.entities++;
				World.print(`TPS: §${DATA.tps < 20 ? 'c' : 'a'}${DATA.tps > 20 ? 20 : DATA.tps}§r Entities: §a${DATA.entities}`)
			},100);
		}
	});
	
	Slash.Register({
		type: 'simple',
		name: 'calc',
		callback: function(client, ev) {
			let txt = ev.join('');
			if (!/^[0-9+\-\/a-z!%=*().\s]+$/.test(txt))
				return World.print('§cInvalid expression');
			try {
				const res = Function(`let PI = Math.PI; return (${txt})`)().toString();
				World.print(`§q> §r${txt}: ${res.material_iron}`);
			} catch (e) { World.print('§cError with expression evaluation\n§u' + e) }
		}
	});
})();