/*
 * NULL Engine
 * 
 * @module  core/commands
 * @author  kod.connect
 */

c_.give = function(item, silent){
    
    silent = silent || false;

    if (item == 'all') {
        
        // give all weapons
        for (var i in o_.weapons) {
            
            if (i != 'default') {

                c_.give( i, true );
            }
        }
        
        if (!silent) {
            
            r_.drawMessage( u_.msg.STSTR_KFAADDED );
        }
        
    } else {
        
        if (item != 'default') {
        
            if (o_.weapons[item] != undefined) {
                
                o = o_.weapons[item];                             
                
                p_.weapons[item] = true; // give weapon itself
                
                var ammo_max = o_.ammo[ o_.weapons[ item ].ammo ].capacity;
                var ammo_has = p_.ammo[ o_.weapons[ item ].ammo ] || 0;                
                     
                if ( ammo_has < ammo_max ) {

                    if ( ammo_has + o.contains <= ammo_max ) {
                
                        p_.ammo[ o_.weapons[ item ].ammo ] = ammo_has + o.contains;
                        
                    } else {
                        
                        p_.ammo[ o_.weapons[ item ].ammo ] = ammo_max;
                    }
                    
                }
                
            } else if(o_.ammo[item] != undefined) {
                
                o = o_.ammo[item];
                
                var ammo_max = o_.ammo[ o.ammotype ].capacity;
                var ammo_has = p_.ammo[ o.ammotype ] || 0;                
                            
                if ( ammo_has < ammo_max ) {
                
                    if ( ammo_has + o.capacity <= ammo_max ) {
                
                        p_.ammo[ o_.ammo[item].ammotype ] = ammo_has + o.capacity;
                        
                    } else {
                        
                        p_.ammo[ o_.ammo[item].ammotype ] = ammo_max;
                    }
                    
                    o.onPickup = o_.ammo.onPickup;
                }
                
            } else if(o_.powerups[item] != undefined) {
                                
                o = o_.powerups[item];
                                
                
            } else {
                
                // wtf ?
                var o = { 
                    onPickup: function(){
                        
                        return u_.msg.GOTUNKNWN.replace('%item%', item);
                    }
                }
            }
                        
            var message = (typeof o.onPickup == 'function') ? o.onPickup(item) : 'ERROR: No pickup for '+item;
            
            if (!silent) {
 
                r_.drawMessage( message ); 
            }
                        
        }  
    };
};

c_.giveThing = function(item){
  
    if (item.weapon != undefined) {

        c_.give( item.weapon );

    } else if(item.ammo != undefined) {

        c_.give( item.ammo );

    } else if(item.powerup != undefined) {

        c_.give( item.powerup );

    } else {

        c_.give( item );
    }                     
};

c_.nextmap = function(){
    console.log('c_.nextmap()');
    o_.map.next();
};

// disable wall collisions
c_.noclip = function(){
    
    if (cfg.noclip) {
        
        r_.drawMessage( u_.msg.STSTR_NCOFF );
    
    } else {
        
        r_.drawMessage( u_.msg.STSTR_NCON );
    }
    cfg.noclip = !cfg.noclip;
};

c_.opendoor = function(sector, special){
    console.log('c_.opendoor(',sector,')');
    
    var backlines   = [];
    var frontlines  = [];
    var walls       = [];
    var ceiling     = [];
    var sectors     = [];
    var height      = 666;
    
    special         = (special == undefined) ? 1 : special;   
    
    // collect lines    
    for (var i in o_.map.sidedef){

        var tside = o_.map.sidedef[i];

        if (tside.sector == sector){

            // get lines
            for (var j in o_.map.linedef){                                

                var tline = o_.map.linedef[j];

                if (tline.sideback == i ) {                    

                    var heightceiling = o_.map.sector[ o_.map.sidedef[ tline.sidefront ].sector ].heightceiling;
                    // choose lowest
                    height = (height > heightceiling) ? heightceiling : height;

                    backlines.push(j);

                } else if ( tline.sidefront == i) {

                    frontlines.push(j);

                }
            }
        }
    }

    // find walls
    //
    for (var i in r_.walls) {

        for (var j in backlines){

            if ( r_.walls[i].linedef == backlines[j]){                                

                walls.push(i);

            } else if ( r_.walls[i].linedef == frontlines[j]){

                //resize frontwalls to fill gaps
                r_.walls[i].scale.y = height +2;
                r_.walls[i].position.y += (height/2);
            }
        }
    }

    // find ceiling
    //
    for (var i in r_.ceilings) {

        if (r_.ceilings[i].sector == sector){

            ceiling = i;
        }
    }

    o_.map.actions.push({ 
        special     : special, 
        sector      : sector,
        ceiling     : ceiling,
        walls       : walls,
        height      : height 
    });  
     
};

c_.opendoorTag = function( tag, special ){
    
    var sectors = [];
    
    for (var s in o_.map.sector) {
            
        var sector = o_.map.sector[s];

        if (sector.id == tag) {

            sectors.push(s);
        }

        if (s == o_.map.sector.length-1){

            for (var s in sectors) {
            
                c_.opendoor( sectors[s], special);
            }
        }
    }
};

c_.prevweapon = function(){
    
    //for ()
};

c_.slot1 = function(){
    
    p_.switchWeaponSlot(1);
};

c_.slot2 = function(){
    
    p_.switchWeaponSlot(2);
};

c_.slot3 = function(){
    
    p_.switchWeaponSlot(3);
};

c_.slot4 = function(){
    
    p_.switchWeaponSlot(4);
};

c_.slot5 = function(){
    
    p_.switchWeaponSlot(5);
};

c_.slot6 = function(){
    
    p_.switchWeaponSlot(6);
};

c_.slot7 = function(){
    
    p_.switchWeaponSlot(7);
};

c_.slot8 = function(){
    
    p_.switchWeaponSlot(8);
};

c_.slot9 = function(){
    
    p_.switchWeaponSlot(9);
};

c_.slot0 = function(){
    
    p_.switchWeaponSlot(0);
};

// Random generator: from, to
c_.random = function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

c_.zoomin = function(){
    r_.mode.next();
};

c_.zoomout = function(){
    r_.mode.prev();
};

c_.init = function(o){
    
};

c_.postInit = function(o){
    
};

core.loadNext();