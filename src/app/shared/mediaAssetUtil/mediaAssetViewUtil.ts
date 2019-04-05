import { ViewChild, ElementRef, Renderer2, Injectable, Inject } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs';
import { FileToUploadModel } from '../../campaign/shared/components/campaign-definition/model/fileToUploadModel';
import { MediaFileAssetViewModel } from '../../campaign/shared/models/mediaFileAssetViewModel';
@Injectable({
    providedIn: 'root'
})
export class MediaAssetViewUtil {
    video: any;
    @ViewChild('visualization') visualization: ElementRef;
    // @ViewChild('img') img: ElementRef;
    context: CanvasRenderingContext2D;
    element: HTMLImageElement;
    // canWidth: number;
    // canHeight: number;
    canvas: any;
    img: any;
    // @Inject(Renderer2) private renderer 
    thumbwidth = 100;
    thumbheight = 100;
    jpeg = true;
    quality = 90;
    thumbnail: any;
    dataSource = new BehaviorSubject(this.thumbnail);
    data = this.dataSource.asObservable();
    
    constructor(public renderer: Renderer2) {
        // let render = new Renderer2();
        this.canvas = this.renderer.createElement("canvas");
        this.video = this.renderer.createElement("video");
        this.renderer.setAttribute(this.canvas, "visualization", "visualization");
        // canvas.setAttribute(this.visualization);
        this.context = this.canvas.getContext('2d');
    }



    // videoThumbnail(video) {
    //     this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);

    // }

    getImageThumbnail = (file, name) => {
        this.img = new Image();
        this.img.src = file;
        this.img.onload = () => {
            // this.grabformvalues();
            // this.imagetocanvas(img, , , name);

            var dimensions = this.resize(this.img.width, this.img.height, this.thumbwidth, this.thumbheight);
            this.canvas.width = dimensions.w;
            this.canvas.height = dimensions.h;
            let thumbnail = this.imagetocanvas(this.img, dimensions);
            console.log(thumbnail);
            this.dataSource.next(thumbnail);
            return thumbnail;
        }
    }

    // fileReader(event) {
    //     for (let i = 0; i < event.length; i++) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             this.loadImage(e.target.result, event[i].name)
    //         };
    //         reader.readAsDataURL(event[i]);
    //     }
    // }

    imagetocanvas(img, dimensions) {

        this.context.drawImage(img, 0, 0, dimensions.w, dimensions.h);
        // console.log(img)
        // var thumb = new Image(),
        //   let  url = this.jpeg ? this.canvas.toDataURL('image/jpeg', this.quality) : this.canvas.toDataURL();
        // let url =  this.canvas.toDataURL();
        // $("#canvas-img").attr("src",url)
        let thumbnail = this.addtothumbslist(this.jpeg, this.quality, name);
        return thumbnail;
    }

    addtothumbslist(jpeg, quality, name) {
        var thumb = new Image(),
            url = jpeg ? this.canvas.toDataURL('image/jpeg', quality) : this.canvas.toDataURL();
        // let url =  this.canvas.toDataURL();
        thumb.src = url;
        var thumbname = name.split('.');
        thumbname = thumbname[0] + '_tn.' + (jpeg ? 'jpg' : thumbname[1]);
        thumb.title = thumbname + ' ' + Math.round(url.length / 1000 * 100) / 100 + ' KB';
        thumb.setAttribute('data-filename', thumbname);
        // var link = document.createElement('a');
        // link.href = url;
        return url;
        // console.log(link.href)

    }

    resize(imagewidth, imageheight, thumbwidth, thumbheight) {
        var w = 0, h = 0, x = 0, y = 0,
            widthratio = imagewidth / thumbwidth,
            heightratio = imageheight / thumbheight,
            maxratio = Math.max(widthratio, heightratio);
        if (maxratio > 1) {
            w = imagewidth / maxratio;
            h = imageheight / maxratio;
        } else {
            w = imagewidth;
            h = imageheight;
        }
        x = (thumbwidth - w) / 2;
        y = (thumbheight - h) / 2;
        return { w: w, h: h, x: x, y: y };
    }

    
  

}

