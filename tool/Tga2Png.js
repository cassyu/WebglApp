let tga2png = require( 'tga2png' );
let fs = require( "fs" );
let path = require( "path" );

function readTgaAndWritePngSync ( path, paths )
{
    var pa = fs.readdirSync( path );
    pa.forEach( function ( ele, index )
    {
        let info = fs.statSync( path + "/" + ele )
        if ( info.isDirectory() )
        {
            readDirSync( path + "/" + ele, paths );
        } else
        {
            let tga = path + "/" + ele;
            // 判断是tga格式吗
            let idx = tga.indexOf( ".tga" );
            if ( idx !== -1 )
            {
                let png = tga.substring( 0, idx ) + ".png";
                paths.push( png );
                tga2png( tga, png );
            }
        }
    } );
}

let paths = [];
readTgaAndWritePngSync( "./data/textures", paths );
console.log( paths )

