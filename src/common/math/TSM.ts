
export let EPSILON: number = 0.0001;

export class vec2
{
    public values = new Float32Array( 2 );

    public get x (): number
    {
        return this.values[ 0 ];
    }

    public get y (): number
    {
        return this.values[ 1 ];
    }

    public set x ( value: number )
    {
        this.values[ 0 ] = value;
    }

    public set y ( value: number )
    {
        this.values[ 1 ] = value;
    }

    public constructor ( values: number[] | null = null )
    {
        if ( values )
        {
            this.x = values[ 0 ];
            this.y = values[ 1 ];
        } else
        {
            this.x = this.y = 0;
        }
    }

    copy ( dest: vec2 | null = null ): vec2
    {
        if ( !dest ) dest = new vec2();
        dest.x = this.x;
        dest.y = this.y;
        return dest;
    }
}

export class vec3
{

    public values = new Float32Array( 3 );

    public get x (): number
    {
        return this.values[ 0 ];
    }

    public get y (): number
    {
        return this.values[ 1 ];
    }

    public get z (): number
    {
        return this.values[ 2 ];
    }

    public set x ( value: number )
    {
        this.values[ 0 ] = value;
    }

    public set y ( value: number )
    {
        this.values[ 1 ] = value;
    }

    public set z ( value: number )
    {
        this.values[ 2 ] = value;
    }

    public constructor ( values: number[] | null = null )
    {
        if ( values !== null )
        {
            this.x = values[ 0 ];
            this.y = values[ 1 ];
            this.z = values[ 2 ];
        } else
        {
            this.x = this.y = this.z = 0;
        }
    }

    public at ( index: number ): number
    {
        return this.values[ index ];
    }

    public reset ( x: number = 0, y: number = 0, z: number = 0 ): void
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public copy ( dest: vec3 | null = null ): vec3
    {
        if ( !dest ) dest = new vec3();

        dest.x = this.x;
        dest.y = this.y;
        dest.z = this.z;

        return dest;
    }

    public negate ( dest: vec3 | null = null ): vec3
    {
        if ( !dest ) dest = this;

        dest.x = -this.x;
        dest.y = -this.y;
        dest.z = -this.z;

        return dest;
    }

    public equals ( vector: vec3, threshold = EPSILON ): boolean
    {
        if ( Math.abs( this.x - vector.x ) > threshold )
            return false;

        if ( Math.abs( this.y - vector.y ) > threshold )
            return false;

        if ( Math.abs( this.z - vector.z ) > threshold )
            return false;

        return true;
    }

    public get length (): number
    {
        return Math.sqrt( this.length2 );
    }

    public get length2 (): number
    {
        let x = this.x,
            y = this.y,
            z = this.z;

        return ( x * x + y * y + z * z );
    }

    add ( vector: vec3 ): vec3
    {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;

        return this;
    }

    subtract ( vector: vec3 ): vec3
    {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;

        return this;
    }

    public scale ( value: number, dest: vec3 | null = null ): vec3
    {
        if ( !dest )
        {
            dest = this;
        } else
        {
            this.copy( dest );
        }

        dest.x *= value;
        dest.y *= value;
        dest.z *= value;

        return dest;
    }

    public normalize ( dest: vec3 | null = null ): vec3
    {
        if ( !dest ) dest = this;

        let length = this.length;

        if ( length === 1 )
        {
            return this;
        }

        if ( length === 0 )
        {
            dest.x = 0;
            dest.y = 0;
            dest.z = 0;

            return dest;
        }

        length = 1.0 / length;

        dest.x *= length;
        dest.y *= length;
        dest.z *= length;

        return dest;
    }

    public normalize2 (): number
    {
        let length = this.length;
        let len: number = 1.0 / length;
        this.x *= len;
        this.y *= len;
        this.z *= len;
        return length;
    }

    public static multiplyScalar ( vector: vec3, value: number, dest: vec3 | null = null ): vec3
    {
        if ( !dest ) dest = new vec3();
        dest.x *= value;
        dest.y *= value;
        dest.z *= value;
        return dest;
    }

    public static cross ( vector: vec3, vector2: vec3, dest: vec3 | null = null ): vec3
    {
        if ( !dest ) dest = new vec3();

        let x = vector.x,
            y = vector.y,
            z = vector.z;

        let x2 = vector2.x,
            y2 = vector2.y,
            z2 = vector2.z;

        dest.x = y * z2 - z * y2;
        dest.y = z * x2 - x * z2;
        dest.z = x * y2 - y * x2;

        return dest;
    }

    public static dot ( vector: vec3, vector2: vec3 ): number
    {
        let x = vector.x,
            y = vector.y,
            z = vector.z;

        let x2 = vector2.x,
            y2 = vector2.y,
            z2 = vector2.z;

        return ( x * x2 + y * y2 + z * z2 );
    }

    public static sum ( vector: vec3, vector2: vec3, dest: vec3 | null = null ): vec3
    {
        if ( !dest ) dest = new vec3();

        dest.x = vector.x + vector2.x;
        dest.y = vector.y + vector2.y;
        dest.z = vector.z + vector2.z;

        return dest;
    }

    public static difference ( vector: vec3, vector2: vec3, dest: vec3 | null = null ): vec3
    {
        if ( !dest ) dest = new vec3();

        dest.x = vector.x - vector2.x;
        dest.y = vector.y - vector2.y;
        dest.z = vector.z - vector2.z;

        return dest;
    }

    static readonly up = new vec3( [ 0, 1, 0 ] );
    static readonly down = new vec3( [ 0, -1, 0 ] );
    static readonly right = new vec3( [ 1, 0, 0 ] );
    static readonly left = new vec3( [ -1, 0, 0 ] );
    static readonly forward = new vec3( [ 0, 0, 1 ] );
    static readonly backward = new vec3( [ 0, 0, -1 ] );

    static readonly zero = new vec3( [ 0, 0, 0 ] );

    static v0 = new vec3( [ 0, 0, 0 ] );
    static v1 = new vec3( [ 0, 0, 0 ] );
    static v2 = new vec3( [ 0, 0, 0 ] );
}

export class vec4
{
    public values = new Float32Array( 4 );

    public get x (): number
    {
        return this.values[ 0 ];
    }

    public get y (): number
    {
        return this.values[ 1 ];
    }

    public get z (): number
    {
        return this.values[ 2 ];
    }

    public get w (): number
    {
        return this.values[ 3 ];
    }

    public set x ( value: number )
    {
        this.values[ 0 ] = value;
    }

    public set y ( value: number )
    {
        this.values[ 1 ] = value;
    }

    public set z ( value: number )
    {
        this.values[ 2 ] = value;
    }

    public set w ( value: number )
    {
        this.values[ 3 ] = value;
    }

    public get vec3 (): vec3
    {
        return new vec3( [ this.x, this.y, this.z ] );
    }

    public get r (): number
    {
        return this.values[ 0 ];
    }

    public get g (): number
    {
        return this.values[ 1 ];
    }

    public get b (): number
    {
        return this.values[ 2 ];
    }

    public get a (): number
    {
        return this.values[ 3 ];
    }

    public set r ( value: number )
    {
        this.values[ 0 ] = value;
    }

    public set g ( value: number )
    {
        this.values[ 1 ] = value;
    }

    public set b ( value: number )
    {
        this.values[ 2 ] = value;
    }

    public set a ( value: number )
    {
        this.values[ 3 ] = value;
    }

    public constructor ( values: number[] | null = null )
    {
        if ( values )
        {
            this.x = values[ 0 ];
            this.y = values[ 1 ];
            this.z = values[ 2 ];
            this.w = values[ 3 ];
        } else
        {
            this.x = this.y = this.z = this.w = 0.0;
        }
    }

    public at ( index: number ): number
    {
        return this.values[ index ];
    }

    public reset (): void
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }

    public copy ( dest: vec4 | null = null ): vec4
    {
        if ( !dest ) dest = new vec4();

        dest.x = this.x;
        dest.y = this.y;
        dest.z = this.z;
        dest.w = this.w;

        return dest;
    }

    public equals ( vector: vec4, threshold = EPSILON ): boolean
    {
        if ( Math.abs( this.x - vector.x ) > threshold )
            return false;

        if ( Math.abs( this.y - vector.y ) > threshold )
            return false;

        if ( Math.abs( this.z - vector.z ) > threshold )
            return false;

        if ( Math.abs( this.w - vector.w ) > threshold )
            return false;

        return true;
    }

    static red: vec4 = new vec4( [ 1.0, 0.0, 0.0, 1.0 ] );
    static green: vec4 = new vec4( [ 0.0, 1.0, 0.0, 1.0 ] );
    static blue: vec4 = new vec4( [ 0.0, 0.0, 1.0, 1.0 ] );
    static black:vec4 = new vec4([0,0,0,0]);

    static v0: vec4 = new vec4();
    static v1: vec4 = new vec4();
    static v2: vec4 = new vec4();
}

export class mat4
{
    public values = new Float32Array( 16 );

    public constructor ( values: number[] | null = null )
    {
        if ( values )
        {
            this.set( values );
        }
        else
        {
            this.setIdentity();
        }
    }

    public set ( values: number[] ): mat4
    {
        for ( let i = 0; i < 16; i++ )
        {
            this.values[ i ] = values[ i ];
        }

        return this;
    }

    public at ( index: number ): number
    {
        return this.values[ index ];
    }

    public copy ( dest: mat4 | null = null ): mat4
    {
        if ( !dest ) dest = new mat4();

        for ( let i = 0; i < 16; i++ )
        {
            dest.values[ i ] = this.values[ i ];
        }

        return dest;
    }

    public equals ( matrix: mat4, threshold = EPSILON ): boolean
    {
        for ( let i = 0; i < 16; i++ )
        {
            if ( Math.abs( this.values[ i ] - matrix.at( i ) ) > threshold )
                return false;
        }

        return true;
    }

    public getRow ( index: number, dest: vec4 | null = null ): vec4
    {
        if ( dest === null )
        {
            dest = new vec4();
        }
        dest.x = this.values[ index * 4 + 0 ],
            dest.y = this.values[ index * 4 + 1 ],
            dest.z = this.values[ index * 4 + 2 ],
            dest.w = this.values[ index * 4 + 3 ]
        return dest;
    }

    public getColumn ( index: number, dest: vec4 | null = null ): vec4
    {
        if ( dest === null )
        {
            dest = new vec4();
        }
        dest.x = this.values[ index ];
        dest.y = this.values[ index + 4 ];
        dest.z = this.values[ index + 8 ];
        dest.w = this.values[ index + 12 ];
        return dest;
    }

    public getPosition ( dest: vec3 | null = null ): vec3
    {
        if ( dest === null )
        {
            dest = new vec3();
        }
        dest.x = this.values[ 12 ];
        dest.y = this.values[ 13 ];
        dest.z = this.values[ 14 ];
        return dest;
    }

    public getXAxis ( dest: vec3 | null = null ): vec3
    {
        if ( dest === null )
        {
            dest = new vec3();
        }
        dest.x = this.values[ 0 ];
        dest.y = this.values[ 1 ];
        dest.z = this.values[ 2 ];
        return dest;
    }

    public getYAxis ( dest: vec3 | null = null ): vec3
    {
        if ( dest === null )
        {
            dest = new vec3();
        }
        dest.x = this.values[ 4 ];
        dest.y = this.values[ 5 ];
        dest.z = this.values[ 6 ];
        return dest;
    }

    public getZAxis ( dest: vec3 | null = null ): vec3
    {
        if ( dest === null )
        {
            dest = new vec3();
        }
        dest.x = this.values[ 8 ];
        dest.y = this.values[ 9 ];
        dest.z = this.values[ 10 ];
        return dest;
    }

    public getAxis ( idx: number, dest: vec3 | null = null ): vec3
    {
        if ( idx === 0 )
        {
            return this.getXAxis( dest );
        } else if ( idx === 1 )
        {
            return this.getYAxis( dest );
        } else
        {
            return this.getZAxis( dest );
        }
    }

    public setIdentity (): mat4
    {
        this.values[ 0 ] = 1;
        this.values[ 1 ] = 0;
        this.values[ 2 ] = 0;
        this.values[ 3 ] = 0;
        this.values[ 4 ] = 0;
        this.values[ 5 ] = 1;
        this.values[ 6 ] = 0;
        this.values[ 7 ] = 0;
        this.values[ 8 ] = 0;
        this.values[ 9 ] = 0;
        this.values[ 10 ] = 1;
        this.values[ 11 ] = 0;
        this.values[ 12 ] = 0;
        this.values[ 13 ] = 0;
        this.values[ 14 ] = 0;
        this.values[ 15 ] = 1;

        return this;
    }

    public transpose (): mat4
    {
        let temp01 = this.values[ 1 ], temp02 = this.values[ 2 ],
            temp03 = this.values[ 3 ], temp12 = this.values[ 6 ],
            temp13 = this.values[ 7 ], temp23 = this.values[ 11 ];

        this.values[ 1 ] = this.values[ 4 ];
        this.values[ 2 ] = this.values[ 8 ];
        this.values[ 3 ] = this.values[ 12 ];
        this.values[ 4 ] = temp01;

        this.values[ 6 ] = this.values[ 9 ];
        this.values[ 7 ] = this.values[ 13 ];
        this.values[ 8 ] = temp02;
        this.values[ 9 ] = temp12;
        this.values[ 11 ] = this.values[ 14 ];
        this.values[ 12 ] = temp03;
        this.values[ 13 ] = temp13;
        this.values[ 14 ] = temp23;

        return this;
    }

    public determinant (): number
    {
        let a00 = this.values[ 0 ], a01 = this.values[ 1 ], a02 = this.values[ 2 ], a03 = this.values[ 3 ],
            a10 = this.values[ 4 ], a11 = this.values[ 5 ], a12 = this.values[ 6 ], a13 = this.values[ 7 ],
            a20 = this.values[ 8 ], a21 = this.values[ 9 ], a22 = this.values[ 10 ], a23 = this.values[ 11 ],
            a30 = this.values[ 12 ], a31 = this.values[ 13 ], a32 = this.values[ 14 ], a33 = this.values[ 15 ];

        let det00 = a00 * a11 - a01 * a10,
            det01 = a00 * a12 - a02 * a10,
            det02 = a00 * a13 - a03 * a10,
            det03 = a01 * a12 - a02 * a11,
            det04 = a01 * a13 - a03 * a11,
            det05 = a02 * a13 - a03 * a12,
            det06 = a20 * a31 - a21 * a30,
            det07 = a20 * a32 - a22 * a30,
            det08 = a20 * a33 - a23 * a30,
            det09 = a21 * a32 - a22 * a31,
            det10 = a21 * a33 - a23 * a31,
            det11 = a22 * a33 - a23 * a32;

        return ( det00 * det11 - det01 * det10 + det02 * det09 + det03 * det08 - det04 * det07 + det05 * det06 );
    }

    public inverse ( out: mat4 ): boolean
    {
        this.copy( out );
        let a00 = out.values[ 0 ], a01 = out.values[ 1 ], a02 = out.values[ 2 ], a03 = out.values[ 3 ],
            a10 = out.values[ 4 ], a11 = out.values[ 5 ], a12 = out.values[ 6 ], a13 = out.values[ 7 ],
            a20 = out.values[ 8 ], a21 = out.values[ 9 ], a22 = out.values[ 10 ], a23 = out.values[ 11 ],
            a30 = out.values[ 12 ], a31 = out.values[ 13 ], a32 = out.values[ 14 ], a33 = out.values[ 15 ];

        let det00 = a00 * a11 - a01 * a10,
            det01 = a00 * a12 - a02 * a10,
            det02 = a00 * a13 - a03 * a10,
            det03 = a01 * a12 - a02 * a11,
            det04 = a01 * a13 - a03 * a11,
            det05 = a02 * a13 - a03 * a12,
            det06 = a20 * a31 - a21 * a30,
            det07 = a20 * a32 - a22 * a30,
            det08 = a20 * a33 - a23 * a30,
            det09 = a21 * a32 - a22 * a31,
            det10 = a21 * a33 - a23 * a31,
            det11 = a22 * a33 - a23 * a32;

        let det = ( det00 * det11 - det01 * det10 + det02 * det09 + det03 * det08 - det04 * det07 + det05 * det06 );

        if ( !det )
            return false;

        det = 1.0 / det;

        out.values[ 0 ] = ( a11 * det11 - a12 * det10 + a13 * det09 ) * det;
        out.values[ 1 ] = ( -a01 * det11 + a02 * det10 - a03 * det09 ) * det;
        out.values[ 2 ] = ( a31 * det05 - a32 * det04 + a33 * det03 ) * det;
        out.values[ 3 ] = ( -a21 * det05 + a22 * det04 - a23 * det03 ) * det;
        out.values[ 4 ] = ( -a10 * det11 + a12 * det08 - a13 * det07 ) * det;
        out.values[ 5 ] = ( a00 * det11 - a02 * det08 + a03 * det07 ) * det;
        out.values[ 6 ] = ( -a30 * det05 + a32 * det02 - a33 * det01 ) * det;
        out.values[ 7 ] = ( a20 * det05 - a22 * det02 + a23 * det01 ) * det;
        out.values[ 8 ] = ( a10 * det10 - a11 * det08 + a13 * det06 ) * det;
        out.values[ 9 ] = ( -a00 * det10 + a01 * det08 - a03 * det06 ) * det;
        out.values[ 10 ] = ( a30 * det04 - a31 * det02 + a33 * det00 ) * det;
        out.values[ 11 ] = ( -a20 * det04 + a21 * det02 - a23 * det00 ) * det;
        out.values[ 12 ] = ( -a10 * det09 + a11 * det07 - a12 * det06 ) * det;
        out.values[ 13 ] = ( a00 * det09 - a01 * det07 + a02 * det06 ) * det;
        out.values[ 14 ] = ( -a30 * det03 + a31 * det01 - a32 * det00 ) * det;
        out.values[ 15 ] = ( a20 * det03 - a21 * det01 + a22 * det00 ) * det;

        return true;
    }

    public multiply ( matrix: mat4 ): mat4
    {
        let a00 = this.values[ 0 ], a01 = this.values[ 1 ], a02 = this.values[ 2 ], a03 = this.values[ 3 ];
        let a10 = this.values[ 4 ], a11 = this.values[ 5 ], a12 = this.values[ 6 ], a13 = this.values[ 7 ];
        let a20 = this.values[ 8 ], a21 = this.values[ 9 ], a22 = this.values[ 10 ], a23 = this.values[ 11 ];
        let a30 = this.values[ 12 ], a31 = this.values[ 13 ], a32 = this.values[ 14 ], a33 = this.values[ 15 ];

        let b0 = matrix.at( 0 ),
            b1 = matrix.at( 1 ),
            b2 = matrix.at( 2 ),
            b3 = matrix.at( 3 );

        this.values[ 0 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.values[ 1 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.values[ 2 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.values[ 3 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = matrix.at( 4 );
        b1 = matrix.at( 5 );
        b2 = matrix.at( 6 );
        b3 = matrix.at( 7 );

        this.values[ 4 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.values[ 5 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.values[ 6 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.values[ 7 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = matrix.at( 8 );
        b1 = matrix.at( 9 );
        b2 = matrix.at( 10 );
        b3 = matrix.at( 11 );

        this.values[ 8 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.values[ 9 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.values[ 10 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.values[ 11 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = matrix.at( 12 );
        b1 = matrix.at( 13 );
        b2 = matrix.at( 14 );
        b3 = matrix.at( 15 );

        this.values[ 12 ] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.values[ 13 ] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.values[ 14 ] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.values[ 15 ] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        return this;
    }

    public multiplyVec3 ( vector: vec3, dest: vec3 | null = null ): vec3
    {
        if ( !dest ) dest = new vec3();
        let x = vector.x,
            y = vector.y,
            z = vector.z;

        dest.x = this.values[ 0 ] * x + this.values[ 4 ] * y + this.values[ 8 ] * z + this.values[ 12 ];
        dest.y = this.values[ 1 ] * x + this.values[ 5 ] * y + this.values[ 9 ] * z + this.values[ 13 ];
        dest.z = this.values[ 2 ] * x + this.values[ 6 ] * y + this.values[ 10 ] * z + this.values[ 14 ];

        return dest;
    }

    public multiplyVec4 ( vector: vec4, dest: vec4 | null = null ): vec4
    {
        if ( !dest ) dest = new vec4();

        let x = vector.x,
            y = vector.y,
            z = vector.z,
            w = vector.w;

        dest.x = this.values[ 0 ] * x + this.values[ 4 ] * y + this.values[ 8 ] * z + this.values[ 12 ] * w;
        dest.y = this.values[ 1 ] * x + this.values[ 5 ] * y + this.values[ 9 ] * z + this.values[ 13 ] * w;
        dest.z = this.values[ 2 ] * x + this.values[ 6 ] * y + this.values[ 10 ] * z + this.values[ 14 ] * w;
        dest.w = this.values[ 3 ] * x + this.values[ 7 ] * y + this.values[ 11 ] * z + this.values[ 15 ] * w;

        return dest;
    }

    // 矩阵变换
    public translate ( vector: vec3 ): mat4
    {
        let x = vector.x,
            y = vector.y,
            z = vector.z;

        this.values[ 12 ] += this.values[ 0 ] * x + this.values[ 4 ] * y + this.values[ 8 ] * z;
        this.values[ 13 ] += this.values[ 1 ] * x + this.values[ 5 ] * y + this.values[ 9 ] * z;
        this.values[ 14 ] += this.values[ 2 ] * x + this.values[ 6 ] * y + this.values[ 10 ] * z;
        this.values[ 15 ] += this.values[ 3 ] * x + this.values[ 7 ] * y + this.values[ 11 ] * z;

        return this;
    }

    public scale ( vector: vec3 ): mat4
    {
        let x = vector.x,
            y = vector.y,
            z = vector.z;

        this.values[ 0 ] *= x;
        this.values[ 1 ] *= x;
        this.values[ 2 ] *= x;
        this.values[ 3 ] *= x;

        this.values[ 4 ] *= y;
        this.values[ 5 ] *= y;
        this.values[ 6 ] *= y;
        this.values[ 7 ] *= y;

        this.values[ 8 ] *= z;
        this.values[ 9 ] *= z;
        this.values[ 10 ] *= z;
        this.values[ 11 ] *= z;

        return this;
    }

    public rotate ( angle: number, axis: vec3 ): mat4 | null
    {
        let x = axis.x,
            y = axis.y,
            z = axis.z;

        let length = Math.sqrt( x * x + y * y + z * z );

        if ( !length )
            return null;

        if ( length !== 1 )
        {
            length = 1 / length;
            x *= length;
            y *= length;
            z *= length;
        }

        let s = Math.sin( angle );
        let c = Math.cos( angle );

        let t = 1.0 - c;

        let a00 = this.values[ 0 ], a01 = this.values[ 1 ], a02 = this.values[ 2 ], a03 = this.values[ 3 ],
            a10 = this.values[ 4 ], a11 = this.values[ 5 ], a12 = this.values[ 6 ], a13 = this.values[ 7 ],
            a20 = this.values[ 8 ], a21 = this.values[ 9 ], a22 = this.values[ 10 ], a23 = this.values[ 11 ];

        let b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s,
            b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s,
            b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;

        this.values[ 0 ] = a00 * b00 + a10 * b01 + a20 * b02;
        this.values[ 1 ] = a01 * b00 + a11 * b01 + a21 * b02;
        this.values[ 2 ] = a02 * b00 + a12 * b01 + a22 * b02;
        this.values[ 3 ] = a03 * b00 + a13 * b01 + a23 * b02;

        this.values[ 4 ] = a00 * b10 + a10 * b11 + a20 * b12;
        this.values[ 5 ] = a01 * b10 + a11 * b11 + a21 * b12;
        this.values[ 6 ] = a02 * b10 + a12 * b11 + a22 * b12;
        this.values[ 7 ] = a03 * b10 + a13 * b11 + a23 * b12;

        this.values[ 8 ] = a00 * b20 + a10 * b21 + a20 * b22;
        this.values[ 9 ] = a01 * b20 + a11 * b21 + a21 * b22;
        this.values[ 10 ] = a02 * b20 + a12 * b21 + a22 * b22;
        this.values[ 11 ] = a03 * b20 + a13 * b21 + a23 * b22;

        return this;
    }

    // 视矩阵和投影矩阵
    public static frustum ( left: number, right: number, bottom: number, top: number, near: number, far: number ): mat4
    {
        let rl = ( right - left ),
            tb = ( top - bottom ),
            fn = ( far - near );

        return new mat4( [
            ( near * 2 ) / rl,
            0,
            0,
            0,

            0,
            ( near * 2 ) / tb,
            0,
            0,

            ( right + left ) / rl,
            ( top + bottom ) / tb,
            -( far + near ) / fn,
            -1,

            0,
            0,
            -( far * near * 2 ) / fn,
            0
        ] );
    }

    public static perspective ( fov: number, aspect: number, near: number, far: number ): mat4
    {
        let top = near * Math.tan( fov * 0.5 ),
            right = top * aspect;

        return mat4.frustum( -right, right, -top, top, near, far );
    }

    public static orthographic ( left: number, right: number, bottom: number, top: number, near: number, far: number ): mat4
    {
        let rl = ( right - left ),
            tb = ( top - bottom ),
            fn = ( far - near );

        return new mat4( [
            2 / rl,
            0,
            0,
            0,

            0,
            2 / tb,
            0,
            0,

            0,
            0,
            -2 / fn,
            0,

            -( left + right ) / rl,
            -( top + bottom ) / tb,
            -( far + near ) / fn,
            1
        ] );
    }

    public static lookAt ( position: vec3, target: vec3, up: vec3 = vec3.up ): mat4
    {
        if ( position.equals( target ) )
        {
            return this.identity;
        }

        let z = vec3.difference( position, target ).normalize();
        let x = vec3.cross( up, z ).normalize();
        let y = vec3.cross( z, x ).normalize();

        return new mat4( [
            x.x,
            y.x,
            z.x,
            0,

            x.y,
            y.y,
            z.y,
            0,

            x.z,
            y.z,
            z.z,
            0,

            -vec3.dot( x, position ),
            -vec3.dot( y, position ),
            -vec3.dot( z, position ),
            1
        ] );
    }

    public static product ( m1: mat4, m2: mat4, result: mat4 | null = null ): mat4
    {
        let a00 = m1.at( 0 ), a01 = m1.at( 1 ), a02 = m1.at( 2 ), a03 = m1.at( 3 ),
            a10 = m1.at( 4 ), a11 = m1.at( 5 ), a12 = m1.at( 6 ), a13 = m1.at( 7 ),
            a20 = m1.at( 8 ), a21 = m1.at( 9 ), a22 = m1.at( 10 ), a23 = m1.at( 11 ),
            a30 = m1.at( 12 ), a31 = m1.at( 13 ), a32 = m1.at( 14 ), a33 = m1.at( 15 );

        let b00 = m2.at( 0 ), b01 = m2.at( 1 ), b02 = m2.at( 2 ), b03 = m2.at( 3 ),
            b10 = m2.at( 4 ), b11 = m2.at( 5 ), b12 = m2.at( 6 ), b13 = m2.at( 7 ),
            b20 = m2.at( 8 ), b21 = m2.at( 9 ), b22 = m2.at( 10 ), b23 = m2.at( 11 ),
            b30 = m2.at( 12 ), b31 = m2.at( 13 ), b32 = m2.at( 14 ), b33 = m2.at( 15 );

        if ( result )
        {
            result.set( [
                b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
                b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,

                b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,

                b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,

                b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
            ] );

            return result;
        }
        else
        {
            return new mat4( [
                b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
                b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,

                b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,

                b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,

                b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
            ] );
        }
    }

    public static identity = new mat4().setIdentity();
    public static m0 = new mat4();
    public static m1 = new mat4();
}

export class quat
{
    public values = new Float32Array( 4 );

    public get x (): number
    {
        return this.values[ 0 ];
    }

    public get y (): number
    {
        return this.values[ 1 ];
    }

    public get z (): number
    {
        return this.values[ 2 ];
    }

    public get w (): number
    {
        return this.values[ 3 ];
    }

    public set x ( value: number )
    {
        this.values[ 0 ] = value;
    }

    public set y ( value: number )
    {
        this.values[ 1 ] = value;
    }

    public set z ( value: number )
    {
        this.values[ 2 ] = value;
    }

    public set w ( value: number )
    {
        this.values[ 3 ] = value;
    }

    public constructor ()
    {
        this.setIdentity();
    }

    public at ( index: number ): number
    {
        return this.values[ index ];
    }

    public reset (): void
    {
        for ( let i = 0; i < 4; i++ )
        {
            this.values[ i ] = 0;
        }
    }

    public copy ( dest: quat | null = null ): quat
    {
        if ( !dest ) dest = new quat();

        for ( let i = 0; i < 4; i++ )
        {
            dest.values[ i ] = this.values[ i ];
        }

        return dest;
    }

    public roll (): number
    {
        let x = this.x,
            y = this.y,
            z = this.z,
            w = this.w;

        return Math.atan2( 2.0 * ( x * y + w * z ), w * w + x * x - y * y - z * z );
    }

    public pitch (): number
    {
        let x = this.x,
            y = this.y,
            z = this.z,
            w = this.w;

        return Math.atan2( 2.0 * ( y * z + w * x ), w * w - x * x - y * y + z * z );
    }

    public yaw (): number
    {
        return Math.asin( 2.0 * ( this.x * this.z - this.w * this.y ) );
    }

    public equals ( vector: quat, threshold = EPSILON ): boolean
    {
        for ( let i = 0; i < 4; i++ )
        {
            if ( Math.abs( this.values[ i ] - vector.at( i ) ) > threshold )
                return false;
        }

        return true;
    }

    public setIdentity (): quat
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;

        return this;
    }

    public calculateW (): quat
    {
        let x = this.x,
            y = this.y,
            z = this.z;

        this.w = -( Math.sqrt( Math.abs( 1.0 - x * x - y * y - z * z ) ) );

        return this;
    }

    public static dot ( q1: quat, q2: quat ): number
    {
        return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
    }

    public inverse (): quat
    {
        let dot = quat.dot( this, this );

        if ( !dot )
        {
            this.setIdentity();
            return this;
        }

        let invDot = dot ? 1.0 / dot : 0;

        this.x *= -invDot;
        this.y *= -invDot;
        this.z *= -invDot;
        this.w *= invDot;

        return this;
    }

    public conjugate (): quat
    {
        this.values[ 0 ] *= -1;
        this.values[ 1 ] *= -1;
        this.values[ 2 ] *= -1;

        return this;
    }

    public length (): number
    {
        let x = this.x,
            y = this.y,
            z = this.z,
            w = this.w;

        return Math.sqrt( x * x + y * y + z * z + w * w );
    }

    public normalize ( dest: quat | null = null ): quat
    {
        if ( !dest ) dest = this;

        let x = this.x,
            y = this.y,
            z = this.z,
            w = this.w;

        let length = Math.sqrt( x * x + y * y + z * z + w * w );

        if ( !length )
        {
            dest.x = 0;
            dest.y = 0;
            dest.z = 0;
            dest.w = 0;

            return dest;
        }

        length = 1 / length;

        dest.x = x * length;
        dest.y = y * length;
        dest.z = z * length;
        dest.w = w * length;

        return dest;
    }

    public add ( other: quat ): quat
    {
        for ( let i = 0; i < 4; i++ )
        {
            this.values[ i ] += other.at( i );
        }

        return this;
    }

    // 这个是左到右结合 this.cross.other
    public multiply ( other: quat ): quat
    {
        let q1x = this.values[ 0 ],
            q1y = this.values[ 1 ],
            q1z = this.values[ 2 ],
            q1w = this.values[ 3 ];

        let q2x = other.x,
            q2y = other.y,
            q2z = other.z,
            q2w = other.w;

        this.x = q1x * q2w + q1w * q2x + q1y * q2z - q1z * q2y;
        this.y = q1y * q2w + q1w * q2y + q1z * q2x - q1x * q2z;
        this.z = q1z * q2w + q1w * q2z + q1x * q2y - q1y * q2x;
        this.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;

        return this;
    }

    public multiplyVec3 ( vector: vec3, dest: vec3 | null = null ): vec3
    {
        if ( !dest ) dest = new vec3();

        let x = vector.x,
            y = vector.y,
            z = vector.z;

        let qx = this.x,
            qy = this.y,
            qz = this.z,
            qw = this.w;

        //
        let ix = qw * x + qy * z - qz * y,
            iy = qw * y + qz * x - qx * z,
            iz = qw * z + qx * y - qy * x,
            iw = -qx * x - qy * y - qz * z;

        dest.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        dest.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        dest.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return dest;
    }

    public toMat4 ( dest: mat4 | null = null ): mat4
    {
        if ( !dest ) dest = new mat4();

        let x = this.x,
            y = this.y,
            z = this.z,
            w = this.w,

            x2 = x + x,
            y2 = y + y,
            z2 = z + z,

            xx = x * x2,
            xy = x * y2,
            xz = x * z2,
            yy = y * y2,
            yz = y * z2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2;

        dest.set( [
            1 - ( yy + zz ),
            xy + wz,
            xz - wy,
            0,

            ( xy - wz ),
            ( 1 - ( xx + zz ) ),
            ( yz + wx ),
            0,

            xz + wy,
            yz - wx,
            1 - ( xx + yy ),
            0,

            0,
            0,
            0,
            1
        ] );

        return dest;
    }

    public static sum ( q1: quat, q2: quat, dest: quat | null = null ): quat
    {
        if ( !dest ) dest = new quat();

        dest.x = q1.x + q2.x;
        dest.y = q1.y + q2.y;
        dest.z = q1.z + q2.z;
        dest.w = q1.w + q2.w;

        return dest;
    }

    public static product ( q1: quat, q2: quat, dest: quat | null = null ): quat
    {
        if ( !dest ) dest = new quat();

        let q1x = q1.x,
            q1y = q1.y,
            q1z = q1.z,
            q1w = q1.w,

            q2x = q2.x,
            q2y = q2.y,
            q2z = q2.z,
            q2w = q2.w;

        dest.x = q1x * q2w + q1w * q2x + q1y * q2z - q1z * q2y;
        dest.y = q1y * q2w + q1w * q2y + q1z * q2x - q1x * q2z;
        dest.z = q1z * q2w + q1w * q2z + q1x * q2y - q1y * q2x;
        dest.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;

        return dest;
    }

    public static cross ( q1: quat, q2: quat, dest: quat | null = null ): quat
    {
        if ( !dest ) dest = new quat();

        let q1x = q1.x,
            q1y = q1.y,
            q1z = q1.z,
            q1w = q1.w,

            q2x = q2.x,
            q2y = q2.y,
            q2z = q2.z,
            q2w = q2.w;

        dest.x = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
        dest.y = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
        dest.z = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
        dest.w = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;

        return dest;
    }

    public static shortMix ( q1: quat, q2: quat, time: number, dest: quat | null = null ): quat
    {
        if ( !dest ) dest = new quat();

        if ( time <= 0.0 )
        {
            q1.copy(q1);

            return dest;
        } else if ( time >= 1.0 )
        {
            q2.copy(dest);

            return dest;
        }

        let cos = quat.dot( q1, q2 ),
            q2a = q2.copy();

        if ( cos < 0.0 )
        {
            q2a.inverse();
            cos = -cos;
        }

        let k0: number,
            k1: number;

        if ( cos > 0.9999 )
        {
            k0 = 1 - time;
            k1 = 0 + time;
        }
        else
        {
            let sin: number = Math.sqrt( 1 - cos * cos );
            let angle: number = Math.atan2( sin, cos );

            let oneOverSin: number = 1 / sin;

            k0 = Math.sin( ( 1 - time ) * angle ) * oneOverSin;
            k1 = Math.sin( ( 0 + time ) * angle ) * oneOverSin;
        }

        dest.x = k0 * q1.x + k1 * q2a.x;
        dest.y = k0 * q1.y + k1 * q2a.y;
        dest.z = k0 * q1.z + k1 * q2a.z;
        dest.w = k0 * q1.w + k1 * q2a.w;

        return dest;
    }

    public static mix ( q1: quat, q2: quat, time: number, dest: quat | null = null ): quat
    {
        if ( !dest ) dest = new quat();

        let cosHalfTheta = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;

        if ( Math.abs( cosHalfTheta ) >= 1.0 )
        {
            q1.copy(dest);
            return dest;
        }

        let halfTheta = Math.acos( cosHalfTheta ),
            sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

        if ( Math.abs( sinHalfTheta ) < 0.001 )
        {
            dest.x = q1.x * 0.5 + q2.x * 0.5;
            dest.y = q1.y * 0.5 + q2.y * 0.5;
            dest.z = q1.z * 0.5 + q2.z * 0.5;
            dest.w = q1.w * 0.5 + q2.w * 0.5;

            return dest;
        }

        let ratioA = Math.sin( ( 1 - time ) * halfTheta ) / sinHalfTheta,
            ratioB = Math.sin( time * halfTheta ) / sinHalfTheta;

        dest.x = q1.x * ratioA + q2.x * ratioB;
        dest.y = q1.y * ratioA + q2.y * ratioB;
        dest.z = q1.z * ratioA + q2.z * ratioB;
        dest.w = q1.w * ratioA + q2.w * ratioB;

        return dest;
    }

    static fromAxis ( axis: vec3, angle: number, dest: quat | null = null ): quat
    {
        if ( !dest ) dest = new quat();

        angle *= 0.5;
        let sin = Math.sin( angle );

        dest.x = axis.x * sin;
        dest.y = axis.y * sin;
        dest.z = axis.z * sin;
        dest.w = Math.cos( angle );

        return dest;
    }

    static identity = new quat().setIdentity();
    static q0 = new quat();
    static q1 = new quat();
    static q2 = new quat();
}
