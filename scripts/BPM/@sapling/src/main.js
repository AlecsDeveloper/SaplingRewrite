import * as mc from '@minecraft/server'
import { slime } from './assets/slime.js'
import { magma } from './assets/magma.js'
import { HSA } from './assets/hsa.js'

class Item {
    static spawn(options) {
        options.dimension.spawnItem(
            new mc.ItemStack(
                options.item, 
                options.amount
            ), 
            options.location
        );
    }
};

const ov = mc.world.getDimension('overworld');
class Particle {
    static create (entity, particle, coords) {
        const { x, y, z } = coords;
        entity.runCommand(`particle ${particle} ${x} ${y} ${z}`);
    }
    
    static dimension (dim, particle, coords) {
        const { x, y, z } = coords;
        ov.runCommand(`execute in ${dim} run particle ${particle} ${x} ${y} ${z}`);
    }
}

const ChunkData = ({ x, z }) => {
    const DATA = {} 
    // Coords
    let chunkX = Math.floor(x / 16) * 16,
        chunkZ = Math.floor(z / 16) * 16;
    // Set Data
    DATA['minX'] = chunkX;
    DATA['minZ'] = chunkZ;
    DATA['maxX'] = chunkX + 15;
    DATA['maxZ'] = chunkZ + 15;
    DATA['slime'] = slime(chunkX,chunkZ);
    DATA['magma'] = magma(chunkX,chunkZ);
    // Return Data
    return DATA;
}

export { Item, Particle, ChunkData, HSA }