import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
declare var $: any;
@Component({
  selector: 'cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.css']
})
export class CropperComponent implements OnInit, OnChanges {
  @Input() options: any;
  @Input() isPlatformShow: boolean;
  @Input() selectedTab: string;
  @Input() selectedRatio: string;
  @Output() cropImages: EventEmitter<Array<any>> = new EventEmitter<any>();
  @Output() previewImage: EventEmitter<any> = new EventEmitter<any>();
  @Output() closePopup: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('visualization') visualization: ElementRef;
  // @ViewChild('img') img: ElementRef;
  context: CanvasRenderingContext2D;
  element: HTMLImageElement;
  imgWidth: number;
  imgHeight: number;
  template: any;
  cropBoxWidth: number;
  cropBoxHeight: number;
  cropBoxX: number;
  cropBoxY: number;
  canvas: any;
  isMove: boolean;
  currentElement: any;
  offset: any;
  canvasCoordinates: any;
  isResizeAble: boolean;
  currentEdge: string;
  original_x = 0;
  original_y = 0;
  original_mouse_x = 0;
  original_mouse_y = 0;
  img = new Image();
  mCropBoxWidth: Array<number> = [];
  mCropBoxHeight: Array<number> = [];
  mCropBoxX: Array<number> = [];
  mCropBoxY: Array<number> = [];
  downPointX: number = 0;
  downPointY: number = 0;
  lastPointX: number = 0;
  lastPointY: number = 0;
  aspectedRatio: number;
  //  maxX:any;
  //  maxY:any;
  currentElementCoordinates: any;
  @HostListener('mousemove', ['$event'])
  onMouseMove(e) {




    if (this.currentElement) {
      var loc = this.windowToCanvas(e.clientX, e.clientY);
      this.lastPointX = loc.x;
      this.lastPointY = loc.y;
      // console.log("this.lastPointX",this.lastPointX)
      let currentElementCoordinates = this.currentElement.getBoundingClientRect();
      // console.log("current element coordinates", this.currentElement.getBoundingClientRect())
      if (this.currentElement.id) {
        //     let height = $("#" +this.currentElement.id).css("height").replace(/[^0-9\-.,]/g, '').split(',');
        // let width = $("#" +this.currentElement.id).css("width").replace(/[^0-9\-.,]/g, '').split(',');
        // let top = $("#" +this.currentElement.id).css("top").replace(/[^0-9\-.,]/g, '').split(',');
        // let left = $("#" +this.currentElement.id).css("left").replace(/[^0-9\-.,]/g, '').split(',');



        if (this.isMove) {
          if (e.target.id != "") {
            let mousePosition = {

              x: e.clientX,
              y: e.clientY

            };
            if (((mousePosition.x + this.offset[0]) + this.currentElementCoordinates.width) < 500 && (mousePosition.x + this.offset[0]) > 0 && (mousePosition.y + this.offset[1]) > 0 && ((mousePosition.y + this.offset[1]) + this.currentElementCoordinates.height) < 500) {
              this.currentElement.style.left = (mousePosition.x + this.offset[0]) + 'px';
              this.currentElement.style.top = (mousePosition.y + this.offset[1]) + 'px';
            }
            // if(mousePosition.x <= this.maxX  && mousePosition.x >= this.canvasCoordinates.left){
            //   this.currentElement.style.left =( mousePosition.x - 15)  + 'px';

            // }
            // if(mousePosition.y <= this.maxY && mousePosition.y >= this.canvasCoordinates.top){
            //   this.currentElement.style.top = (mousePosition.y - 15)  + 'px';
            // }

          }
        }
      }
    }
    if (this.isResizeAble) {
      if (this.selectedRatio === "free" || this.selectedRatio === undefined) {
        var loc = this.windowToCanvas(e.clientX, e.clientY);
        this.lastPointX = loc.x;
        this.lastPointY = loc.y;
        let mousePosition = {

          x: e.clientX,
          y: e.clientY

        };
        if (this.isPlatformShow) {

          var loc = this.windowToCanvas(e.clientX, e.clientY);
          this.lastPointX = loc.x;
          this.lastPointY = loc.y;
          if (this.currentEdge === "lt") {
            if (((mousePosition.x + this.offset[0]) + this.cropBoxWidth) < this.canvasCoordinates.width) {
              this.currentElement.style.width = this.cropBoxWidth - (e.pageX - this.original_mouse_x) + 'px'
              this.currentElement.style.height = this.cropBoxHeight - (e.pageY - this.original_mouse_y) + 'px'
              this.currentElement.style.top = this.original_y + (e.pageY - this.original_mouse_y) + 'px'
              this.currentElement.style.left = this.original_x + (e.pageX - this.original_mouse_x) + 'px'
            }
          }
          else if (this.currentEdge === "rt") {
            if (((mousePosition.x + this.offset[0]) + this.cropBoxWidth) < this.canvasCoordinates.width) {
              this.currentElement.style.width = this.cropBoxWidth + (e.pageX - this.original_mouse_x) + 'px';
              // console.log("actual width", this.currentElement.style.width)
              this.currentElement.style.height = this.cropBoxHeight - (e.pageY - this.original_mouse_y) + 'px';
              this.currentElement.style.top = this.original_y + (e.pageY - this.original_mouse_y) + 'px';
            }
          }
          else if (this.currentEdge === "rb") {
            if (((mousePosition.x + this.offset[0]) + this.cropBoxWidth) < this.canvasCoordinates.width) {
              this.currentElement.style.width = this.cropBoxWidth + (e.pageX - this.original_mouse_x) + 'px';
              this.currentElement.style.height = this.cropBoxHeight + (e.pageY - this.original_mouse_y) + 'px';
            }

          }
          else if (this.currentEdge === "lb") {
            // this.currentElement.style.width =  (e.clientX - this.currentElement.offsetLeft) + 'px';
            // this.currentElement.style.height = (e.clientY - this.currentElement.offsetTop)  + 'px'; 
            if (((mousePosition.x + this.offset[0]) + this.cropBoxWidth) < this.canvasCoordinates.width) {
              this.currentElement.style.width = this.cropBoxWidth - (e.pageX - this.original_mouse_x) + 'px';
              this.currentElement.style.height = this.cropBoxHeight + (e.pageY - this.original_mouse_y) + 'px';
              this.currentElement.style.left = this.original_x + (e.pageX - this.original_mouse_x) + 'px';
            }
          }
        } else {
          var loc = this.windowToCanvas(e.clientX, e.clientY);
          this.lastPointX = loc.x;
          this.lastPointY = loc.y;
          for (let i = 0; i < this.options.platform.length; i++) {
            // console.log(this.currentEdge)
            if (this.currentEdge === "lt" + i) {
              if (((mousePosition.x + this.offset[0]) + this.cropBoxWidth) < this.canvasCoordinates.width) {
                this.currentElement.style.width = this.cropBoxWidth - (e.pageX - this.original_mouse_x) + 'px'
                this.currentElement.style.height = (this.cropBoxHeight - (e.pageY - this.original_mouse_y)) + 'px';
                this.currentElement.style.top = this.original_y + (e.pageY - this.original_mouse_y) + 'px'
                this.currentElement.style.left = this.original_x + (e.pageX - this.original_mouse_x) + 'px'
              }
            }
            else if (this.currentEdge === "rt" + i) {
              if (((mousePosition.x + this.offset[0]) + this.cropBoxWidth) < this.canvasCoordinates.width) {
                this.currentElement.style.width = this.cropBoxWidth + (e.pageX - this.original_mouse_x) + 'px';
                this.currentElement.style.height = this.cropBoxHeight - (e.pageY - this.original_mouse_y) + 'px';
                this.currentElement.style.top = this.original_y + (e.pageY - this.original_mouse_y) + 'px';
              }
            }
            else if (this.currentEdge === "rb" + i) {
              this.currentElement.style.width = this.cropBoxWidth + (e.pageX - this.original_mouse_x) + 'px';

              this.currentElement.style.height = this.cropBoxHeight + (e.pageY - this.original_mouse_y) + 'px';
            }
            else if (this.currentEdge === "lb" + i) {
              if (((mousePosition.x + this.offset[0]) + this.cropBoxWidth) < this.canvasCoordinates.width) {
                this.currentElement.style.width = this.cropBoxWidth - (e.pageX - this.original_mouse_x) + 'px';
                this.currentElement.style.height = this.cropBoxHeight + (e.pageY - this.original_mouse_y) + 'px';
                this.currentElement.style.left = this.original_x + (e.pageX - this.original_mouse_x) + 'px';
              }
            }
          }
        }



      }
    }
  }
  @HostListener('mousedown', ['$event'])
  onMouseDown(e) {
    var loc = this.windowToCanvas(e.clientX, e.clientY);
    this.downPointX = loc.x;
    this.downPointY = loc.y;
    this.lastPointX = loc.x;
    this.lastPointY = loc.y;
    // console.log("event on mouse down",e)
    if (this.isPlatformShow) {

      this.currentElement = document.getElementById(e.target.id);
      if (e.target.id === "single-crop-box") {
        this.isMove = true;
        this.offset = [
          this.currentElement.offsetLeft - e.clientX,
          this.currentElement.offsetTop - e.clientY
        ];
      }
      if (e.target.id === "lb" || e.target.id === "lt" || e.target.id === "rb" || e.target.id === "rt") {
        this.isResizeAble = true;
        this.currentEdge = e.target.id
        // console.log("parent element ",e.target.parentElement.id)
        this.currentElement = document.getElementById(e.target.parentElement.id);

        this.offset = [
          this.currentElement.offsetLeft - e.clientX,
          this.currentElement.offsetTop - e.clientY
        ];
      }

    } else {
      for (let i = 0; i < this.options.platform.length; i++) {
        if (e.target.id === "crop-box" + i) {
          this.currentElement = document.getElementById(e.target.id);
          this.isMove = true;
          this.offset = [
            this.currentElement.offsetLeft - e.clientX,
            this.currentElement.offsetTop - e.clientY
          ];

        }
        if (e.target.parentElement.id === "crop-box" + i) {
          this.currentElement = document.getElementById(e.target.parentElement.id);
        }
        if (e.target.id === "lb" + i || e.target.id === "lt" + i || e.target.id === "rb" + i || e.target.id === "rt" + i) {
          this.isResizeAble = true;
          this.currentEdge = e.target.id
          // console.log("parent element ",e.target.parentElement.id)
          this.currentElement = document.getElementById(e.target.parentElement.id);
          this.offset = [
            this.currentElement.offsetLeft - e.clientX,
            this.currentElement.offsetTop - e.clientY
          ];

        }

      }
    }
    if (this.currentElement) {
      // console.log(this.currentElement.offsetLeft)
      this.original_x = this.currentElement.offsetLeft;
      this.original_y = this.currentElement.offsetTop;
      this.original_mouse_x = e.pageX;
      this.original_mouse_y = e.pageY;
      if (this.isResizeAble) {
        let height = $("#" + this.currentElement.id).css("height").replace(/[^0-9\-.,]/g, '').split(',');
        let width = $("#" + this.currentElement.id).css("width").replace(/[^0-9\-.,]/g, '').split(',');
        this.cropBoxHeight = Number(height[0]);
        this.cropBoxWidth = Number(width[0]);
      }
      this.currentElementCoordinates = this.currentElement.getBoundingClientRect();
    }

    // let innerDivWidth = currentElementCoordinates.width;
    // let innerDivHeight = currentElementCoordinates.height;
    // let  offset = this.canvas.offset;
    // let  l = this.canvas.offsetLeft + 15;
    // let  t = this.canvas.offsetTop + 15;
    // let  h = this.canvasCoordinates.width;
    // let  w = this.canvasCoordinates.height;

    //  this.maxX = l + w - innerDivWidth;
    //  this.maxY = t + h - innerDivHeight;

    // let currentElementCoordinates  = this.currentElement.getBoundingClientRect();
    // this.maxX = (this.canvasCoordinates.left + this.canvasCoordinates.width - currentElementCoordinates.width);
    // this.maxY = (this.canvasCoordinates.top + this.canvasCoordinates.height - currentElementCoordinates.height);
  }
  @HostListener('mouseup', ['$event'])
  onMouseUp(e) {
    this.isMove = false;

    this.isResizeAble = false;
    // this.cropImage();
    // this.ImagePreview()
    // let matrix = $(this.currentElement).css('transform').replace(/[^0-9\-.,]/g, '').split(',');
    // this.cropBoxX = Number(matrix[12] )|| Number(matrix[4]);
    // this.cropBoxY = Number(matrix[13]) || Number(matrix[5]);

  }

  constructor() {


  }

  ngOnInit() {
    this.isMove = false;
    this.isResizeAble = false;
  }

  ngOnChanges() {
    if (!this.isPlatformShow && !this.selectedRatio) {
      this.mCropBoxWidth = [];
      this.mCropBoxHeight = [];
      this.mCropBoxX = [];
      this.mCropBoxY = [];
      this.aspectedRatio = 1 / 1;
      for (let i = 0; i < this.options.platform.length; i++) {
        this.imgHeight = this.options.height;
        this.imgWidth = this.options.width;
        //       this.mCropBoxWidth.push(this.imgHeight /2 );
        // this.mCropBoxHeight.push(this.imgWidth/2);
        // this.mCropBoxX.push((this.imgWidth - this.mCropBoxWidth[i])/2);
        // this.mCropBoxY.push((this.imgHeight - this.mCropBoxHeight[i])/2);


        this.mCropBoxWidth.push((this.imgHeight / 2) * this.aspectedRatio);
        this.mCropBoxHeight.push((this.imgWidth / 2) / this.aspectedRatio);
        this.mCropBoxX.push((this.imgWidth - this.mCropBoxWidth[i]) / 2);
        this.mCropBoxY.push((this.imgHeight - this.mCropBoxHeight[i]) / 2);
      }
      this.imageRenderOnCanvas();
    } else if (!this.isPlatformShow && this.selectedRatio) {
      this.mCropBoxWidth = [];
      this.mCropBoxHeight = [];
      this.mCropBoxX = [];
      this.mCropBoxY = [];
      for (let i = 0; i < this.options.platform.length; i++) {
        this.imgHeight = this.options.height;
        this.imgWidth = this.options.width;
        //       this.mCropBoxWidth.push(this.imgHeight /2 );
        // this.mCropBoxHeight.push(this.imgWidth/2);
        // this.mCropBoxX.push((this.imgWidth - this.mCropBoxWidth[i])/2);
        // this.mCropBoxY.push((this.imgHeight - this.mCropBoxHeight[i])/2);
        this.aspectedRatio = 1 / 1;
        if (this.selectedRatio === "1/1") {
          this.aspectedRatio = 1 / 1;
        }
        else if (this.selectedRatio === "2/3") {
          this.aspectedRatio = 2 / 3;
        }
        else if (this.selectedRatio === "4/3") {
          this.aspectedRatio = 4 / 3;
        }
        else if (this.selectedRatio === "16/9") {
          this.aspectedRatio = 16 / 9;
        }

        console.log("aspected ratio convert in number", this.selectedRatio.replace(/['"]+/g, ''))
        this.mCropBoxWidth.push((this.imgHeight / 2) * this.aspectedRatio);
        this.mCropBoxHeight.push((this.imgWidth / 2) / this.aspectedRatio);
        this.mCropBoxX.push((this.imgWidth - this.mCropBoxWidth[i]) / 2);
        this.mCropBoxY.push((this.imgHeight - this.mCropBoxHeight[i]) / 2);
        $(".single-crop-box").css("display", "none");
        // for(let i = 0;i < this.options.platform.length;i++){
        // $("#crop-box"+i).css("display","block");
        // }
        $("#crop-box" + i).css({ "display": "block", "width": (this.imgHeight / 2) * this.aspectedRatio, "height": (this.imgWidth / 2) / this.aspectedRatio, "left": (this.imgWidth - this.mCropBoxWidth[i]) / 2, "top": (this.imgHeight - this.mCropBoxHeight[i]) / 2 });
      }
      // this.imageRenderOnCanvas();
    } else if (this.isPlatformShow && this.selectedRatio) {
      this.aspectedRatio = 1 / 1;
      if (this.selectedRatio === "1/1") {
        this.aspectedRatio = 1 / 1;
      }
      else if (this.selectedRatio === "2/3") {
        this.aspectedRatio = 2 / 3;
      }
      else if (this.selectedRatio === "4/3") {
        this.aspectedRatio = 4 / 3;
      }
      else if (this.selectedRatio === "16/9") {
        this.aspectedRatio = 16 / 9;
      }
      this.imgHeight = this.options.height;
      this.imgWidth = this.options.width;
      this.cropBoxWidth = (this.imgWidth / 2) * this.aspectedRatio;
      this.cropBoxHeight = (this.imgHeight / 2) / this.aspectedRatio;
      this.cropBoxX = (this.imgWidth - this.cropBoxWidth) / 2;
      this.cropBoxY = (this.imgHeight - this.cropBoxHeight) / 2;
      for (let i = 0; i < this.options.platform.length; i++) {
        $("#crop-box" + i).css("display", "none");
      }
      $("#single-crop-box").css({ "display": "block", "width": this.cropBoxWidth, "height": this.cropBoxHeight, "left": this.cropBoxX, "top": this.cropBoxY });
      // this.assignCropBox();
    }
    else {
      this.imgHeight = this.options.height;
      this.imgWidth = this.options.width;
      this.cropBoxWidth = this.imgWidth / 2;
      this.cropBoxHeight = this.imgHeight / 2;
      this.aspectedRatio = 1 / 1;
      this.cropBoxX = (this.imgWidth - this.cropBoxWidth) / 2;
      this.cropBoxY = (this.imgHeight - this.cropBoxHeight) / 2;
      this.assignCropBox();
    }

    let canvasContainer = document.getElementsByClassName("canvas-container");
    $(canvasContainer).css({
      'width': this.imgWidth + 'px',
      'height': this.imgHeight + 'px',
      'position': 'relative'
    });

  }
  windowToCanvas(x, y) {
    var canvas = this.context.canvas,
      bbox = canvas.getBoundingClientRect();
    return {
      x: x - bbox.left * (canvas.width / bbox.width),
      y: y - bbox.top * (canvas.height / bbox.height)
    };
  }
  imageRenderOnCanvas() {
    this.context = this.visualization.nativeElement.getContext("2d");
    this.element = this.options.image;


    let self = this;
    this.img.setAttribute('crossOrigin', 'anonymous');
    this.img.onload = function () {
      // self.context.drawImage(self.img, 0, 0,self.img.width,self.img.height,0,0,self.imgWidth,self.imgHeight);
      self.context.drawImage(self.img, 0, 0, self.img.width, self.img.height, 0, 0, self.imgWidth, self.imgHeight);

      self.assignCropBox()
    }
    self.img.src = this.options.image;
  }
  assignCropBox() {
    this.canvas = document.getElementById("overlay");
    if (!this.isPlatformShow) {
      if (this.template) {
        $(".single-crop-box").css("display", "none");
        for (let i = 0; i < this.options.platform.length; i++) {
          $("#crop-box" + i).css("display", "block");
        }
      } else {
        for (let i = 0; i < this.options.platform.length; i++) {

          this.template = ("<div class='crop-box " + this.options.platform[i] + "' id='crop-box" + i + "' style='height:" + this.mCropBoxHeight[i] + 'px' +
            ";width:" + this.mCropBoxWidth[i] + 'px' + ";left:" + this.mCropBoxX[i] + 'px' + ";top:" + this.mCropBoxY[i] + 'px' +
            ";cursor: move;'><span id='lt" + i + "' class='lt" + i + " " + this.options.platform[i] +
            "' style='position: absolute;width: 10px;height:10px;z-index: 1;left: -5px;top: -5px;cursor: nwse-resize;'></span><span id='lb" + i + "' class='lb" +
            i + " " + this.options.platform[i] +
            "' style='position: absolute;width: 10px;height:10px;z-index: 1;left: -5px;bottom: -5px;cursor: nesw-resize;'></span><span id='rt" + i + "' class='rt" +
            i + " " + this.options.platform[i] +
            "' style='position: absolute;width: 10px;height:10px;z-index: 1;right: -5px;top: -5px;cursor: nesw-resize;'></span><span id='rb" + i + "' class='rb" +
            i + " " +
            this.options.platform[i] + "-edge' style='position: absolute;width: 25px;height:25px;z-index: 1;right: -10px;bottom: -10px;cursor: nwse-resize;'></span></div>"
          );
          $(this.canvas).append(this.template);



        }
      }

    } else {
      if (this.template != "") {
        for (let i = 0; i < this.options.platform.length; i++) {
          $("#crop-box" + i).css("display", "none");
        }
        let findDiv = $("#overlay").find("div").hasClass("single-crop-box");
        if (findDiv) {
          $(".single-crop-box").css("display", "block");
        } else {
          this.template = ("<div id='single-crop-box' class='single-crop-box' style='height:" + this.cropBoxHeight + 'px' +
            ";width:" + this.cropBoxWidth + 'px' + ";left:" + this.cropBoxX + 'px' + ";top:" + this.cropBoxY + 'px' +
            ";cursor: move;' > <span id='lt' class='lt' style='position: absolute;width: 10px;height:10px;z-index: 1;left: -5px;top: -5px;cursor: nwse-resize;'></span> <span style='position: absolute;width: 10px;height:10px;z-index: 1;left: -5px;bottom: -5px;cursor: nesw-resize;' class='lb' id='lb'></span> <span id='rt' class='rt' style='position: absolute;width: 10px;height:10px;z-index: 1;right: -5px;top: -5px;cursor: nesw-resize;'></span> <span class='rb' id='rb' style='position: absolute;width: 10px;height:10px;z-index: 1;right: -5px;bottom: -5px;cursor: nwse-resize;'></span></div>")
          $(this.canvas).append(this.template);
        }

      }

    }

    this.canvasCoordinates = this.canvas.getBoundingClientRect();
    // console.log("canvas coordinates",this.canvasCoordinates)
  }
  cropImage() {
    let base64Images = [];
    var tnCanvas = document.createElement('canvas');
    var tnCanvasContext = tnCanvas.getContext('2d');
    // var bufferCanvas = document.createElement('canvas');
    // var bufferContext = bufferCanvas.getContext('2d');
    // bufferCanvas.width = this.img.width;
    // bufferCanvas.height = this.img.height;
    // bufferContext.drawImage(this.img, 0, 0);
    if (!this.isPlatformShow) {


      for (let i = 0; i < this.options.platform.length; i++) {
        let left = $("#crop-box" + i).css("left").replace(/[^0-9\-.,]/g, '').split(',');
        let top = $("#crop-box" + i).css("top").replace(/[^0-9\-.,]/g, '').split(',');
        let width = $("#crop-box" + i).css("width").replace(/[^0-9\-.,]/g, '').split(',');
        let height = $("#crop-box" + i).css("height").replace(/[^0-9\-.,]/g, '').split(',');
        tnCanvas.width = Number(width[0]);
        tnCanvas.height = Number(height[0]);
        let x1 = Number(left[0]);
        let x2 = x1 + Number(width[0]);
        let y1 = Number(top[0]);
        let y2 = y1 + Number(height[0])
        let kw = this.img.width / this.canvasCoordinates.width;
        let kh = this.img.height / this.canvasCoordinates.height;
        let sw = x2 - x1;
        let sh = y2 - y1;
        // let self = this;

        console.log("get image width", (Number(width[0]) * 2))
        console.log("get image", (Number(left[0] + 100)));
        tnCanvasContext.drawImage(this.img, (x1 * kw), (y1 * kh), (sw * kw), (sh * kh), 0, 0, Number(width[0]), Number(height[0]));
        // if(Number(left[0]) === 0){
        //   tnCanvasContext.drawImage(bufferCanvas,(Number(left[0])),(Number(top[0]) + 100), (Number(width[0]) * 2), (Number(height[0]) * 2), 0, 0, Number(width[0]), Number(height[0]));
        // }
        // else if(Number(top[0]) === 0){
        //   tnCanvasContext.drawImage(bufferCanvas,(Number(left[0])  + 100),(Number(top[0])), (Number(width[0]) * 2), (Number(height[0]) * 2), 0, 0, Number(width[0]), Number(height[0]));
        // }
        // else if(Number(top[0]) === 0 && Number(left[0]) === 0){
        //   tnCanvasContext.drawImage(bufferCanvas,(Number(left[0])  ),(Number(top[0]) ), (Number(width[0]) * 2), (Number(height[0]) * 2), 0, 0, Number(width[0]), Number(height[0]));
        // }
        // else{
        //   tnCanvasContext.drawImage(bufferCanvas,(Number(left[0])  + 100),(Number(top[0]) + 100), (Number(width[0]) * 2), (Number(height[0]) * 2), 0, 0, Number(width[0]), Number(height[0]));
        // }
        //  let name = this.options.name.substring(this.options.name.lastIndexOf(".") + 1);
        let data = {
          "src": tnCanvas.toDataURL(),
          "type": this.options.platform[i],
          "name": this.options.name
        }
        base64Images.push(data);
        // let data = {
        //   "src" : tnCanvas.toDataURL(),
        //   "type":
        // }
        // console.log(tnCanvas.toDataURL())
        //  base64Images.push(tnCanvas.toDataURL());
        // console.log("base64 Image",base64Images)

        // console.log(tnCanvas);
      }
      return base64Images;
      // this.cropImages.emit(base64Images);
    } else {
      let left = $("#single-crop-box").css("left").replace(/[^0-9\-.,]/g, '').split(',');
      let top = $("#single-crop-box").css("top").replace(/[^0-9\-.,]/g, '').split(',');
      let width = $("#single-crop-box").css("width").replace(/[^0-9\-.,]/g, '').split(',');
      let height = $("#single-crop-box").css("height").replace(/[^0-9\-.,]/g, '').split(',');
      tnCanvas.width = Number(width[0]);
      tnCanvas.height = Number(height[0]);
      let x1 = Number(left[0]);
      let x2 = x1 + Number(width[0]);
      let y1 = Number(top[0]);
      let y2 = y1 + Number(height[0])
      let kw = this.img.width / this.canvasCoordinates.width;
      let kh = this.img.height / this.canvasCoordinates.height;
      let sw = x2 - x1;
      let sh = y2 - y1;
      tnCanvasContext.drawImage(this.img, (x1 * kw), (y1 * kh), (sw * kw), (sh * kh), 0, 0, Number(width[0]), Number(height[0]));
      // tnCanvasContext.drawImage(bufferCanvas,(Number(left[0]) ),(Number(top[0])), (Number(width[0]) * 2), (Number(height[0]) * 2), 0, 0, Number(width[0]), Number(height[0]));
      // if(Number(left[0]) === 0){
      //   tnCanvasContext.drawImage(bufferCanvas,(Number(left[0])),(Number(top[0]) + 100), (Number(width[0]) * 2), (Number(height[0]) * 2), 0, 0, Number(width[0]), Number(height[0]));
      // }
      // else if(Number(top[0]) === 0){
      //   tnCanvasContext.drawImage(bufferCanvas,(Number(left[0])  + 100),(Number(top[0])), (Number(width[0]) * 2), (Number(height[0]) * 2), 0, 0, Number(width[0]), Number(height[0]));
      // }
      // else if(Number(top[0]) === 0 && Number(left[0]) === 0){
      //   tnCanvasContext.drawImage(bufferCanvas,(Number(left[0])  ),(Number(top[0]) ), (Number(width[0]) * 2), (Number(height[0]) * 2), 0, 0, Number(width[0]), Number(height[0]));
      // }
      // else{
      //   tnCanvasContext.drawImage(bufferCanvas,(Number(left[0])  + 100),(Number(top[0]) + 100), (Number(width[0]) * 2), (Number(height[0]) * 2), 0, 0, Number(width[0]), Number(height[0]));
      // }

      // tnCanvasContext.drawImage(bufferCanvas,(Number(left[0]) ),(Number(top[0])), (Number(width[0]) * 2), (Number(height[0]) * 2), 0, 0, Number(width[0]), Number(height[0]));
      // tnCanvasContext.drawImage(this.img, this.cropBoxX, this.cropBoxY, this.cropBoxWidth, this.cropBoxHeight, 0, 0,this.cropBoxWidth, this.cropBoxHeight);
      let data = {
        "src": tnCanvas.toDataURL(),
        "name": this.options.name,
        "type": 'All'
      }
      base64Images.push(data);
      // base64Images.push(tnCanvas.toDataURL());
      // console.log("base64 Image",base64Images)
      // this.cropImages.emit(base64Images);
      return base64Images;
      // }
      // img.src = this.options.image;
      // console.log(tnCanvas);

    }
  }
  ImagePreview() {
    let images = this.cropImage();
    if (this.selectedTab && !this.isPlatformShow) {
      images["selectedImage"] = this.selectedTab;
    }

    this.previewImage.emit(images);
  }
  popUpClose() {
    let array = [];
    let data = {
      "src": this.options.image
    }
    array.push(data)
    this.cropImages.emit(array)
  }
  emitCropedImages() {
    let images = this.cropImage();
    if (this.selectedTab && !this.isPlatformShow) {
      for (let i = 0; i < images.length; i++) {
        if (this.selectedTab === images[i].type) {
          let array = [];
          array.push(images[i])
          this.cropImages.emit(array);
        }
      }

    }
    else {
      this.cropImages.emit(images);
    }

  }
}

