import { world } from '@minecraft/server';

export class Slash {
    // Save
    static _commands = {};
    static _optionTypes = {
        number: 'number',
        string: 'string',
        boolean: 'boolean'
    }
    
    // Register
    static Register (op) {
        const {
            name, description, options, 
            callback, usage
        } = op;
        const typeCmd = op.type || 'simple'
        
        if (typeCmd == 'advanced') {
            let usageText = '';
        
            if (this._commands[name] || !name) throw new Error('Already registred or missing name');
            else if (!callback) throw new Error('Missing callback');
            else if (options && !Array.isArray(options)) throw new Error('Invalid <options> format');
        
            if (options && Array.isArray(options)) {
                let args = [];
                options.forEach((arg, index) => {
                    const { name, type, optional } = arg; 
                    if (!name || !type) throw new Error('Missing argument in option');
                    else if (!this._optionTypes[type]) throw new Error('Invalid argument type to option');
                    else if (optional && index != options.length - 1) throw new Error('optional arg it\'s only available on the last option');
                    args.push(`<${name}${optional ? '?' : '' }: ${type}>`);      
                });
                usageText = args.join(' ');
            }
            
            this._commands[op.name] = {
              type: typeCmd,
              name: ('./' + name),
              description: description || '',
              usage: usage || usageText,
              options: options || [],
              callback: callback
            }
        } else if (typeCmd == 'simple') {
            if (this._commands[name] || !name) throw new Error('Already registred or missing name');
            else if (!callback) throw new Error('Missing callback');
            
            this._commands[name] = {
                type: typeCmd,
                name: ('./' + name),
                callback
            }
        }
    };
    
    // Option Builder
    static Option(name, type, optional = false) {
        return { name, type, optional }
    }
}

world.beforeEvents.chatSend.subscribe(ev => {
    const { message, sender } = ev;
    let cmd = message.split(' ')[0].replace('./','');
    if (!message.startsWith('./')) return;
    ev.cancel = true;
    // Command
    if (!Slash._commands[cmd]) return world.sendMessage(`§cInvalid command "${cmd}"`);
    
    let { options, callback } = Slash._commands[cmd];
    let typeCmd = Slash._commands[cmd].type;
    
    if (typeCmd == 'advanced') {
        let args = message.trim().split(' ').slice(1);
        let typedArgs = {}, errs = false, argsC = 0;
        
        if (options.length == 0) {
           callback(sender); 
        } else if (!options[options.length-1].optional) {
            if (args.length > options.length) return world.sendMessage('§cSyntax error');
            args.forEach((txt, ind) => {
                if (errs) return;
                
                const { name, type } = options[ind];
                if (type == 'string') typedArgs[name] = txt;
                else if (type == 'number') {
                    let n = Number(txt);
                    if (txt != n) return errs = true;
                    else typedArgs[name] = n;
                } else if (type == 'boolean') {
                    let b = ['true','false'];
                    if (!b.includes(txt)) return errs = true;
                    else typedArgs[name] = txt == 'true';
                }
                
                argsC++;
            });
            
            if (errs) world.sendMessage('§cSyntax error');
            else if (argsC < options.length) world.sendMessage('§cMissing args');
            else callback(sender, typedArgs);
        } else if (options[options.length-1].optional) {
            args.forEach((txt, ind) => {
                if (errs) return;
                
                const { name, type, optional } = options[ind];
                if (!optional) {
                    if (type == 'string') typedArgs[name] = txt;
                    else if (type == 'number') {
                        let n = Number(txt);
                        if (txt != n) return errs = true;
                        else typedArgs[name] = n;
                    } else if (type == 'boolean') {
                        let b = ['true','false'];
                        if (!b.includes(txt)) return errs = true;
                        else typedArgs[name] = txt == 'true';
                    }
                    
                    argsC++;
                } else {
                    if (!txt) return argsC++;
                    else if (type == 'string') typedArgs[name] = txt;
                    else if (type == 'number') {
                        let n = Number(txt);
                        if (txt != n) return errs = true;
                        else typedArgs[name] = n;
                    } else if (type == 'boolean') {
                        let b = ['true','false'];
                        if (!b.includes(txt)) return errs = true;
                        else typedArgs[name] = txt == 'true';
                    }
                    
                    argsC++;
                }
            });
            
            if (errs) world.sendMessage('§cSyntax error');
            else if (argsC < options.length - 1) world.sendMessage('§cMissing args');
            else callback(sender, typedArgs);
        }
    } else if (typeCmd == 'simple') {
        let args = message.split(' ').slice(1);
        Slash._commands[cmd].callback(sender,args);
    }
});