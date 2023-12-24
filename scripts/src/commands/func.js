import * as mc from '@minecraft/server'
import { require, module } from 'BPM/.js'

const { Data } = module.exports;
// Asynchronous encapsulation
(async () => {
	// Modules
	const { Slash } = await require('@slash');
	const { NBT, World } = await require('@core');
	await require('@colors');
	// Code
	Slash.Register({
		type: 'advanced',
		name: 'func',
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
			];
			// Check features
			if (!Data[feature]) return World.ephemeral(L['invalidValue'].red, client)
			// Set values
			mc.system.run(() => {
				NBT.setData(Data[feature], value);
			});
			
			World.print(value ? `${Data[feature]} ${L['enabled']}...`.gray : `${Data[feature]} ${L['disabled']}...`.gray)
		}
	});
})();