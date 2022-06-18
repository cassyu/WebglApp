import { HttpRequest } from "../common/utils/HttpRequest";
import { Application } from "../common/Application";

export class AsyncLoadTestApplication extends Application
{
    private _urls: string[] = [ "data/uv.jpg", "data/test.jpg", "data/p1.jpg" ];

    // 必须要使用async关键字，一个一个载入图像文件
    public async loadImagesSequence (): Promise<void>
    {
        for ( let i: number = 0; i < this._urls.length; i++ )
        {
            let image: HTMLImageElement = await HttpRequest.loadImageAsync( this._urls[ i ] );
            console.log( "1、loadImagesSequence : ", i, image );
        }
    }

    // 不需要用使用async,并行载入所有图像文件
    public loadImagesParallel (): void
    {
        // 使用Promise.all方法，并发方式加载所有image文件
        let _promises: Promise<HTMLImageElement>[] = [];
        for ( let i: number = 0; i < this._urls.length; i++ )
        {
            _promises.push( HttpRequest.loadImageAsync( this._urls[ i ] ) );
        }
        Promise.all( _promises ).then( ( images: HTMLImageElement[] ) =>
        {
            for ( let i: number = 0; i < images.length; i++ )
            {
                console.log( "3、loadImagesParallel : ", images[ i ] );
            }
        } );
    }

    public loadImagesParallelWithPromise (): Promise<void>
    {
        return new Promise( ( resolve, reject ): void =>
        {
            let _promises: Promise<HTMLImageElement>[] = [];
            for ( let i: number = 0; i < this._urls.length; i++ )
            {
                _promises.push( HttpRequest.loadImageAsync( this._urls[ i ] ) );
            }
            Promise.all( _promises ).then( ( images: HTMLImageElement[] ) =>
            {
                for ( let i: number = 0; i < images.length; i++ )
                {
                    console.log( "3、loadImagesParallelWithPromise : ", images[ i ] );
                }
                resolve();
            } );
        } );
    }

    public async loadTextFile (): Promise<void>
    {
        let str: string = await HttpRequest.loadTextFileAsync( "data/test.txt" );
        console.log( "2、文本文件内容：", str );
    }

    
    // 覆写（override）基类方法
    public async run (): Promise<void>
    {
        // 重点关注代码调用顺序与运行后的显示顺序之间的关系
        //await this.loadImagesSequence();        // 1、先await调用Sequence版加载Image
        await this.loadTextFile();              // 2、然后await调用文本文件加载方法
        //this.loadImagesParallel();              // 3、最后调用Parallel版加载image
        //await this.loadImagesParallelWithPromise();
        console.log( "4、完成run方法的调用" );      // 4、完成输出
    }
    
    /*
    // 覆写（override）基类方法
    public async run (): Promise<void>
    {
        // 重点关注代码调用顺序与运行后的显示顺序之间的关系
        await this.loadImagesSequence();        // 1、先await调用Sequence版加载Image
        await this.loadTextFile();              // 2、然后await调用文本文件加载方法
        this.loadImagesParallel();              // 3、最后调用Parallel版加载image
        console.log( "4、完成run方法的调用" );      // 4、完成输出
    }
    */

    /*
    // 覆写（override）基类方法
    public async run (): Promise<void>
    {
        // 重点关注代码调用顺序与运行后的显示顺序之间的关系
        await this.loadImagesSequence();        // 1、先await调用Sequence版加载Image
        await this.loadTextFile();              // 2、然后await调用文本文件加载方法
        this.loadImagesParallel();              // 3、最后调用Parallel版加载image
        console.log( "4、完成run方法的调用" );      // 4、完成输出
    }
    */
}
