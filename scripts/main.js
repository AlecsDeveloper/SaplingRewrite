import 'src/config/database.js'
import { require } from 'BPM/.js'
import { root } from 'root'

(async () => {
	// * Modules 
	const World = await require('@core::World');
	World.command('run::function Sapling/database');
	// * Code *
	for (let _ in root.src) {
		let arr = root.src[_];
		for (let x of arr) {
			let path = `src/${_}/${x}`;
			await require(path)
		}
	}
	
	/*
	let txt = '§uSapling §rRoot:';
	for (let src in root.src) {
	  txt += '\n  \\_ ' + src + ':';
	  txt += '\n  |  \\_ ' + root.src[src].join('\n  |  \\_ ');
	}
	
	World.print(txt);
	*/
})();