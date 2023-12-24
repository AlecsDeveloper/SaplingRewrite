import { system } from '@minecraft/server'
import { require, module } from 'BPM/.js'

const LANG = module.exports['LANG'];
const ACTS = [
	'jump','attack','shift','use',
	'trident','interact','glide',
	'fly','rotate','select',
	'swim','drop','stop', 'script',
	'spawn', 'kill', 'tp',
	'repeat', 'stop', 'respawn'
], REPEATS = [
	'jump','attack','shift','use',
	'trident','interact','glide',
	'fly','rotate','select',
	'swim','drop','stop', 'script'
]

const PLAYERSDB = {};
const everPrefix = '--all';

(async () => {
	// Modules
	const {
		Player, Core, NBT, World
	} = await require('@core');
	const { Slash } = await require('@slash');
	await require('@colors');
	// Code 
	Slash.Register({
		type: 'simple',
		name: 'fakeplayer',
		callback: function(client, args) {
			const L = LANG[NBT.getData('lang')];
			let [username, action] = args;
			action = action.toLowerCase();
			// Check action
			if (!ACTS.includes(action)) return World.ephemeral(L['invalidValue'].red, client)
			else if (action == 'spawn') {
				let FAKEPLAYER = PLAYERSDB[username];
				if (FAKEPLAYER) return World.ephemeral(`${username} ${L['fakeplayerConnected']}`.gray, client);
				system.run(() => {
					let _user = new Player(username, client.location);
					_user.teleport(client.location, client.dimension);
					PLAYERSDB[username] = {
						Player: _user,
						Actions: {
							normals: [],
							script: ''
						}
					}
				});
			} else if (action == 'kill') {
				let FAKEPLAYER = PLAYERSDB[username];
				if (!FAKEPLAYER) return World.ephemeral(L['fakeplayerInvalid'].gray, client);
				system.run(() => {
					FAKEPLAYER.Player.disconnect();
					delete PLAYERSDB[username];
				});
			} else if (action == 'tp') {
				let FAKEPLAYER = PLAYERSDB[username];
				if (!FAKEPLAYER) return World.ephemeral(L['fakeplayerInvalid'].gray, client);
				system.run(() => {
					FAKEPLAYER.Player.teleport(client.location, client.dimension);
				});
			} else if (action == 'script') {
				if (username != everPrefix) {
					let FAKEPLAYER = PLAYERSDB[username];
					if (!FAKEPLAYER) return World.ephemeral(L['fakeplayerInvalid'].gray, client);
					system.run(() => {
						let txt = args.slice(2).join('');
						FAKEPLAYER.Player.script(txt);
					});
				} else {
					for (let F in PLAYERSDB) {
						system.run(() => {
							const FAKEPLAYER = PLAYERSDB[F];
							let txt = args.slice(2).join('');
							FAKEPLAYER.Player.script(txt);
						});
					}
				}
			} else if (action == 'repeat') {
				if (username != everPrefix) {
					let FAKEPLAYER = PLAYERSDB[username];
					if (!FAKEPLAYER) return World.ephemeral(L['fakeplayerInvalid'].gray, client);
					// Check action
					let actRepeat = args[2];
					if (!REPEATS.includes(actRepeat)) return World.ephemeral(L['invalidAction'].gray, client);
					// Set action
					if (actRepeat == 'script') {
						let script = args.slice(3).join('').trim();
						FAKEPLAYER.Actions.script = script || '';
					} else {
						let acts = FAKEPLAYER.Actions.normals;
						if (acts.includes(actRepeat)) return;
						FAKEPLAYER.Actions.normals.push(actRepeat);
					}
				} else {
					// Check action
					let actRepeat = args[2];
					if (!REPEATS.includes(actRepeat)) return World.ephemeral(L['invalidAction'].gray, client);
					for (let F in PLAYERSDB) {
						const FAKEPLAYER = PLAYERSDB[F];
						// Set action
						if (actRepeat == 'script') {
							let script = args.slice(3).join('').trim();
							FAKEPLAYER.Actions.script = script || '';
						} else {
							let acts = FAKEPLAYER.Actions.normals;
							if (acts.includes(actRepeat)) return;
							FAKEPLAYER.Actions.normals.push(actRepeat);
						}
					}
				}
			} else if (action == 'stop') {
				if (username != everPrefix) {
					let FAKEPLAYER = PLAYERSDB[username];
					if (!FAKEPLAYER) return World.ephemeral(L['fakeplayerInvalid'].gray, client);
					PLAYERSDB[username].Actions = {
						normals: [],
						script: ''
					}
				} else {
					for (let F in PLAYERSDB) {
						system.run(() => {
							const FAKEPLAYER = PLAYERSDB[F];
							FAKEPLAYER.Actions = { 
								normals: [], 
								script: '' 
							}
						});
					}
				}
			} else {
				if (username != everPrefix) {
					let FAKEPLAYER = PLAYERSDB[username];
					if (!FAKEPLAYER) return World.ephemeral(L['fakeplayerInvalid'].gray, client);
					system.run(() => {
						FAKEPLAYER.Player[action](args[2]);
					});
				} else {
					for (let F in PLAYERSDB) {
						const FAKEPLAYER = PLAYERSDB[F];
						system.run(() => {
							FAKEPLAYER.Player[action](args[2])
						});
					}
				}
				
			}
		}
	});
	
	system.runInterval(() => {
		for (let player in PLAYERSDB) {
			ActionScript(PLAYERSDB[player]);
		}
	}, 10);
	
	function ActionScript ({ Player, Actions }) {
		Actions.normals.forEach(act => {
			Player[act]();
		});
		if (Actions.script != '') {
			Player.script(Actions.script);
		}
	};
})();