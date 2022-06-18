import { vec3, vec4, vec2 } from "../common/math/TSM";
import { IDoom3Token, IDoom3Tokenizer, Doom3Factory } from "../common/utils/Tokenizer";
import { MathHelper} from "../common/math/MathHelper";
import { TypedArrayList } from "../common/container/TypedArrayList";

export class Doom3BspNode {
    public plane: vec4 = new vec4();  // 平面数据
    public front: number = -1;        // BSP平面正面所指向的area号
    public back: number = -1;         // BSP平面背面所指向的area号
}

// 每个portal属于哪个两个area
export class Doom3Portal {
    public index: number = -1;         // 在portal列表中的索引号
    public points: vec3[] = [];        // portal的顶点数据
    public plane: vec4 = new vec4();   // portal的平面数据
    public areas: number[] = new Array<number>( 2 );  // 一个portal可以被连接最多两个area
}

// 一个area包含多个portal
export class Doom3Area {
    public name: string = "";
    public portals: number[] = [];           // 一个区域可以包含n个portal
    public surfaces: Doom3Surface[] = [];    // 一个区域由多个surface组成

    // 整个Area(可以看成房间)的绑定盒大小
    public mins: vec3 = new vec3( [ Infinity, Infinity, Infinity ] );          // 绑定盒mins
    public maxs: vec3 = new vec3( [ -Infinity, -Infinity, -Infinity ] );       // 绑定盒maxs
}

// Doom3 PROC的顶点格式数据
export class Doom3Vertex {
    public pos: vec3 = new vec3();  // 位置坐标向量
    public st: vec2 = new vec2();   // 纹理坐标向量
    public normal: vec3 = new vec3(); // 法向量
}

// 一个area可以由多个surface组成
// 一个surface使用同一种材质，并且具有顶点和索引缓存
export class Doom3Surface {
    public material: string = "";  // 当前表面所用的材质名称
    public vertices: Doom3Vertex[] = []; // 当前表面顶点数据集合
    public indices: number[] = []; // 当前顶点的索引数据集合
    // 当前表面的绑定盒
    public mins: vec3 = new vec3( [ Infinity, Infinity, Infinity ] );
    public maxs: vec3 = new vec3( [ -Infinity, -Infinity, -Infinity ] );
}

export class Doom3ProcParser {
    public pathPrifix: string = "./data/doom3/";
    public version: number = -1;
    public nodes: Doom3BspNode[] = [];
    public areas: Doom3Area[] = [];
    public portals: Doom3Portal[] = [];
    public mins: vec3 = new vec3( [ Infinity, Infinity, Infinity ] );
    public maxs: vec3 = new vec3( [ -Infinity, -Infinity, -Infinity ] );

    public parse ( source: string ): void {
        // 使用Doom3Factory的工厂方法createTokenizer创建IDoom3Tokenizer接口
        let tokenizer: IDoom3Tokenizer = Doom3Factory.createTokenizer();
        // 再用IDoom3Tokenizer接口的createToken方法创建一直被重用的IDoom3Token接口
        let token: IDoom3Token = tokenizer.createToken();
        // 设置IDoom3Tokenizer解析器要解析的字符串数据
        tokenizer.setSource( source );
        // 到目前位置，我们已经设置好要解析的数据了，接下来就要进入循环解析流程了
        // 1、读取PROC文件的版本号字符串
        this._readMapVersion( tokenizer, token );
        // 2、只要getNextToken返回true，就一直循环
        while ( tokenizer.getNextToken( token ) ) {
            // 如果碰到关键字"model"
            if ( token.isString( "model" ) === true ) {
                // 则调用_readArea方法解析房间渲染数据
                this._readArea( tokenizer, token );
            } // 如果碰到interAreaPortals关键字
            else if ( token.isString( "interAreaPortals" ) === true ) {
                // 则调用_readPortals方法解析门廊数据
                this._readPortals( tokenizer, token );
            } // 如果碰到nodels关键字
            else if ( token.isString( "nodes" ) === true ) {
                // 则调用_readNodes方法解析BSP Node数据
                this._readNodes( tokenizer, token );
            }
        }
    }

    public makeSurfaceVerticesTo ( areaId: number, surfId: number, arr: TypedArrayList<Float32Array> ): void {
        let area: Doom3Area = this.areas[ areaId ];
        let surf: Doom3Surface = area.surfaces[ surfId ];
        for ( let i: number = 0; i < surf.vertices.length; i++ ) {
            let v: Doom3Vertex = surf.vertices[ i ];
            arr.push( v.pos.x );
            arr.push( v.pos.y );
            arr.push( v.pos.z );
            arr.push( v.st.x );
            arr.push( v.st.y );
        }
    }

    public makeSurfaceIndicesTo ( areaId: number, surfId: number, arr: TypedArrayList<Uint16Array> ): void {
        let area: Doom3Area = this.areas[ areaId ];
        let surf: Doom3Surface = area.surfaces[ surfId ];
        for ( let i: number = 0; i < surf.indices.length; i++ ) {
            let idx: number = surf.indices[ i ];
            arr.push( idx );
        }
    }

    public makeAreaStaticMeshData ( areaId: number, verts: TypedArrayList<Float32Array>, indices: TypedArrayList<Uint16Array> ): void {
        let area: Doom3Area = this.areas[ areaId ];
        for ( let j: number = 0; j < area.surfaces.length; j++ ) {
            this.makeSurfaceVerticesTo( areaId, j, verts );
            this.makeSurfaceIndicesTo( areaId, j, indices );
        }
    }

    public makeSceneStaticMeshData ( verts: TypedArrayList<Float32Array>, indices: TypedArrayList<Uint16Array> ): void {
        for ( let i: number = 0; i < this.areas.length; i++ ) {
            for ( let j: number = 0; j < this.areas[ i ].surfaces.length; j++ ) {
                this.makeSurfaceVerticesTo( i, j, verts );
                this.makeSurfaceIndicesTo( i, j, indices );
            }
        }
    }

    public makeAllSurfVertsPosTo ( arr: vec3[] ): void {
        for ( let i: number = 0; i < this.areas.length; i++ ) {
            let area: Doom3Area = this.areas[ i ];
            for ( let j: number = 0; j < area.surfaces.length; j++ ) {
                let surf: Doom3Surface = area.surfaces[ j ];
                for ( let k: number = 0; k < surf.vertices.length; k++ ) {
                    let v: Doom3Vertex = surf.vertices[ k ];
                    // 使用复制，而不是引用
                    arr.push( v.pos.copy() );
                }
            }
        }
    }

    

    private _readMapVersion ( parser: IDoom3Tokenizer, token: IDoom3Token ): void {
        parser.getNextToken( token );
        let str: string = token.getString();
        if ( str.indexOf( "mapProcFile" ) < 0 ) {
            throw new Error( "目前仅支持Doom3格式地图" )
        }
        str = str.substring( 11 );
        this.version = parseInt( str );
    }

    private _readSurfaces ( parser: IDoom3Tokenizer, token: IDoom3Token ): Doom3Surface {
        let surf: Doom3Surface = new Doom3Surface(); // 分配Doom3Surface对象的内存
        let ptCount: number = 0; // 顶点的数量
        let idxCount: number = 0; // 索引的数量
        parser.getNextToken( token ); // 跳过 {
        // 获取材质名称
        parser.getNextToken( token ); 
        surf.material = token.getString();
        // 获取顶点数量
        parser.getNextToken( token );
        ptCount = token.getInt(); // 顶点数量
        // 获取索引数量
        parser.getNextToken( token );
        idxCount = token.getInt(); // 索引数量
        // 遍历生成所有Doom3Vertex对象
        for ( let i: number = 0; i < ptCount; i++ ) {
            let p: Doom3Vertex = new Doom3Vertex(); // 分配内存
            // 每个顶点是通过()来表示的，因此开头要跳过左括号(，顶点解析结束后要跳过右括号)
            parser.getNextToken( token ); // 跳过  ( 
            // 3个float,表示顶点坐标，并将doom3坐标系转换为WebGL坐标系
            parser.getNextToken( token );
            p.pos.x = token.getFloat();
            parser.getNextToken( token );
            p.pos.y = token.getFloat();
            parser.getNextToken( token );
            p.pos.z = token.getFloat();
            MathHelper.convertVec3IDCoord2GLCoord( p.pos ); // id顶点坐标系转换成WebGL顶点坐标系
            // 2个float，表示纹理坐标，并将Doom3纹理坐标系转换为WebGL纹理坐标系
            parser.getNextToken( token );
            p.st.x = token.getFloat();
            parser.getNextToken( token );
            p.st.y = token.getFloat();
            MathHelper.convertVec2IDCoord2GLCoord( p.st ); // id纹理坐标系转换成WebGL纹理坐标系
            // 3个float，表示法向量
            parser.getNextToken( token );
            p.normal.x = token.getFloat();
            parser.getNextToken( token );
            p.normal.y = token.getFloat();
            parser.getNextToken( token );
            p.normal.z = token.getFloat();
            MathHelper.convertVec3IDCoord2GLCoord( p.normal );  // id顶点坐标系转换成WebGL顶点坐标系
            // 将生成的Doom3Vertex添加到表面的vertices数组中去
            surf.vertices.push( p );
            // 计算当前表面的aabb包围体
            MathHelper.boundBoxAddPoint( surf.vertices[ i ].pos, surf.mins, surf.maxs );
            parser.getNextToken( token );//跳过右括号
        }
        // 到此处，说明顶点全部解析完成，接下来解析索引数据
        // 注意下面遍历是i+=3的步进，原因是要将顺时针表示的索引转换为逆时针表示
        for ( let i: number = 0; i < idxCount; i += 3 ) {
            // 连续读取i,i+1和i+2的三个索引
            parser.getNextToken( token );
            let a: number = token.getInt();
            parser.getNextToken( token );
            let b: number = token.getInt();
            parser.getNextToken( token );
            let c: number = token.getInt();
            // Doom3中，索引是顺时针的，webgl中是逆时针的，这是一个有用的技巧
            // 将三个索引加入到表面的indices数组中去，此时都是逆时针方向存储的
            surf.indices.push( c );
            surf.indices.push( b );
            surf.indices.push( a );
            // 这也是为什么要i+=3
        }
        parser.getNextToken( token ); //跳过右大括号
        console.log( "surface mins = " + JSON.stringify( surf.mins ) );
        console.log( "surface maxs = " + JSON.stringify( surf.maxs ) );
        return surf;
    }

    // 读取一个area对象
    private _readArea ( parser: IDoom3Tokenizer, token: IDoom3Token ): void {
        let area: Doom3Area = new Doom3Area(); // 分配Doom3Area对象内存

        let surfCount: number = 0;
        parser.getNextToken( token ); // 跳过左花括号 {
        parser.getNextToken( token ); // 获得name的token，是字符串类型
        area.name = token.getString(); // 获得model的name,例如"area0"

        parser.getNextToken( token ); // 获得表面数量的token，该token类型为整数类型
        surfCount = token.getInt();   // 因此调用getInt获得表面数量
        // 知道了当前area有多个surface,就开始遍历得到所有的Doom3Surface对象
        for ( let i: number = 0; i < surfCount; i++ ) {
            // 调用_readSurface方法，生成Doom3Surface对象
            let surf: Doom3Surface = this._readSurfaces( parser, token );
            area.surfaces.push( surf ); // 将生成的Doom3Surface存储到surfaces数组中去
            // 计算area的绑定盒
            MathHelper.boundBoxAddPoint( surf.mins, area.mins, area.maxs );
            MathHelper.boundBoxAddPoint( surf.maxs, area.mins, area.maxs );
            console.log( "area mins = ", JSON.stringify( area.mins ) );
            console.log( "area maxs = ", JSON.stringify( area.maxs ) );
        }
        // 到这里，完成了所有表面的数据解析
        parser.getNextToken( token ); // 跳过 }
        // 到这里，说明model全部结束
        // 构造场景级的绑定盒
        MathHelper.boundBoxAddPoint( area.mins, this.mins, this.maxs );
        MathHelper.boundBoxAddPoint( area.maxs, this.mins, this.maxs );
        // 将当前解析完成的model加入到areas数组中去
        this.areas.push( area );
    }

    private _readNodes ( parser: IDoom3Tokenizer, token: IDoom3Token ): void {
        let nodeCount: number = 0;
        parser.getNextToken( token ); // 跳过 {
        parser.getNextToken( token ); // 获取节点的数量
        nodeCount = token.getInt();
        // 遍历所有Bsp节点
        for ( let i: number = 0; i < nodeCount; i++ ) {
            let node: Doom3BspNode = new Doom3BspNode();
            parser.getNextToken( token )  // 跳过  ( 
            // 读取plane.x
            parser.getNextToken( token );
            node.plane.x = token.getFloat();
            // 读取plane.y
            parser.getNextToken( token );
            node.plane.y = token.getFloat();
            // 读取plane.z
            parser.getNextToken( token );
            node.plane.z = token.getFloat();
            // 读取plane.w
            parser.getNextToken( token );
            node.plane.w = token.getFloat();
            parser.getNextToken( token ); // 跳过  ) 
            // front area index
            parser.getNextToken( token ); 
            node.front = token.getInt();
            // back area index
            parser.getNextToken( token ); 
            node.back = token.getInt();
            this.nodes.push( node );
        }
        parser.getNextToken( token ); // 跳过 }
    }

    private _readPortals ( parser: IDoom3Tokenizer, token: IDoom3Token ): void {
        let portalCount: number = 0;
        let ptCount: number = 0;
        let area0: number = -1;
        let area1: number = -1;
        parser.getNextToken( token ); // 跳过 {
        parser.getNextToken( token ); // 跳过areaCount
        // 读取portal门廊数量
        parser.getNextToken( token );
        portalCount = token.getInt(); // 读取portal数量
        // 遍历所有的门廊
        for ( let i: number = 0; i < portalCount; i++ ) {
            let portal: Doom3Portal = new Doom3Portal();
            parser.getNextToken( token );
            ptCount = token.getInt(); // 当前portal的顶点数量

            parser.getNextToken( token );
            area0 = token.getInt(); // 当前portal0的正面area索引号

            parser.getNextToken( token );
            area1 = token.getInt(); // 当前portal0的反面的area索引号

            // 设置portal正反面的房间号索引
            portal.areas[ 0 ] = area0;
            portal.areas[ 1 ] = area1;

            // portal的顶点坐标
            for ( let j: number = 0; j < ptCount; j++ ) {
                let pt: vec3 = new vec3();
                parser.getNextToken( token ); // 跳过  ( 
                // x
                parser.getNextToken( token );
                pt.x = token.getFloat();
                // y
                parser.getNextToken( token );
                pt.y = token.getFloat();
                // z
                parser.getNextToken( token );
                pt.z = token.getFloat();
                parser.getNextToken( token ); // 跳过  ) 

                // 将Doom3顶点坐标系转换成WebGL坐标系
                MathHelper.convertVec3IDCoord2GLCoord( pt );
                portal.points.push( pt ); // 添加到portal的points数组中去
            }
            this.portals.push( portal ); // 将poral添加到Doom3ProcParser的portals数组中去
        }
    }
}