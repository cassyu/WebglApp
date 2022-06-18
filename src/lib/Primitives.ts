import { vec2, vec3, vec4, mat4 } from "../common/math/TSM";
import { GLAttribBits, GLAttribState } from "../webgl/WebGLAttribState";
import { GLStaticMesh } from "../webgl/WebGLMesh"
import { MathHelper } from "../common/math/MathHelper";

export class GeometryData
{
    // 输入顶点属性数据
    public positions: vec3[] = [];
    public uvs: vec2[] = [];
    public normals: vec3[] = [];
    public colors: vec4[] = [];
    public tangents: vec4[] = [];
    public indices: number[] = [];

    public makeStaticVAO ( gl: WebGLRenderingContext, needNormals: boolean = false, needUV: boolean = true ): GLStaticMesh
    {
        let bits: GLAttribBits = this.getAttribBits();
        if ( needNormals === false )
        {
            bits &= ~GLAttribState.NORMAL_BIT;
        }
        if ( needUV === false )
        {
            bits &= ~GLAttribState.TEXCOORD_BIT;
        }

        let stride: number = GLAttribState.getVertexByteStride( bits );
        let step: number = stride / Float32Array.BYTES_PER_ELEMENT;
        let arrayBuffer: ArrayBuffer = new ArrayBuffer( stride * this.positions.length );
        let buffer = new Float32Array( arrayBuffer );
        for ( let i: number = 0; i < this.positions.length; i++ )
        {
            // 位置
            let j: number = i * step;
            let idx: number = 0;
            buffer[ j + ( idx++ ) ] = this.positions[ i ].x;
            buffer[ j + ( idx++ ) ] = this.positions[ i ].y;
            buffer[ j + ( idx++ ) ] = this.positions[ i ].z;
            //法线(用了bits后，不能用length来判断了！！！)
            if ( bits & GLAttribState.NORMAL_BIT )
            {
                buffer[ j + ( idx++ ) ] = this.normals[ i ].x;
                buffer[ j + ( idx++ ) ] = this.normals[ i ].y;
                buffer[ j + ( idx++ ) ] = this.normals[ i ].z;
            }
            //纹理
            if ( bits & GLAttribState.TEXCOORD_BIT )
            {
                buffer[ j + ( idx++ ) ] = this.uvs[ i ].x;
                buffer[ j + ( idx++ ) ] = this.uvs[ i ].y;
            }
            //颜色
            if ( bits & GLAttribState.COLOR_BIT )
            {
                buffer[ j + ( idx++ ) ] = this.colors[ i ].x;
                buffer[ j + ( idx++ ) ] = this.colors[ i ].y;
                buffer[ j + ( idx++ ) ] = this.colors[ i ].z;
                buffer[ j + ( idx++ ) ] = this.colors[ i ].w;
            }
            //切线
            if ( bits & GLAttribState.TANGENT_BIT )
            {
                buffer[ j + ( idx++ ) ] = this.tangents[ i ].x;
                buffer[ j + ( idx++ ) ] = this.tangents[ i ].y;
                buffer[ j + ( idx++ ) ] = this.tangents[ i ].z;
                buffer[ j + ( idx++ ) ] = this.tangents[ i ].w;
            }
        }
        let mesh: GLStaticMesh = new GLStaticMesh( gl, bits, buffer, this.indices.length > 0 ? new Uint16Array( this.indices ) : null );
        this.buildBoundingBoxTo( mesh.mins, mesh.maxs );
        return mesh;
    }

    public buildBoundingBoxTo ( mins: vec3, maxs: vec3 ): void
    {
        for ( let i: number = 0; i < this.positions.length; i++ )
        {
            MathHelper.boundBoxAddPoint( this.positions[ i ], mins, maxs );
        }
    }

    public getAttribBits (): GLAttribBits
    {
        if ( this.positions.length === 0 )
        {
            throw new Error( "必须要有顶数据!!!" );
        }

        let bits: GLAttribBits = GLAttribState.POSITION_BIT;
        if ( this.uvs.length > 0 )
        {
            bits |= GLAttribState.TEXCOORD_BIT;
        }
        if ( this.normals.length > 0 )
        {
            bits |= GLAttribState.NORMAL_BIT;
        }
        if ( this.colors.length > 0 )
        {
            bits |= GLAttribState.COLOR_BIT;
        }
        if ( this.tangents.length > 0 )
        {
            bits |= GLAttribState.TANGENT_BIT;
        }
        return bits;
    }
}

export class Cube
{
    public halfWidth: number;
    public halfHeight: number;
    public halfDepth: number;

    public constructor ( halfWidth: number = 0.2, halfHeight: number = 0.2, halfDepth: number = 0.2 )
    {
        this.halfWidth = halfWidth;
        this.halfHeight = halfHeight;
        this.halfDepth = halfDepth;
    }

    /*
            /3--------/7  |
            / |       /   |
            /  |      /   |
            1---------5   |
            |  /2- - -|- -6
            | /       |  /
            |/        | /
            0---------4/

    */

    public makeGeometryDataWithTextureCooord (): GeometryData
    {
        let data: GeometryData = new GeometryData();
        data.positions = [
            new vec3( [ -this.halfWidth, -this.halfHeight, this.halfDepth ] ), // 0
            new vec3( [ this.halfWidth, -this.halfHeight, this.halfDepth ] ),  // 4
            new vec3( [ this.halfWidth, this.halfHeight, this.halfDepth ] ),  // 5

        ];
        data.uvs = [
            new vec2( [ 0, 0 ] ),
            new vec2( [ 1, 0 ] ),
            new vec2( [ 1, 1 ] ),
        ];
        return data;
    }

    public makeGeometryData (): GeometryData
    {
        let data: GeometryData = new GeometryData();
        data.positions.push( new vec3( [ -this.halfWidth, -this.halfHeight, this.halfDepth ] ) ); // 0
        data.uvs.push( new vec2( [ 1, 0 ] ) );

        data.positions.push( new vec3( [ -this.halfWidth, this.halfHeight, this.halfDepth ] ) ); // 1
        data.uvs.push( new vec2( [ 1, 1 ] ) );

        data.positions.push( new vec3( [ -this.halfWidth, -this.halfHeight, -this.halfDepth ] ) ); // 2
        data.uvs.push( new vec2( [ 0, 0 ] ) );

        data.positions.push( new vec3( [ -this.halfWidth, this.halfHeight, -this.halfDepth ] ) ); // 3
        data.uvs.push( new vec2( [ 0, 1 ] ) );

        data.positions.push( new vec3( [ this.halfWidth, -this.halfHeight, this.halfDepth ] ) ); // 4
        data.uvs.push( new vec2( [ 0, 0 ] ) );

        data.positions.push( new vec3( [ this.halfWidth, this.halfHeight, this.halfDepth ] ) );  // 5
        data.uvs.push( new vec2( [ 0, 1 ] ) );

        data.positions.push( new vec3( [ this.halfWidth, -this.halfHeight, -this.halfDepth ] ) ); // 6
        data.uvs.push( new vec2( [ 1, 0 ] ) );

        data.positions.push( new vec3( [ this.halfWidth, this.halfHeight, -this.halfDepth ] ) );  // 7
        data.uvs.push( new vec2( [ 1, 1 ] ) );

        // 法线朝外
        data.indices.push( 0, 1, 3, 0, 3, 2 ); // 左面
        data.indices.push( 3, 7, 6, 3, 6, 2 ); // 后面
        data.indices.push( 6, 7, 5, 6, 5, 4 ); // 右面
        data.indices.push( 5, 1, 0, 5, 0, 4 ); // 前面
        data.indices.push( 1, 5, 7, 1, 7, 3 ); // 上面
        data.indices.push( 2, 6, 4, 2, 4, 0 ); // 下面
        return data;
    }
}

export class GridPlane
{
    public sx: number;
    public sy: number;
    public nx: number;
    public ny: number;

    public constructor ( sx: number = 10, sy: number = 10, nx: number = 10, ny: number = 10 )
    {
        this.sx = sx;
        this.sy = sy;
        this.nx = nx;
        this.ny = ny;
    }

    public makeGeometryData (): GeometryData
    {
        let data: GeometryData = new GeometryData();
        for ( let iy: number = 0; iy <= this.ny; iy++ )
        {
            for ( let ix: number = 0; ix <= this.nx; ix++ )
            {
                let u: number = ix / this.nx;
                let v: number = iy / this.ny;
                let x: number = -this.sx / 2 + u * this.sx; // starts on the left
                let y: number = this.sy / 2 - v * this.sy; // starts at the top
                data.positions.push( new vec3( [ x, y, 0 ] ) );
                data.uvs.push( new vec2( [ u, 1.0 - v ] ) );
                data.normals.push( new vec3( [ 0, 0, 1 ] ) );
                if ( iy < this.ny && ix < this.nx )
                {
                    {
                        data.indices.push( iy * ( this.nx + 1 ) + ix, ( iy + 1 ) * ( this.nx + 1 ) + ix + 1, iy * ( this.nx + 1 ) + ix + 1 );
                        data.indices.push( ( iy + 1 ) * ( this.nx + 1 ) + ix + 1, iy * ( this.nx + 1 ) + ix, ( iy + 1 ) * ( this.nx + 1 ) + ix );
                    }
                }
            }
        }
        return data;
    }
}
