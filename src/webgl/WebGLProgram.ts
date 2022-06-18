import { GLAttribBits, GLAttribState } from "./WebGLAttribState"
import { vec2, vec3, vec4, mat4, quat } from "../common/math/TSM"
import { GLTexture } from "./WebGLTexture";
import { GLShaderSource } from "./WebGLShaderSource";
import { GLHelper, EShaderType, GLAttribMap, GLUniformMap } from "./WebGLHepler";
/*
比较特别的是Texture Unit
glActiveTexture 激活某个TextureUnit
glBindTexture   激活的TextureUnit中放入纹理
glUniform1i     将unit所绑定的纹理sampler传输到GPU

绘制时，不需要ActiveTexture了，只要bingTexture就可以了
*/
// camera相关transform uniform可以预先设定
// texture相关，固定化，可以预先设定
// 其他需要每帧更新

export class GLProgram
{
    // uniforms相关定义

    //vs常用的uniform命名
    public static readonly MVMatrix: string = "uMVMatrix";                // 模型视图矩阵
    public static readonly ModelMatrix: string = "uModelMatrix";          // 模型矩阵
    public static readonly ViewMatrix: string = "uViewMatrix";            // 视矩阵
    public static readonly ProjectMatrix: string = "uProjectMatrix";      // 投影矩阵
    public static readonly NormalMatrix: string = "uNormalMatrix";        // 法线矩阵                  
    public static readonly MVPMatrix: string = "uMVPMatrix";              // 模型_视图_投影矩阵
    public static readonly Color: string = "uColor";                      // 颜色值

    //ps常用的uniform命名
    public static readonly Sampler: string = "uSampler";                // 纹理取样器
    public static readonly DiffuseSampler: string = "uDiffuseSampler";  // 漫反射取样器
    public static readonly NormalSampler: string = "uNormalSampler";    // 法线取样器
    public static readonly SpecularSampler: string = "uSpecularSampler"; // 高光取样器
    public static readonly DepthSampler: string = "uDepthSampler";       // 深度取样器

    public gl: WebGLRenderingContext;  // WebGL上下文渲染对象
    public name: string;  // program名

    private _attribState: GLAttribBits; // 当前的Program使用的顶点属性bits值

    public program: WebGLProgram;   // 链接器
    public vsShader: WebGLShader;   // vertex shader编译器
    public fsShader: WebGLShader;   // fragment shader编译器

    // 主要用于信息输出
    public attribMap: GLAttribMap;
    public uniformMap:GLUniformMap;

    // 当调用gl.useProgram(this.program)后触发bindCallback回调
    public bindCallback: ( ( program: GLProgram ) => void ) | null;
    // 当调用gl.useProgram(null)前触发unbindCallback回调函数
    public unbindCallback: ( ( program: GLProgram ) => void ) | null;

    private _vsShaderDefineStrings: string[] = [];
    private _fsShaderDefineStrings: string[] = [];
   
    public get attribState (): GLAttribBits
    {
        return this._attribState;
    }

    private progromBeforeLink(gl:WebGLRenderingContext,program:WebGLProgram):void{
         //链接前才能使用bindAttribLocation函数
        //1 attrib名字必须和shader中的命名要一致
        //2 数量必须要和mesh中一致
        //3 mesh中的数组的component必须固定
        if ( GLAttribState.hasPosition( this._attribState ) )
        {
            gl.bindAttribLocation( program, GLAttribState.POSITION_LOCATION, GLAttribState.POSITION_NAME );
        }

        if ( GLAttribState.hasNormal( this._attribState ) )
        {
            gl.bindAttribLocation( program, GLAttribState.NORMAL_LOCATION, GLAttribState.NORMAL_NAME );
        }

        if ( GLAttribState.hasTexCoord_0( this._attribState ) )
        {
            gl.bindAttribLocation( program, GLAttribState.TEXCOORD_LOCATION, GLAttribState.TEXCOORD_NAME );
        }

        if ( GLAttribState.hasTexCoord_1( this._attribState ) )
        {
            gl.bindAttribLocation( program, GLAttribState.TEXCOORD1_LOCATION, GLAttribState.TEXCOORD1_NAME );
        }

        if ( GLAttribState.hasColor( this._attribState ) )
        {
            gl.bindAttribLocation( program, GLAttribState.COLOR_LOCATION, GLAttribState.COLOR_NAME );
        }

        if ( GLAttribState.hasTangent( this._attribState ) )
        {
            gl.bindAttribLocation( program, GLAttribState.TANGENT_LOCATION, GLAttribState.TANGENT_NAME );
        }
    }

    // 链接后的回调函数实际上在本类中是多余的
    // 因为我们已经固定了attribue的索引号以及getUniformLocation方法获取某个uniform变量
    // 这里只是为了输出当前Program相关的uniform和attribute变量的信息
    private progromAfterLink(gl:WebGLRenderingContext,program:WebGLProgram):void{
        //获取当前active状态的attribute和uniform的数量
        //很重要一点，active_attributes/uniforms必须在link后才能获得
        GLHelper.getProgramActiveAttribs(gl,program,this.attribMap);
        GLHelper.getProgramAtciveUniforms(gl,program,this.uniformMap);
        console.log(JSON.stringify(this.attribMap));
        console.log(JSON.stringify(this.uniformMap));
    }

   public constructor ( context: WebGLRenderingContext, attribState: GLAttribBits, vsShader: string | null = null, fsShader: string | null = null )
   {
       this.gl = context;
       this._attribState = attribState; //最好从shader中抽取
       this.bindCallback = null;
       this.unbindCallback = null;

       let shader: WebGLShader | null = GLHelper.createShader(this.gl,EShaderType.VS_SHADER);
       if ( shader === null )
       {
           throw new Error( "Create Vertex Shader Object Fail!!!" );
       }
       this.vsShader = shader;

       shader = null;
       shader = GLHelper.createShader(this.gl,EShaderType.FS_SHADER);
       if ( shader === null )
       {
           throw new Error( "Create Fragment Shader Object Fail!!!" );
       }
       this.fsShader = shader;

       let program: WebGLProgram | null = GLHelper.createProgram(this.gl);
       if ( program === null )
       {
           throw new Error( "Create WebGLProgram Object Fail!!!" );
       }
       this.program = program;

       this.attribMap = {};
       this.uniformMap = {};

       if ( vsShader !== null && fsShader !== null )
       {
           this.loadShaders( vsShader, fsShader );
       }

       this.name = name;
   }

    // 在Vertex Shader中动态添加宏
    public addVSShaderMacro ( str: string ): void
    {
        if ( str.indexOf( "#define " ) === -1 )
        {
            str = "#define " + str;
        }
        this._vsShaderDefineStrings.push( str );
    }

    // 在Fragment Shader中动态添加宏
    public addFSShaderMacro ( str: string ): void
    {
        if ( str.indexOf( "#define " ) === -1 )
        {
            str = "#define " + str;
        }
        this._fsShaderDefineStrings.push( str );
    }

    // vs fs都要添加的宏，例如在VS / FS中添加如下宏：
    // #ifdef GL_ES
    //   precision highp float;
    // #endif
    public addShaderMacro ( str: string ): void
    {
        this.addVSShaderMacro( str );
        this.addFSShaderMacro( str );
    }

   public loadShaders ( vs: string, fs: string ): void
   {
       if ( this._vsShaderDefineStrings.length > 0 )
       {
           let join: string = this._vsShaderDefineStrings.join( "\n" );
           vs = join + vs;
       }

       if ( this._fsShaderDefineStrings.length > 0 )
       {
           let join: string = this._fsShaderDefineStrings.join( "\n" );
           fs = join + fs;
       }

       if(GLHelper.compileShader(this.gl,vs,this.vsShader) === false){
        throw new Error(" WebGL顶点Shader链接不成功! ");
       }

       if(GLHelper.compileShader(this.gl,fs,this.fsShader) === false){
        throw new Error(" WebGL像素片段Shader链接不成功! ");
       }

       if(GLHelper.linkProgram(this.gl,this.program,this.vsShader,this.fsShader,this.progromBeforeLink.bind(this),this.progromAfterLink.bind(this)) === false){
           throw new Error(" WebGLProgram链接不成功! ");
       }
 
       console.log( JSON.stringify( this.attribMap ) );
   }

    public bind (): void
    {
        this.gl.useProgram( this.program );
        if ( this.bindCallback !== null )
        {
            this.bindCallback( this );
        }
    }

    public unbind (): void
    {
        if ( this.unbindCallback !== null )
        {
            this.unbindCallback( this );
        }
        this.gl.useProgram( null );
    }

    public getUniformLocation ( name: string ): WebGLUniformLocation | null
    {
        return this.gl.getUniformLocation( this.program, name );
    }

    public getAttributeLocation ( name: string ): number
    {
        return this.gl.getAttribLocation( this.program, name );
    }

    public setAttributeLocation ( name: string, loc: number ): void
    {
        this.gl.bindAttribLocation( this.program, loc, name );
    }

    public setInt(name:string , i:number):boolean{
        let loc: WebGLUniformLocation | null = this.getUniformLocation( name );
        if ( loc )
        {
            this.gl.uniform1i( loc, i );
            return true;
        }
        return false;
    }

    public setFloat ( name: string, f: number ): boolean
    {
        let loc: WebGLUniformLocation | null = this.getUniformLocation( name );
        if ( loc )
        {
            this.gl.uniform1f( loc, f );
            return true;
        }
        return false;
    }

    public setVector2 ( name: string, v2: vec2 ): boolean
    {
        let loc: WebGLUniformLocation | null = this.getUniformLocation( name );
        if ( loc )
        {
            this.gl.uniform2fv( loc, v2.values );
            return true;
        }
        return false;
    }

    public setVector3 ( name: string, v3: vec3 ): boolean
    {
        let loc: WebGLUniformLocation | null = this.getUniformLocation( name );
        if ( loc )
        {
            this.gl.uniform3fv( loc, v3.values );
            return true;
        }
        return false;
    }

    public setVector4 ( name: string, v4: vec4 ): boolean
    {
        let loc: WebGLUniformLocation | null = this.getUniformLocation( name );
        if ( loc )
        {
            this.gl.uniform4fv( loc, v4.values );
            return true;
        }
        return false;
    }

    public setQuat ( name: string, q: quat ): boolean
    {
        let loc: WebGLUniformLocation | null = this.getUniformLocation( name );
        if ( loc )
        {
            this.gl.uniform4fv( loc, q.values );
            return true;
        }
        return false;
    }

    public setMatrix3 ( name: string, mat: mat4 ): boolean
    {
        let loc: WebGLUniformLocation | null = this.getUniformLocation( name );
        if ( loc )
        {
            this.gl.uniformMatrix3fv( loc, false, mat.values );
            return true;
        }
        return false;
    }

    public setMatrix4 ( name: string, mat: mat4 ): boolean
    {
        let loc: WebGLUniformLocation | null = this.getUniformLocation( name );
        if ( loc )
        {
            this.gl.uniformMatrix4fv( loc, false, mat.values );
            return true;
        }
        return false;
    }

    public setSampler ( name: string, sampler: number ): boolean
    {
        let loc: WebGLUniformLocation | null = this.getUniformLocation( name );
        if ( loc )
        {
            this.gl.uniform1i( loc, sampler );
            return true;
        }
        return false;
    }

    public loadModeViewMatrix ( mat: mat4 ): boolean
    {
        return this.setMatrix4( GLProgram.MVMatrix, mat );
    }

    public loadSampler ( unit: number = 0 ): boolean
    {
        return this.setSampler( GLProgram.Sampler, unit );
    }

    /*
    public static createDefaultTextureProgram ( gl: WebGLRenderingContext ): GLProgram
    {
        let pro: GLProgram = new GLProgram( gl, GLAttribState.POSITION_BIT | GLAttribState.TEXCOORD_BIT,
            GLShaderSource.textureShader.vs, GLShaderSource.textureShader.fs );
        return pro;
    }

    public static createDefaultColorProgram ( gl: WebGLRenderingContext ): GLProgram
    {
        let pro: GLProgram = new GLProgram( gl, GLAttribState.POSITION_BIT | GLAttribState.COLOR_BIT,
            GLShaderSource.colorShader.vs, GLShaderSource.colorShader.fs );
        return pro;
    }
    */

   public static createDefaultTextureProgram ( gl: WebGLRenderingContext ): GLProgram
   {
       let pro: GLProgram = new GLProgram( gl, GLAttribState.makeVertexAttribs(true,false,false,false,false),
           GLShaderSource.textureShader.vs, GLShaderSource.textureShader.fs );
       return pro;
   }

   public static createDefaultColorProgram ( gl: WebGLRenderingContext ): GLProgram
   {
       let pro: GLProgram = new GLProgram( gl, GLAttribState.makeVertexAttribs(false,false,false,false,true),
           GLShaderSource.colorShader.vs, GLShaderSource.colorShader.fs );
       return pro;
   }
}

