import { Application } from "../common/Application";
import { GLMatrixStack, GLWorldMatrixStack } from "./WebGLMatrixStack";
import { GLTexture } from "./WebGLTexture";
import { GLTextureCache } from "./WebGLTextureCache";
import { GLProgramCache } from "./WebGLProgramCache";
import { GLProgram } from "./WebGLProgram";
import { GLMeshBuilder } from "./WebGLMesh";
import { GLAttribState } from "./WebGLAttribState";
import { GLHelper } from "./WebGLHepler";

export class WebGLApplication extends Application
{
    // 可以直接操作WebGL相关内容
    public gl: WebGLRenderingContext;

    // 模拟OpenGL1.1中矩阵堆栈
    // 封装在GLWorldMatrixStatc中
    public matStack: GLWorldMatrixStack;

    // 模拟OpenGL1.1中的立即绘制模式
    // 封装在GLMeshBuilder类中
    public builder: GLMeshBuilder;

    // 为了在3D环境中同时支持Canvas2D绘制，特别是为了实现文字绘制
    protected canvas2D: HTMLCanvasElement | null = null;
    protected ctx2D: CanvasRenderingContext2D | null = null;

    public constructor ( canvas: HTMLCanvasElement, contextAttributes: WebGLContextAttributes = { premultipliedAlpha: false }, need2D: boolean = false )
    {
        super( canvas );
        let ctx: WebGLRenderingContext | null = this.canvas.getContext( "webgl", contextAttributes );
        if ( ctx === null )
        {
            alert( " 无法创建WebGLRenderingContext上下文对象 " );
            throw new Error( " 无法创建WebGLRenderingContext上下文对象 " );
        }

        this.gl = ctx;

        if ( need2D === true )
        {
            let canvasElem: HTMLCanvasElement = document.createElement( "canvas" ) as HTMLCanvasElement;
            canvasElem.width = this.canvas.width;
            canvasElem.height = this.canvas.height;
            canvasElem.style.backgroundColor = "transparent";
            canvasElem.style.position = "absolute";
            canvasElem.style.left = "0px";
            canvasElem.style.top = "0px";

            let parent: HTMLElement | null = this.canvas.parentElement;
            if ( parent === null )
            {
                throw new Error( "canvas元素必须要有父亲!!" );
            }

            parent.appendChild( canvasElem );

            this.ctx2D = canvasElem.getContext( "2d" );

            canvasElem.addEventListener( "mousedown", this, false );
            canvasElem.addEventListener( "mouseup", this, false );
            canvasElem.addEventListener( "mousemove", this, false );

            this.canvas.removeEventListener( "mousedown", this );
            this.canvas.removeEventListener( "mouseup", this );
            this.canvas.removeEventListener( "mousemove", this );

            this.canvas2D = canvasElem;
        }

        this.matStack = new GLWorldMatrixStack();
        // 初始化渲染状态
        GLHelper.setDefaultState( this.gl );

        // 由于Canvas是左手系，而webGL是右手系，需要FilpYCoord
        this.isFlipYCoord = true;

        // 初始化时，创建default纹理
        GLTextureCache.instance.set( "default", GLTexture.createDefaultTexture( this.gl ) );

        // 初始化时，创建颜色和纹理Program
        GLProgramCache.instance.set( "color", GLProgram.createDefaultColorProgram( this.gl ) );
        GLProgramCache.instance.set( "texture", GLProgram.createDefaultTextureProgram( this.gl ) );

        // 初始化时，创建颜色GLMeshBuilder对象
        this.builder = new GLMeshBuilder( this.gl, GLAttribState.POSITION_BIT | GLAttribState.COLOR_BIT, GLProgramCache.instance.getMust( "color" ) );
    }

    protected getMouseCanvas (): HTMLCanvasElement
    {
        if ( this.canvas2D !== null && this.ctx2D !== null )
        {
            return this.canvas2D;
        } else
        {
            return this.canvas;
        }
    }
}

export class WebGL2Application extends Application
{
    public gl: WebGLRenderingContext;

    public matStack: GLMatrixStack;
    public builder: GLMeshBuilder;

    protected canvas2D: HTMLCanvasElement | null = null;
    protected ctx2D: CanvasRenderingContext2D | null = null;

    public constructor ( canvas: HTMLCanvasElement, contextAttributes: WebGLContextAttributes = { premultipliedAlpha: false }, need2D: boolean = false )
    {
        super( canvas );
        let ctx: WebGLRenderingContext | null = this.canvas.getContext( "webgl", contextAttributes );
        if ( ctx === null )
        {
            alert( " 无法创建WebGLRenderingContext上下文对象 " );
            throw new Error( " 无法创建WebGLRenderingContext上下文对象 " );
        }

        this.gl = ctx;

        if ( need2D === true )
        {
            let canvasElem: HTMLCanvasElement = document.createElement( "canvas" ) as HTMLCanvasElement;
            canvasElem.width = this.canvas.width;
            canvasElem.height = this.canvas.height;
            canvasElem.style.backgroundColor = "transparent";
            canvasElem.style.position = "absolute";
            canvasElem.style.left = "0px";
            canvasElem.style.top = "0px";

            let parent: HTMLElement | null = this.canvas.parentElement;
            if ( parent === null )
            {
                throw new Error( "canvas元素必须要有父亲!!" );
            }

            parent.appendChild( canvasElem );

            this.ctx2D = canvasElem.getContext( "2d" );

            canvasElem.addEventListener( "mousedown", this, false );
            canvasElem.addEventListener( "mouseup", this, false );
            canvasElem.addEventListener( "mousemove", this, false );

            this.canvas.removeEventListener( "mousedown", this );
            this.canvas.removeEventListener( "mouseup", this );
            this.canvas.removeEventListener( "mousemove", this );

            this.canvas2D = canvasElem;
        }

        // 初始化渲染状态
        GLHelper.setDefaultState( this.gl );

        // 内置一个矩阵堆栈
        this.matStack = new GLMatrixStack();
        this.matStack.perspective( 45, canvas.width / canvas.height, 0.1, 1000 );

        // 由于Canvas是左手系，而webGL是右手系，需要FilpYCoord
        this.isFlipYCoord = true;

        // 初始化时，创建default纹理
        GLTextureCache.instance.set( "default", GLTexture.createDefaultTexture( this.gl ) );

        // 初始化时，创建颜色和纹理Program
        GLProgramCache.instance.set( "color", GLProgram.createDefaultColorProgram( this.gl ) );
        GLProgramCache.instance.set( "texture", GLProgram.createDefaultTextureProgram( this.gl ) );

        // 初始化时，创建颜色GLMeshBuilder对象
        this.builder = new GLMeshBuilder( this.gl, GLAttribState.POSITION_BIT | GLAttribState.COLOR_BIT, GLProgramCache.instance.getMust( "color" ) );
    }

    protected getMouseCanvas (): HTMLCanvasElement
    {
        if ( this.canvas2D !== null && this.ctx2D !== null )
        {
            return this.canvas2D;
        } else
        {
            return this.canvas;
        }
    }

}





