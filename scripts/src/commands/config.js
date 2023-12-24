import { require, module } from 'BPM/.js'

(async () => {
	// Modules
	const { Core, NBT, World } = await require('@core');
	const Slash = await require('@slash::Slash');
	await require('@colors');
	// Code
	Slash.Register({
		type: 'simple',
		name: 'config',
		callback: function(client, args) {
			let L = module.exports['LANG'][NBT.getData('lang')];
			let option = args[0], value = args[1];
			// Funcions
			if (option == 'help') {
				let txt = 'Config Commands\n'.dark_aqua;
					txt += `  ${'- lang'.gray} ${`[${NBT.getData('lang')}]`.aqua}`;
				return World.ephemeral(txt.trim(), client);
			}
			else if (option == 'lang') {
				if (!['EN','ES','PT','ZH','JA'].includes(value.trim())) return World.ephemeral(L['invalidLang'].red, client);
				NBT.setData('lang', value.trim());
				L = module.exports['LANG'][NBT.getData('lang')];
				World.ephemeral(L['newLang'].aqua, client);
			}
		}
	});
	
	Slash.Register({
		type: 'simple',
		name: 'fix',
		callback: function(client, args) {
			client.runCommand('gamerule dodaylightcycle true');
			client.runCommand('gamerule domobspawning true');
			client.runCommand('gamerule randomtickspeed 1');
			
			World.print('§7Gamerules fixed');
		}
	});
	
	/*Slash.Register({
		type: 'simple',
		name: 'config',
		callback: function(client, args) {
			
		}
	});*/
})();