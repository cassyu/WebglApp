import { vec3, mat4,  vec4 } from "../common/math/TSM";
import { MathHelper } from "../common/math/MathHelper";
import { Frustum} from "./Frustum";
export enum ECameraType {
    FPSCAMERA,
    FLYCAMERA
}

export class Camera
{
    public get fovY (): number
    {
        return this._fovY;
    }

    public set fovY ( value: number )
    {
        this._fovY = value;
    }

    public get near (): number
    {
        return this._near;
    }

    public set near ( value: number )
    {
        this._near = value;
    }

    public get far (): number
    {
        return this._far;
    }

    public set far ( value: number )
    {
        this._far = value;
    }

    public get aspectRatio (): number
    {
        return this._aspectRatio;
    }

    public set aspectRatio ( value: number )
    {
        this._aspectRatio = value;
    }

    public get position (): vec3
    {
        return this._position;
    }

    public set position ( value: vec3 )
    {
        this._position = value;
    }

    public setViewport ( x: number, y: number, width: number, height: number ): void
    {
        this.gl.viewport( x, y, width, height );
        this.gl.scissor(x,y,width,height);
        this.aspectRatio = width / height;
    }

    public getViewport (): Int32Array
    {
        return this.gl.getParameter( this.gl.VIEWPORT );
    }

    //千万别用this.position.x = xxx，因为无法设置this._viewDirty
    //请用下面的三个set方法
    public set x ( value: number )
    {
        this._position.x = value;
    }

    public set y ( value: number )
    {
        this._position.y = value;
    }

    public set z ( value: number )
    {
        this._position.z = value;
    }

    public get x (): number
    {
        return this._position.x;
    }

    public get y (): number
    {
        return this._position.y;
    }

    public get z (): number
    {
        return this._position.z;
    }

    public get xAxis (): vec3
    {
        return this._xAxis;
    }

    public get yAxis (): vec3
    {
        return this._yAxis;
    }

    public get zAxis (): vec3
    {
        return this._zAxis;
    }

    public get type (): ECameraType
    {
        return this._type;
    }

    //比较特别，需要重新修正一些内容，或者直接禁止修改type
    public set type ( value: ECameraType )
    {
        this._type = value;
    }

    public get left (): number
    {
        return this._left;
    }

    public get right (): number
    {
        return this._right;
    }

    public get bottom (): number
    {
        return this._bottom;
    }

    public get top (): number
    {
        return this._top;
    }

    public gl: WebGLRenderingContext;

    public controlByMouse: boolean;


    public constructor ( gl: WebGLRenderingContext, width: number, height: number, fovY: number = 45.0, zNear: number = 1, zFar: number = 1000 )
    {
        this.gl = gl;
        this._aspectRatio = width / height;
        this._fovY = MathHelper.toRadian( fovY );

        this._near = zNear;
        this._far = zFar;

        this._top = this._near * Math.tan( this._fovY * 0.5 ),
        this._right = this._top * this._aspectRatio;
        this._bottom = -this._top;
        this._left = -this._right;
        this._frustum = new Frustum();

        this._projectionMatrix = new mat4();
        this._viewMatrix = new mat4();
        this._invViewMatrix = new mat4();
        this._viewProjMatrix = new mat4();
        this._invViewProjMatrix = new mat4();
        this.controlByMouse = false;
    }

    public update ( intervalSec: number ): void
    {
        this._projectionMatrix = mat4.perspective( this.fovY, this.aspectRatio, this.near, this.far );
        this._calcViewMatrix();
        mat4.product( this._projectionMatrix, this._viewMatrix, this._viewProjMatrix );
        this._viewProjMatrix.copy( this._invViewProjMatrix );
        this._viewProjMatrix.inverse( this._invViewProjMatrix );
    }

    //局部坐标系下的前后运动
    public moveForward ( speed: number ): void
    {
        if ( this._type === ECameraType.FPSCAMERA )
        {
            this._position.x += this._zAxis.x * speed;
            this._position.z += this._zAxis.z * speed;
        } else
        {
            this._position.x += this._zAxis.x * speed;
            this._position.y += this._zAxis.y * speed;
            this._position.z += this._zAxis.z * speed;
        }
    }

    //局部坐标系下的左右运动
    public moveRightward ( speed: number ): void
    {
        if ( this._type === ECameraType.FPSCAMERA )
        {
            this._position.x += this._xAxis.x * speed;
            this._position.z += this._xAxis.z * speed;
        } else
        {
            this._position.x += this._xAxis.x * speed;
            this._position.y += this._xAxis.y * speed;
            this._position.z += this._xAxis.z * speed;
        }
    }

    //局部坐标系下的上下运动
    public moveUpward ( speed: number ): void
    {
        if ( this._type === ECameraType.FPSCAMERA )
        {
            this._position.y += speed;
        } else
        {
            this._position.x += this._yAxis.x * speed;
            this._position.y += this._yAxis.y * speed;
            this._position.z += this._yAxis.z * speed;
        }
    }

    //局部坐标轴的左右旋转
    public yaw ( angle: number ): void
    {
        mat4.m0.setIdentity();
        angle = MathHelper.toRadian( angle );
        if ( this._type === ECameraType.FPSCAMERA )
        {
            mat4.m0.rotate( angle, vec3.up );
        } else
        {
            mat4.m0.rotate( angle, this._yAxis );
        }

        mat4.m0.multiplyVec3( this._zAxis, this._zAxis );
        mat4.m0.multiplyVec3( this._xAxis, this._xAxis );
    }

    //局部坐标轴的上下旋转
    public pitch ( angle: number ): void
    {
        mat4.m0.setIdentity();
        angle = MathHelper.toRadian( angle );
        mat4.m0.rotate( angle, this._xAxis );
        mat4.m0.multiplyVec3( this._yAxis, this._yAxis );
        mat4.m0.multiplyVec3( this._zAxis, this._zAxis );
    }

    //局部坐标轴的滚转
    public roll ( angle: number ): void
    {
        if ( this._type === ECameraType.FLYCAMERA )
        {
            angle = MathHelper.toRadian( angle );
            mat4.m0.setIdentity();
            mat4.m0.rotate( angle, this._zAxis );
            mat4.m0.multiplyVec3( this._xAxis, this._xAxis );
            mat4.m0.multiplyVec3( this._yAxis, this._yAxis );
        }
    }

    //从当前postition和target获得view矩阵
    //并且从view矩阵抽取forward,up,right方向矢量
    public lookAt ( target: vec3, up: vec3 = vec3.up ): void
    {
        this._viewMatrix = mat4.lookAt( this._position, target, up );

        this._xAxis.x = this._viewMatrix.values[ 0 ];
        this._yAxis.x = this._viewMatrix.values[ 1 ];
        this._zAxis.x = this._viewMatrix.values[ 2 ];

        this._xAxis.y = this._viewMatrix.values[ 4 ];
        this._yAxis.y = this._viewMatrix.values[ 5 ];
        this._zAxis.y = this._viewMatrix.values[ 6 ];

        this._xAxis.z = this._viewMatrix.values[ 8 ];
        this._yAxis.z = this._viewMatrix.values[ 9 ];
        this._zAxis.z = this._viewMatrix.values[ 10 ];
    }

    public get viewMatrix (): mat4
    {
        return this._viewMatrix;
    }

    public get invViewMatrix (): mat4
    {
        return this._invViewMatrix;
    }

    public get projectionMatrix (): mat4
    {
        return this._projectionMatrix;
    }

    public get viewProjectionMatrix (): mat4
    {
        return this._viewProjMatrix;
    }

    public get invViewProjectionMatrix (): mat4
    {
        return this._invViewProjMatrix;
    }

    public get frustum (): Frustum
    {
        return this._frustum;
    }

    //从当前轴以及postion合成view矩阵
    private _calcViewMatrix (): void
    {
        //固定forward方向
        this._zAxis.normalize();

        //forward cross right = up
        vec3.cross( this._zAxis, this._xAxis, this._yAxis );
        this._yAxis.normalize();

        //up cross forward = right
        vec3.cross( this._yAxis, this._zAxis, this._xAxis );
        this._xAxis.normalize();

        let x: number = -vec3.dot( this._xAxis, this._position );
        let y: number = -vec3.dot( this._yAxis, this._position );
        let z: number = -vec3.dot( this._zAxis, this._position );

        this._viewMatrix.values[ 0 ] = this._xAxis.x;
        this._viewMatrix.values[ 1 ] = this._yAxis.x;
        this._viewMatrix.values[ 2 ] = this._zAxis.x;
        this._viewMatrix.values[ 3 ] = 0.0;

        this._viewMatrix.values[ 4 ] = this._xAxis.y;
        this._viewMatrix.values[ 5 ] = this._yAxis.y;
        this._viewMatrix.values[ 6 ] = this._zAxis.y;
        this._viewMatrix.values[ 7 ] = 0.0;

        this._viewMatrix.values[ 8 ] = this._xAxis.z;
        this._viewMatrix.values[ 9 ] = this._yAxis.z;
        this._viewMatrix.values[ 10 ] = this._zAxis.z;
        this._viewMatrix.values[ 11 ] = 0.0;

        this._viewMatrix.values[ 12 ] = x;
        this._viewMatrix.values[ 13 ] = y;
        this._viewMatrix.values[ 14 ] = z;
        this._viewMatrix.values[ 15 ] = 1.0;

        //求view的逆矩阵，也就是世界矩阵
        this._viewMatrix.inverse( this._invViewMatrix );
        this._frustum.buildFromCamera( this );
    }

    private _type: ECameraType = ECameraType.FLYCAMERA;

    private _position: vec3 = new vec3();
    private _xAxis: vec3 = new vec3( [ 1, 0, 0 ] );
    private _yAxis: vec3 = new vec3( [ 0, 1, 0 ] );
    private _zAxis: vec3 = new vec3( [ 0, 0, 1 ] );

    private _near: number;
    private _far: number;
    private _left: number;
    private _right: number;
    private _bottom: number;
    private _top: number;

    private _fovY: number;
    private _aspectRatio: number;

    private _projectionMatrix: mat4;
    private _viewMatrix: mat4;
    private _invViewMatrix: mat4;
    private _viewProjMatrix: mat4;
    private _invViewProjMatrix: mat4;

    private _frustum: Frustum;
}



