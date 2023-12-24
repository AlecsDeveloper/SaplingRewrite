import { require, module } from 'BPM/.js'

(async () => {
	// Modules
	const { Slash } = await require('@slash');
	const { NBT, World } = await require('@core');
	// Code
	Slash.Register({
		type: 'simple',
		name: 'help',
		callback: function(client, ev) {
			const { Sapling, Data } = module.exports;
			let txt = '§3./sapling <action> <boolean>:'
			for (let x in Sapling) {
				let n = Sapling[x];
				let v = `\n  §7- ${n}`
				
				txt += v;
			}
			txt += '\n§3./func <action> <boolean>'
			for (let x in Data) {
				let n = Data[x];
				let v = `\n  §7- ${n}`
				
				txt += v;
			}
			txt += '\n§3./prof'
			txt += '\n§3./calc <operation>'
			txt += '\n§3./fakeplayer <username> <action>'
			
			World.ephemeral(txt, client)
		}
	});
})();