import {dream} from './dream.js';
import {pool} from './db.js';
try {console.log(await dream(process.argv[2]||'demo',process.argv[3]||'sample'));}
finally {await pool.end();}
