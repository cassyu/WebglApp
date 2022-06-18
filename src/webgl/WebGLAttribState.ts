export type GLAttribBits = number;
export type GLAttribOffsetMap = { [ key: string ]: number };

export class GLAttribState
{
    // 顶点属性
    public static readonly POSITION_BIT: number = ( 1 << 0 );
    public static readonly POSITION_COMPONENT: number = 3; //xyz
    public static readonly POSITION_NAME: string = "aPosition";
    public static readonly POSITION_LOCATION: number = 0;

    public static readonly TEXCOORD_BIT: number = ( 1 << 1 );
    public static readonly TEXCOORD_COMPONENT: number = 2; //st
    public static readonly TEXCOORD_NAME: string = "aTexCoord";
    public static readonly TEXCOORD_LOCATION: number = 1;

    public static readonly TEXCOORD1_BIT: number = ( 1 << 2 );
    public static readonly TEXCOORD1_COMPONENT: number = 2;
    public static readonly TEXCOORD1_NAME: string = "aTexCoord1";
    public static readonly TEXCOORD1_LOCATION: number = 2;

    public static readonly NORMAL_BIT: number = ( 1 << 3 );
    public static readonly NORMAL_COMPONENT: number = 3; //xyz
    public static readonly NORMAL_NAME: string = "aNormal";
    public static readonly NORMAL_LOCATION: number = 3;

    public static readonly TANGENT_BIT: number = ( 1 << 4 );
    public static readonly TANGENT_COMPONENT: number = 4; //xyzw
    public static readonly TANGENT_NAME: string = "aTangent";
    public static readonly TANGENT_LOCATION: number = 4;

    public static readonly COLOR_BIT: number = ( 1 << 5 );
    public static readonly COLOR_COMPONENT: number = 4;
    public static readonly COLOR_NAME: string = "aColor";
    public static readonly COLOR_LOCATION: number = 5;

    /*
    public static readonly WEIGHT0_BIT: number = (1 << 7);
    public static readonly WEIGHT1_BIT: number = (1 << 8);
    public static readonly WEIGHT2_BIT: number = (1 << 9);
    public static readonly WEIGHT3_BIT: number = (1 << 10);
    */

    public static readonly ATTRIBSTRIDE: string = "STRIDE";
    public static readonly ATTRIBBYTELENGTH: string = "BYTELENGTH";

    public static readonly FLOAT32_SIZE = Float32Array.BYTES_PER_ELEMENT;
    public static readonly UINT16_SIZE = Uint16Array.BYTES_PER_ELEMENT;

    public static makeVertexAttribs ( 
        useTexcoord0: boolean, 
        useTexcoord1: boolean, 
        useNormal: boolean, 
        useTangent: boolean, 
        useColor: boolean ): GLAttribBits
    {
        // 不管如何，总是使用位置坐标属性
        let bits: GLAttribBits = GLAttribState.POSITION_BIT;
        // 使用 |= 操作符添加标记位
        if ( useTexcoord0 === true )
        {
            bits |= GLAttribState.TEXCOORD_BIT;
        }
        if ( useTexcoord1 === true )
        {
            bits |= GLAttribState.TEXCOORD1_BIT;
        }
        if ( useNormal === true )
        {
            bits |= GLAttribState.NORMAL_BIT;
        }
        if ( useTangent === true )
        {
            bits |= GLAttribState.TANGENT_BIT;
        }
        if ( useColor === true )
        {
            bits |= GLAttribState.COLOR_BIT;
        }
        return bits;
    }

    // 使用按位与（&）操作符来测试否是包含某个位标记值
    public static hasPosition ( attribBits: GLAttribBits ): boolean { return ( attribBits & GLAttribState.POSITION_BIT ) !== 0; }
    public static hasNormal ( attribBits: GLAttribBits ): boolean { return ( attribBits & GLAttribState.NORMAL_BIT ) !== 0; }
    public static hasTexCoord_0 ( attribBits: GLAttribBits ): boolean { return ( attribBits & GLAttribState.TEXCOORD_BIT ) !== 0; }
    public static hasTexCoord_1 ( attribBits: GLAttribBits ): boolean { return ( attribBits & GLAttribState.TEXCOORD1_BIT ) !== 0; }
    public static hasColor ( attribBits: GLAttribBits ): boolean { return ( attribBits & GLAttribState.COLOR_BIT ) !== 0; }
    public static hasTangent ( attribBits: GLAttribBits ): boolean { return ( attribBits & GLAttribState.TANGENT_BIT ) !== 0; }

    public static setAttribVertexArrayPointer ( gl: WebGLRenderingContext, offsetMap: GLAttribOffsetMap ): void
    {
        let stride: number = offsetMap[ GLAttribState.ATTRIBSTRIDE ];
        if ( stride === 0 )
        {
            throw new Error( "vertex Array有问题！！" );
        }

        // sequenced的话stride为0
        if ( stride !== offsetMap[ GLAttribState.ATTRIBBYTELENGTH ] )
        {
            stride = 0;
        }

        if ( stride === undefined )
        {
            stride = 0;
        }

        let offset: number = offsetMap[ GLAttribState.POSITION_NAME ];
        if ( offset !== undefined )
        {
            gl.vertexAttribPointer( GLAttribState.POSITION_LOCATION, GLAttribState.POSITION_COMPONENT, gl.FLOAT, false, stride, offset );
        }

        offset = offsetMap[ GLAttribState.NORMAL_NAME ];
        if ( offset !== undefined )
        {
            gl.vertexAttribPointer( GLAttribState.NORMAL_LOCATION, GLAttribState.NORMAL_COMPONENT, gl.FLOAT, false, stride, offset );
        }

        offset = offsetMap[ GLAttribState.TEXCOORD_NAME ];
        if ( offset !== undefined )
        {
            gl.vertexAttribPointer( GLAttribState.TEXCOORD_LOCATION, GLAttribState.TEXCOORD_COMPONENT, gl.FLOAT, false, stride, offset );
        }

        offset = offsetMap[ GLAttribState.TEXCOORD1_NAME ];
        if ( offset !== undefined )
        {
            gl.vertexAttribPointer( GLAttribState.TEXCOORD1_LOCATION, GLAttribState.TEXCOORD1_COMPONENT, gl.FLOAT, false, stride, offset );
        }

        offset = offsetMap[ GLAttribState.COLOR_NAME ];
        if ( offset !== undefined )
        {
            gl.vertexAttribPointer( GLAttribState.COLOR_LOCATION, GLAttribState.COLOR_COMPONENT, gl.FLOAT, false, stride, offset );
        }

        offset = offsetMap[ GLAttribState.TANGENT_NAME ];
        if ( offset !== undefined )
        {
            gl.vertexAttribPointer( GLAttribState.TANGENT_LOCATION, GLAttribState.TANGENT_COMPONENT, gl.FLOAT, false, stride, offset );
        }
    }

    public static setAttribVertexArrayState ( gl: WebGLRenderingContext, attribBits: number, enable: boolean = true ): void
    {
        if ( GLAttribState.hasPosition( attribBits ) )
        {
            if ( enable )
            {
                gl.enableVertexAttribArray( GLAttribState.POSITION_LOCATION );
            } else
            {
                gl.disableVertexAttribArray( GLAttribState.POSITION_LOCATION );
            }
        } else
        {
            gl.disableVertexAttribArray( GLAttribState.POSITION_LOCATION );
        }

        if ( GLAttribState.hasNormal( attribBits ) )
        {
            if ( enable )
            {
                gl.enableVertexAttribArray( GLAttribState.NORMAL_LOCATION );
            } else
            {
                gl.disableVertexAttribArray( GLAttribState.NORMAL_LOCATION );
            }
        } else
        {
            gl.disableVertexAttribArray( GLAttribState.NORMAL_LOCATION );
        }

        if ( GLAttribState.hasTexCoord_0( attribBits ) )
        {
            if ( enable )
            {
                gl.enableVertexAttribArray( GLAttribState.TEXCOORD_LOCATION );
            } else
            {
                gl.disableVertexAttribArray( GLAttribState.TEXCOORD_LOCATION );
            }
        } else
        {
            gl.disableVertexAttribArray( GLAttribState.TEXCOORD_LOCATION );
        }

        if ( GLAttribState.hasTexCoord_1( attribBits ) )
        {
            if ( enable )
            {
                gl.enableVertexAttribArray( GLAttribState.TEXCOORD1_LOCATION );
            } else
            {
                gl.disableVertexAttribArray( GLAttribState.TEXCOORD1_LOCATION );
            }
        } else
        {
            gl.disableVertexAttribArray( GLAttribState.TEXCOORD1_LOCATION );
        }

        if ( GLAttribState.hasColor( attribBits ) )
        {
            if ( enable )
            {
                gl.enableVertexAttribArray( GLAttribState.COLOR_LOCATION );
            } else
            {
                gl.disableVertexAttribArray( GLAttribState.COLOR_LOCATION );
            }
        } else
        {
            gl.disableVertexAttribArray( GLAttribState.COLOR_LOCATION );
        }

        if ( GLAttribState.hasTangent( attribBits ) )
        {
            if ( enable )
            {
                gl.enableVertexAttribArray( GLAttribState.TANGENT_LOCATION );
            } else
            {
                gl.disableVertexAttribArray( GLAttribState.TANGENT_LOCATION );
            }
        } else
        {
            gl.disableVertexAttribArray( GLAttribState.TANGENT_LOCATION );
        }
    }

    public static getVertexByteStride ( attribBits: GLAttribBits ): number
    {
        let byteOffset: number = 0;

        if ( GLAttribState.hasPosition( attribBits ) )
        {
            byteOffset += GLAttribState.POSITION_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }

        if ( GLAttribState.hasNormal( attribBits ) )
        {
            byteOffset += GLAttribState.NORMAL_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }

        if ( GLAttribState.hasTexCoord_0( attribBits ) )
        {
            byteOffset += GLAttribState.TEXCOORD_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }

        if ( GLAttribState.hasTexCoord_1( attribBits ) )
        {
            byteOffset += GLAttribState.TEXCOORD1_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }

        if ( GLAttribState.hasColor( attribBits ) )
        {
            byteOffset += GLAttribState.COLOR_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }

        if ( GLAttribState.hasTangent( attribBits ) )
        {
            byteOffset += GLAttribState.TANGENT_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }

        return byteOffset;
    }

    public static getSequencedLayoutAttribOffsetMap ( attribBits: GLAttribBits, vertCount: number ): GLAttribOffsetMap
    {
        let offsets: GLAttribOffsetMap = {}; // 初始化顶点属性偏移表
        let byteOffset: number = 0; // 初始化时的首地址为0
        if ( GLAttribState.hasPosition( attribBits ) )
        {
            // 记录位置坐标的首地址
            offsets[ GLAttribState.POSITION_NAME ] = 0; 
            // 位置坐标由3个float值组成，因此下一个属性的首地址位 3 * 4 * 顶点数量
            byteOffset += vertCount * GLAttribState.POSITION_COMPONENT * GLAttribState.FLOAT32_SIZE; 
        }
        if ( GLAttribState.hasNormal( attribBits ) )
        {
            offsets[ GLAttribState.NORMAL_NAME ] = byteOffset;
            byteOffset += vertCount * GLAttribState.NORMAL_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if ( GLAttribState.hasTexCoord_0( attribBits ) )
        {
            offsets[ GLAttribState.TEXCOORD_NAME ] = byteOffset;
            byteOffset += vertCount * GLAttribState.TEXCOORD_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if ( GLAttribState.hasTexCoord_1( attribBits ) )
        {
            offsets[ GLAttribState.TEXCOORD1_NAME ] = byteOffset;
            byteOffset += vertCount * GLAttribState.TEXCOORD1_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if ( GLAttribState.hasColor( attribBits ) )
        {
            offsets[ GLAttribState.COLOR_NAME ] = byteOffset;
            byteOffset += vertCount * GLAttribState.COLOR_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if ( GLAttribState.hasTangent( attribBits ) )
        {
            offsets[ GLAttribState.TANGENT_NAME ] = byteOffset;
            byteOffset += vertCount * GLAttribState.TANGENT_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }

        //SequencedLayout具有ATTRIBSTRIDE和ATTRIBSTRIDE属性
        offsets[ GLAttribState.ATTRIBSTRIDE ] = byteOffset / vertCount; // 总的字节数 / 顶点数量  = 每个顶点的stride，实际上顺序存储时不需要这个值
        offsets[ GLAttribState.ATTRIBBYTELENGTH ] = byteOffset; // 总的字节数
        return offsets;
    }

    public static getInterleavedLayoutAttribOffsetMap ( attribBits: GLAttribBits ): GLAttribOffsetMap
    {
        let offsets: GLAttribOffsetMap = {}; // 初始化顶点属性偏移表
        let byteOffset: number = 0; // 初始化时的首地址为0

        if ( GLAttribState.hasPosition( attribBits ) )
        {
            // 记录位置坐标的首地址
            offsets[ GLAttribState.POSITION_NAME ] = 0;
            // 位置坐标由3个float值组成，因此下一个属性的首地址位 3 * 4 = 12个字节处
            byteOffset += GLAttribState.POSITION_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }

        // 下面各个属性偏移计算算法同上，唯一区别是分量的不同而已
        if ( GLAttribState.hasNormal( attribBits ) )
        {
            offsets[ GLAttribState.NORMAL_NAME ] = byteOffset;
            byteOffset += GLAttribState.NORMAL_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }

        if ( GLAttribState.hasTexCoord_0( attribBits ) )
        {
            offsets[ GLAttribState.TEXCOORD_NAME ] = byteOffset;
            byteOffset += GLAttribState.TEXCOORD_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if ( GLAttribState.hasTexCoord_1( attribBits ) )
        {
            offsets[ GLAttribState.TEXCOORD1_NAME ] = byteOffset;
            byteOffset += GLAttribState.TEXCOORD1_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }
        if ( GLAttribState.hasColor( attribBits ) )
        {
            offsets[ GLAttribState.COLOR_NAME ] = byteOffset;
            byteOffset += GLAttribState.COLOR_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }

        if ( GLAttribState.hasTangent( attribBits ) )
        {
            offsets[ GLAttribState.TANGENT_NAME ] = byteOffset;
            byteOffset += GLAttribState.TANGENT_COMPONENT * GLAttribState.FLOAT32_SIZE;
        }

        // stride和length相等
        offsets[ GLAttribState.ATTRIBSTRIDE ] = byteOffset;    // 间隔数组方法存储的话，顶点的stride非常重要
        offsets[ GLAttribState.ATTRIBBYTELENGTH ] = byteOffset;

        return offsets;
    }

    public static getSepratedLayoutAttribOffsetMap ( attribBits: GLAttribBits ): GLAttribOffsetMap
    {
        // 每个顶点属性使用一个vbo的话，每个offsets中的顶点属性的偏移都是为0
        // 并且offsets的length = vbo的个数，不需要顶点stride和byteLenth属性
        let offsets: GLAttribOffsetMap = {};
        let byteOffset: number = 0;

        if ( GLAttribState.hasPosition( attribBits ) )
        {
            offsets[ GLAttribState.POSITION_NAME ] = 0;
            
        }

        if ( GLAttribState.hasNormal( attribBits ) )
        {
            offsets[ GLAttribState.NORMAL_NAME ] = 0;
        }

        if ( GLAttribState.hasTexCoord_0( attribBits ) )
        {
            offsets[ GLAttribState.TEXCOORD_NAME ] = 0;
        }
        if ( GLAttribState.hasTexCoord_1( attribBits ) )
        {
            offsets[ GLAttribState.TEXCOORD1_NAME ] = 0;
        }
        if ( GLAttribState.hasColor( attribBits ) )
        {
            offsets[ GLAttribState.COLOR_NAME ] = 0;
        }

        if ( GLAttribState.hasTangent( attribBits ) )
        {
            offsets[ GLAttribState.TANGENT_NAME ] = 0;
        }

        return offsets;
    }

    public static isAttribStateValid ( attribBits: number ): boolean
    {
        // 一定要有位置向量
        if ( !GLAttribState.hasPosition( attribBits ) )
        {
            return false;
        }
        //计算tangent space必须要有uv坐标和法线向量
        if ( GLAttribState.hasTangent( attribBits ) )
        {
            if ( !GLAttribState.hasTexCoord_0( attribBits ) )
            {
                return false;
            }

            if ( !GLAttribState.hasNormal( attribBits ) )
            {
                return false;
            }
        }
        return true;
    }

}