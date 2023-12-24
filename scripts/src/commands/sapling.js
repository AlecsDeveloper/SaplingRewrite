import { system } from '@minecraft/server'
import { require, module } from 'BPM/.js'

const { Sapling } = module.exports;
// Asynchronous encapsulation
(async () => {
	// Modules
	const { Slash } = await require('@slash');
	const { World, NBT } = await require('@core');
	await require('@colors');
	// Code
	Slash.Register({
		type: 'advanced',
		name: 'sapling',
		options: [
			Slash.Option('feature','string'),
			Slash.Option('value','boolean')
		],
		callback: function(client, args) {
			// Lang 
			const L = module.exports['LANG'][NBT.getData('lang')];
			// Options
			let [feature, value] = [
				args['feature'].toLowerCase(),
				args['value']
			]
			// Check features
			if (!Sapling[feature]) return World.ephemeral(L['invalidValue'].red, client)
			// Set values
			system.run(() => {
				NBT.setData(Sapling[feature], value);
			});
			
			if (feature == 'tntduping') LoadScore({ name: 'tntDuping', value });
			World.print(value ? `${Sapling[feature]} ${L['enabled']}...`.gray : `${Sapling[feature]} ${L['disabled']}...`.gray)
		}
	});
	// Functions
	function LoadScore (options) {
		const { name, value } = options;
		World.command(`run::scoreboard players set "${name}" SaplingDB ${value ? 1 : 0}`)
	}
})();