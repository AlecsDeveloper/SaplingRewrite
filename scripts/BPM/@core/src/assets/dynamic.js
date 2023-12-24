import { 
    world
} from '@minecraft/server';

const NBT = {
    Collection: [],
    Create: options => {
        let { name, type } = options;
        if (name == undefined || !['boolean','number','string','json'].includes(type)) return;
        NBT.Collection.push(options);
    },
    Reader: event => NBT.Collection.forEach(property => {
        const { name, type } = property;
        if (NBT.getData(name)) return;
        if (type == 'boolean') world.setDynamicProperty(name, false);
        else if (type == 'number') world.setDynamicProperty(name, 0);
        else if (type == 'string') world.setDynamicProperty(name,'');
        else if (type == 'json') world.setDynamicProperty(name,'{}');
    }),
    getData: name => world.getDynamicProperty(name),
    setData: (name,value) => world.setDynamicProperty(name,value)
}; export { NBT }