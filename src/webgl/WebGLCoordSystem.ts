import { vec3, mat4, vec4 } from "../common/math/TSM";
export class GLCoordSystem
{
    public viewport: number[] = [];   // 当前坐标系被绘制在哪个视口中
    public axis: vec3;                // 当前坐标系绕哪个轴旋转
    public angle: number;             // 当前坐标系的旋转的角度(不是弧度！)
    public pos: vec3;                 // 当前坐标系的位置，如果是多视口渲染的话，就为[0,0,0]
    public isDrawAxis: boolean;       // 是否绘制旋转轴
    public isD3D: boolean;            // 是否绘制为D3D左手系

    public constructor ( viewport: number[], pos: vec3 = vec3.zero, axis: vec3 = vec3.up, angle: number = 0, isDrawAxis: boolean = false, isD3D: boolean = false )
    {
        this.viewport = viewport;
        this.angle = angle;
        this.axis = axis;
        this.pos = pos;
        this.isDrawAxis = isDrawAxis;
        this.isD3D = isD3D;
    }

    public static makeViewportCoordSystems ( width: number, height: number, row: number = 2, colum: number = 2 ): GLCoordSystem[]
    {
        let coords: GLCoordSystem[] = [];
        let w: number = width / colum;  // 一行有多少个
        let h: number = height / row;   // 一列右多少个
        // 循环生成GLCoordSystem对象，每个GLCoordSystem内置了表示viewport的数组
        for ( let i: number = 0; i < colum; i++ )
        {
            for ( let j: number = 0; j < row; j++ )
            {
                // viewport是[ x , y , width , height ]格式
                coords.push( new GLCoordSystem( [ i * w, j * h, w, h ] ) );
            }
        }
        // 将生成的GLCoordSystem数组返回
        return coords;
    }
}

