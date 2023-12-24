import * as mc from '@minecraft/server';
import { require, module } from 'BPM/.js';

(async () => {
	// Modules
	const { MyDB } = await require('@mysql');
	const { HSA } = await require('@sapling');
	// Code
	let randomTick = Math.floor(Math.random() * 320);
	let currentTick = 0;
	mc.system.runInterval(() => {
		console.warn(currentTick, randomTick);
		if (currentTick <= randomTick) currentTick++;
		else {
			hssEngine();
			currentTick = 0;
			randomTick = Math.floor(Math.random() * 320);
		}
	}, 1);
	// Functions
	function hssEngine() {
		let HSS = module.exports['Hss'];
		for (let type in HSS) {
			let db = new MyDB(type);
			db.forEach((key, data) => {
				try {
					let [x, y, z, d] = data.split('/');
					let hss = new HSA({
						hssId: type,
						location: new mc.Vector(Number(x), Number(y), Number(z)),
						dimension: mc.world.getDimension(d.replace('minecraft:',''))
					});
					
					hss.spawn();
				} catch {}
			})
		}
	}
})();