import { vec3, vec2, quat, mat4 } from "../common/math/TSM";
import { IDoom3Tokenizer, IDoom3Token, Doom3Factory } from "../common/utils/Tokenizer";
import { MathHelper } from "../common/math/MathHelper";


// MD5 Anim文件格式
export enum EAnimatedComponent
{
    COMPONENT_BIT_TX = 1 << 0,  // & = true 表示pos.x有改变
    COMPONENT_BIT_TY = 1 << 1,  // & = true 表示pos.y有改变
    COMPONENT_BIT_TZ = 1 << 2,  // & = true 表示pos.z有改变
    COMPONENT_BIT_QX = 1 << 3,  // & = true 表示quat.x有改变
    COMPONENT_BIT_QY = 1 << 4,  // & = true 表示quat.y有改变
    COMPONENT_BIT_QZ = 1 << 5   // & = true 表示pos.z有改变
};

export class MD5AnimJoint
{
    // 由_readHierarchy方法填充如下数据
    public name: string;
    public parentId: number;
    public componentBits: number;
    public componentOffset: number; // 指向某一帧frame的components数组中的某个位置
    // 增加下面两个变量
    // 由_readBaseFrames填充如下数据
    public baseOriginInParentSpace: vec3;
    public baseOrientationInParentSpace: quat;
    public constructor ()
    {
        this.name = ""; 
        this.parentId = -1;
        this.componentBits = 0;
        this.componentOffset = 0;
        this.baseOriginInParentSpace = new vec3();
        this.baseOrientationInParentSpace = new quat();
    }
}

export class MD5Frame
{
    // 由_readBounds方法填充如下数据
    public min: vec3;
    public max: vec3;
    // 由_readFrames方法填充如下数据
    public components: number[];
    public constructor ()
    {
        this.min = new vec3();
        this.max = new vec3();
        this.components = [];
    }
};

export class Pose
{
    public parentId: number; // 父关节的索引号
    public originInParentSpace: vec3; // 相对父关节的位置
    public orientationInParentSpace: quat; // 相对父关节的方向
    public matrix: mat4;  // originInParentSpace和orientationInParentSpace合成的矩阵

    public constructor ()
    {
        this.parentId = -1;
        this.originInParentSpace = new vec3();
        this.orientationInParentSpace = new quat();
        this.matrix = new mat4();
    }
}

export class Skeleton
{
    public poses: Pose[]; // 所有关节在某一帧时的姿态
    public minInModelSpace: vec3;
    public maxInModelSpace: vec3;

    public constructor ()
    {
        this.poses = [];
        this.minInModelSpace = new vec3();
        this.maxInModelSpace = new vec3();
    }
}

export class MD5Anim
{
    public animJoints: MD5AnimJoint[];
    public frames: MD5Frame[];
    public frameRate: number;
    public skeleton: Skeleton;
    public constructor ()
    {
        this.animJoints = [];
        this.frames = [];
        this.frameRate = 25;
        this.skeleton = new Skeleton();
    }

    private _readHierarchy ( parser: IDoom3Tokenizer, token: IDoom3Token, numJoints: number ): void
    {
        parser.getNextToken( token ); // 读取hierarchy 关键字
        parser.getNextToken( token ); // 读取左大括号 {
        for ( let i: number = 0; i < numJoints; i++ )
        {
            let channel: MD5AnimJoint = new MD5AnimJoint();
            parser.getNextToken( token );
            channel.name = token.getString();
            parser.getNextToken( token );
            channel.parentId = token.getInt();
            parser.getNextToken( token );
            channel.componentBits = token.getInt();
            parser.getNextToken( token );
            channel.componentOffset = token.getInt();
            this.animJoints.push( channel );
            this.skeleton.poses.push( new Pose() );
        }
        parser.getNextToken( token ); // }
    }

    private _readBounds ( parser: IDoom3Tokenizer, token: IDoom3Token, numFrames: number ): void
    {
        parser.getNextToken( token );			// bounds
        parser.getNextToken( token );			// {
        for ( let i: number = 0; i < numFrames; i++ )
        {
            let frame: MD5Frame = new MD5Frame();
            // ( min.x min.y min.z ) 
            parser.getNextToken( token );		// (		
            parser.getNextToken( token );
            frame.min.x = token.getFloat();
            parser.getNextToken( token );
            frame.min.y = token.getFloat();
            parser.getNextToken( token );
            frame.min.z = token.getFloat();
            parser.getNextToken( token );		// )
            // ( max.x max.y max.z )
            parser.getNextToken( token );		// (		
            parser.getNextToken( token );
            frame.max.x = token.getFloat();
            parser.getNextToken( token );
            frame.max.y = token.getFloat();
            parser.getNextToken( token );
            frame.max.z = token.getFloat();
            this.frames.push( frame );
            parser.getNextToken( token );		// )		
        }
        parser.getNextToken( token );			// }
    }

    private _readBaseFrames ( parser: IDoom3Tokenizer, token: IDoom3Token, numJoints: number ): void
    {
        parser.getNextToken( token );			// baseFrame
        parser.getNextToken( token );			// {

        for ( let i: number = 0; i < numJoints; i++ )
        {
            parser.getNextToken( token );		// (		
            parser.getNextToken( token );
            this.animJoints[ i ].baseOriginInParentSpace.x = token.getFloat();
            parser.getNextToken( token );
            this.animJoints[ i ].baseOriginInParentSpace.y = token.getFloat();
            parser.getNextToken( token );
            this.animJoints[ i ].baseOriginInParentSpace.z = token.getFloat();
            parser.getNextToken( token );		// )		

            parser.getNextToken( token );		// (		
            parser.getNextToken( token );
            this.animJoints[ i ].baseOrientationInParentSpace.x = token.getFloat();
            parser.getNextToken( token );
            this.animJoints[ i ].baseOrientationInParentSpace.y = token.getFloat();
            parser.getNextToken( token );
            this.animJoints[ i ].baseOrientationInParentSpace.z = token.getFloat();
            this.animJoints[ i ].baseOrientationInParentSpace.calculateW();
            parser.getNextToken( token );		// )
        }
        parser.getNextToken( token );			// }
    }

    private _readFrames ( parser: IDoom3Tokenizer, token: IDoom3Token, numFrames: number, numComponents: number ): void
    {
        for ( let i: number = 0; i < numFrames; i++ )
        {
            parser.getNextToken( token );			// frame
            parser.getNextToken( token );         // frameId
            parser.getNextToken( token );			// {

            for ( let j: number = 0; j < numComponents; j++ )  
            {
                parser.getNextToken( token );
                // 添加到MD5Frame的components数组中去！！！！
                this.frames[ i ].components[ j ] = token.getFloat();
            }
            parser.getNextToken( token );			// }
        }
    }

    public parse ( source: string ): void
    {
        let tokenizer: IDoom3Tokenizer = Doom3Factory.createTokenizer();
        let token: IDoom3Token = tokenizer.createToken();
        tokenizer.setSource( source );

        tokenizer.getNextToken( token );			// Version 
        tokenizer.getNextToken( token );		 
        tokenizer.getNextToken( token );			// Commandline 
        tokenizer.getNextToken( token );      	    
        tokenizer.getNextToken( token );			// numFrames
        tokenizer.getNextToken( token );
        let numFrames: number = token.getInt();
        tokenizer.getNextToken( token );			// numJoints
        tokenizer.getNextToken( token );
        let numJoints: number = token.getInt();
        tokenizer.getNextToken( token );			// frameRate
        tokenizer.getNextToken( token );
        this.frameRate = token.getInt();
        tokenizer.getNextToken( token );			// numAnimatedComponents
        tokenizer.getNextToken( token );
        let numAnimatedComponents: number = token.getInt();
        // 接下来就是各个关键区块内容的解析
        this._readHierarchy( tokenizer, token, numJoints );
        this._readBounds( tokenizer, token, numFrames );
        this._readBaseFrames( tokenizer, token, numJoints );
        this._readFrames( tokenizer, token, numFrames, numAnimatedComponents );
    }

    // 参数frameNum指明要构建哪一帧的姿态骨架
    public buildLocalSkeleton ( frameNum: number ): void
    {
        let frame: MD5Frame = this.frames[ frameNum ];
        // 构建当前帧的骨架姿态
        // 遍历当前帧中的所有关节
        for ( let i: number = 0; i < this.animJoints.length; i++ )
        {
            let applied: number = 0; //核心的变量
            let joint: MD5AnimJoint = this.animJoints[ i ];// 获取当前的关节
            let pose: Pose = this.skeleton.poses[ i ]; // 获取当前要填充的pose
            // 将joint中相关数据复制到pose对应的变量中
            pose.parentId = joint.parentId;
            joint.baseOriginInParentSpace.copy( pose.originInParentSpace );
            joint.baseOrientationInParentSpace.copy( pose.orientationInParentSpace );
            // 根据bit值来替换姿态,注意components的寻址关系
            if ( joint.componentBits & EAnimatedComponent.COMPONENT_BIT_TX )
            {
                // 替换tx
                pose.originInParentSpace.x = frame.components[ joint.componentOffset + applied ];
                applied++; // 加1
            }
            if ( joint.componentBits & EAnimatedComponent.COMPONENT_BIT_TY )
            {
                // 替换ty
                pose.originInParentSpace.y = frame.components[ joint.componentOffset + applied ];
                applied++; // 加1
            }
            if ( joint.componentBits & EAnimatedComponent.COMPONENT_BIT_TZ )
            {
                // 替换tz
                pose.originInParentSpace.z = frame.components[ joint.componentOffset + applied ];
                applied++; // 加1
            }
            if ( joint.componentBits & EAnimatedComponent.COMPONENT_BIT_QX )
            {
                // 替换qx
                pose.orientationInParentSpace.x = frame.components[ joint.componentOffset + applied ];
                applied++;
            }
            if ( joint.componentBits & EAnimatedComponent.COMPONENT_BIT_QY )
            {
                // 替换qy
                pose.orientationInParentSpace.y = frame.components[ joint.componentOffset + applied ];
                applied++;
            }
            if ( joint.componentBits & EAnimatedComponent.COMPONENT_BIT_QZ )
            {
                // 替换qz
                pose.orientationInParentSpace.z = frame.components[ joint.componentOffset + applied ];
                applied++;
            }
            pose.orientationInParentSpace.calculateW(); // 计算quat的w值
            pose.orientationInParentSpace.normalize();  // quat的单位化
            // 将origin和orientation合成仿射矩阵mat,该矩阵是局部表示的矩阵
            // 此时pose.matrix是将local表示的顶点变换到父亲坐标系的矩阵，切记切记！！！
            MathHelper.matrixFrom(pose.originInParentSpace,pose.orientationInParentSpace,pose.matrix);
        }
    }

    public updateToModelSpaceSkeleton():void{
        // 将pose的局部矩阵合成modelspace矩阵
        for(let i:number = 0; i < this.skeleton.poses.length;i++){
            let pose:Pose = this.skeleton.poses[i];
            if(pose.parentId >= 0 ){
                let parentPose:Pose = this.skeleton.poses[pose.parentId];
                mat4.product(parentPose.matrix,pose.matrix,pose.matrix);
            }
        }
    }
}