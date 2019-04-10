import {
  Component,
  OnInit,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild
} from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { CampaignStatusEnum } from "./model/status.model";
import { MatDialog } from "@angular/material";
import * as _ from "lodash";
import { UUID } from "angular2-uuid";
import { ImageTaggingComponent } from "./image-tagging/image-tagging.component";
import { CampaignViewModel } from "../../models/campaignViewModel";
import { ValidationModel } from "./model/validationModel";
import { MediaFileAssetViewModel } from "../../models/mediaFileAssetViewModel";
import { Router } from "@angular/router";
import { MediaAssetConversionUtil } from "./../../../../shared/mediaAssetUtil/mediaAssetConversionUtil";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserProfile } from "src/app/store/user-profile";
// import { ElementDef } from '@angular/core/src/view';
let errors = require("./message.json");

@Component({
  selector: "campaign-definition",
  templateUrl: "./campaign-definition.component.html",
  styleUrls: ["./campaign-definition.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCampaignComponent implements OnInit {
  @ViewChild("visualization") visualization: ElementRef;
  @ViewChild("imageSelector") imageSelector: ElementRef;
  @ViewChild("videoSelector") videoSelector: ElementRef;
  @Input() selectedSocialNetwork$: Observable<Array<any>>;
  @Output() onRemoveMediaFile: EventEmitter<object> = new EventEmitter();
  @Output() onAddMediaFile: EventEmitter<any> = new EventEmitter();
  @Output() onThumbnailAdd: EventEmitter<any> = new EventEmitter();
  @Output() onCropImage: EventEmitter<any> = new EventEmitter();
  @Output() onAddOrRemoveTags: EventEmitter<any> = new EventEmitter();
  @Output() onChangeDescription: EventEmitter<string> = new EventEmitter();
  @Output() onCampaignSave: EventEmitter<object> = new EventEmitter();
  @Input() campaign$: Observable<CampaignViewModel>;
  @Output() onCancelCampaign: EventEmitter<any> = new EventEmitter();
  campaignForm: FormGroup;
  mediaFilesToShow$: BehaviorSubject<Array<MediaFileAssetViewModel>>;
  imageForCropper$: BehaviorSubject<any>;
  createButtonState: string = "Save as draft";
  createCampaignStates: Array<string> = [
    "Save as draft",
    "Post Now",
    "Schedule",
    "Add To Queue"
  ];
  validationModel: ValidationModel;
  errors = require("../../../../shared/config/specificError.json")
    .specificError;
  groupRights = require("../../../../shared/config/group-rights.json")
    .groupRights;

  campaignViewModel: CampaignViewModel;
  dropActive: boolean = false;
  imagePath: string = "";
  formFieldsError$: BehaviorSubject<string>;
  icons: object = {};

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public route: Router,
    public mediaAssetUtil: MediaAssetConversionUtil,
    public profileStore: UserProfile
  ) {
    this.validationModel = new ValidationModel();
    this.campaignViewModel = new CampaignViewModel();
    this.mediaFilesToShow$ = new BehaviorSubject(
      this.campaignViewModel.mediaFiles
    );
    this.formFieldsError$ = new BehaviorSubject("");
  }

  ngOnInit() {
    this.errors = require("./message.json").errors;
    this.icons = require("./../../../../shared/config/icons.json").icons;
    this.imagePath = require("./../../../../shared/config/urls.json").IMAGE_DOWNLOAD_END_POINT_URL;

    if (this.campaign$) {
      this.campaign$.subscribe(res => {
        if (res) {
          console.log("createacampaign", res);
          this.fillCampaignForm(res);
        } else {
          this.emptyForm();
        }
      });
    }

    this.imageForCropper$ = new BehaviorSubject(null);
    this.campaignViewModel.currentDate = new Date();
    // this.campaignFormValidate();
  }

  //   campaignFormValidate = () =>{
  //     this.campaignForm = this.formBuilder.group({
  //       // email: ['', Validators.compose([Validators.required, Validators.pattern("[a-z0-9.]+@[a-z$]+\.[a-z]{2,3}$")])],
  //       title:  ['', Validators.required]
  //       // lastName:  ['', Validators.required],

  //     })
  // }

  changeDescription() {
    // this.campaignViewModel.description.toLowerCase().replace(/ {1,}/g," ").trim()
    // this.campaignViewModel.description = this.campaignViewModel.description.trim();
    this.campaignViewModel.description.trim();
    this.onChangeDescription.emit(this.campaignViewModel.description);
  }
  // setCampaignStatus(status: CampaignStatus) {
  //   this.campaignViewModel.campaignStatuses = status;
  //   console.log(status);
  // }
  // setCampaignStatusNone(status) {
  //   this.campaignViewModel.campaignStatuses.status='';
  // }
  convertToFiles(tempFilesToConvert) {
    let convertedFiles: Array<File> = [];
    tempFilesToConvert.forEach(file => {
      let cFile = { name: "", src: "", type: "" };
      cFile.src = this.imagePath + file.name;
      cFile.name = file.originalFilename;
      cFile.type = file.type;
      this.mediaAssetUtil.base64ToFile(cFile).then(file => {
        this.fileRead([file]);
      });
    });
  }

  fillCampaignForm(inputCampaignViewmodel) {
    this.emptyForm();

    let tempCampaign: CampaignViewModel = Object.assign(
      {},
      inputCampaignViewmodel
    );
    this.campaignViewModel.title = tempCampaign.title;
    this.campaignViewModel.description = tempCampaign.description;
    this.campaignViewModel.scheduledAt =
      tempCampaign.state != "Posted"
        ? new Date(tempCampaign.scheduledAt)
        : new Date();
    this.campaignViewModel.mediaFiles = [...tempCampaign.mediaFiles];
    this.mediaFilesToShow$.next(this.campaignViewModel.mediaFiles);

    this.createButtonState =
      tempCampaign.state == "Posted" || tempCampaign.state == "Draft"
        ? "Save as draft"
        : tempCampaign.state == "Scheduled"
        ? "Schedule"
        : "Save as draft";
  }

  isTitleChanged(event) {
    this.validationModel.isTitle = true;
  }

  isDescriptionChanged(event) {
    this.validationModel.isDescription = true;
  }

  redirect() {
    this.route.navigateByUrl("campaign/campaign-list");
  }
  onCancel() {
    let VALID = {};
    this.campaign$.subscribe((res: any) => {
      console.log(res);
      VALID = res;
    });

    if (VALID) {
      this.redirect();
    } else {
      this.emptyForm();
      this.onCancelCampaign.emit(true);
    }
  }
  emptyForm() {
    this.campaignViewModel = new CampaignViewModel();
    this.mediaFilesToShow$.next(this.campaignViewModel.mediaFiles);
    this.validationModel.isTitle = false;
    this.validationModel.isDescription = false;
  }

  deleteFile = file => {
    this.onRemoveMediaFile.emit(file);
    let foundIndex = this.campaignViewModel.mediaFiles.findIndex(
      x => x.name == file.name
    );
    if (foundIndex > -1) {
      this.campaignViewModel.mediaFiles.splice(foundIndex, 1);
    }
  };

  errorForForm(errorMessage: string): void {
    this.formFieldsError$.next(errorMessage);
    setTimeout(
      function() {
        this.formFieldsError$.next("");
      }.bind(this),
      4000
    );
  }

  dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  }
  dragover(e) {
    e.stopPropagation();
    e.preventDefault();
    this.dropActive = true;
  }

  //
  drop(e) {
    e.stopPropagation();
    e.preventDefault();
    this.dropActive = false;
    var dt = e.dataTransfer;
    var files = dt.files;
    console.log(dt);
    this.callingFunctionFilesToRead(files);
  }

  callingFunctionFilesToRead(event) {
    if (event.target) {
      this.fileRead(event.target.files);
    } else {
      this.fileRead(event);
    }
  }

  fileRead(files) {
    let totalMediaFiles =
      this.campaignViewModel.mediaFiles.length + files.length;
    if (
      this.campaignViewModel.mediaFiles.length > 5 ||
      files.lenght > 5 ||
      totalMediaFiles > 5
    ) {
      this.errorForForm(errors.errors.mediaFilesMaxError);
    } else {
      if (files.length <= 5) {
        for (let i = 0; i < files.length; i++) {
          Object.defineProperty(files[i], "name", {
            writable: true,
            value: UUID.UUID() + files[i].name
          });
          const reader = new FileReader();
          let newFile: MediaFileAssetViewModel = new MediaFileAssetViewModel();
          newFile.name = files[i].name;
          newFile.base64File.name = files[i].name;
          this.mediaAssetUtil
            .fileToBase64(files[i])
            .then(res => {
              newFile.base64File.src = res;
              newFile.base64File.type = files[i].type;
              newFile.file = files[i];
              newFile.type = files[i].type;
              this.campaignViewModel.mediaFiles.push(newFile);
              this.mediaFilesToShow$.next(this.campaignViewModel.mediaFiles);
              this.onAddMediaFile.emit(newFile);

              if (i == files.length - 1) {
                this.imageSelector.nativeElement.value = "";
                this.videoSelector.nativeElement.value = "";
              }
            })
            .catch(error => console.log(error));
        }
      }
    }
  }
  setCreateButtonState(state) {
    this.createButtonState = state;
    this.createCampaignValidation();
  }

  openImageCropperPopup(img) {
    this.imageForCropper$.next(img);
  }

  setThumbnailArray(thumbnail) {
    this.campaignViewModel.mediaFiles.forEach(viewFile => {
      if (
        viewFile.base64File.name.substr(
          0,
          viewFile.base64File.name.lastIndexOf(".")
        ) ==
          thumbnail.file.name.substr(0, thumbnail.file.name.lastIndexOf(".")) &&
        !viewFile.thumbnailFile
      ) {
        viewFile.thumbnailFile = thumbnail;
        this.onThumbnailAdd.emit(viewFile);
      }
    });
  }

  getbase64CroppedImage(b64Data) {
    this.onCropImage.emit(b64Data);
    this.imageForCropper$.next(null);
  }

  campaignTypeWRTSelectedArtifacts() {
    let allowToCrreateCampaignWithoutImage = false;
    this.selectedSocialNetwork$.subscribe((res: any) => {
      // res.forEach(artifact => {
      if (res.type == "PI") {
        allowToCrreateCampaignWithoutImage = true;
      }
      // })
    });
    if (
      allowToCrreateCampaignWithoutImage &&
      this.campaignViewModel.mediaFiles.length == 0
    ) {
      allowToCrreateCampaignWithoutImage = false;
    } else {
      allowToCrreateCampaignWithoutImage = true;
    }
    return allowToCrreateCampaignWithoutImage;
  }

  checkIfPageSelected() {
    let pageExist = false;
    let VALID = [];
    this.selectedSocialNetwork$.subscribe((res: any) => {
      console.log(res);
      VALID = res;
    });
    if (VALID.length >= 1) {
      if (this.campaignTypeWRTSelectedArtifacts() == true) {
        pageExist = true;
      } else {
        pageExist = false;
        this.errorForForm(errors.errors.mediaFilesPintrestError);
      }
    } else {
      this.errorForForm(errors.errors.mediaFilesForScheduleError);
      pageExist = false;
    }
    return pageExist;
  }

  checkScheduleValidation() {
    if (this.createButtonState == "Schedule") {
      if (
        this.campaignViewModel.scheduledAt < new Date() ||
        !this.campaignViewModel.scheduledAt
      ) {
        this.errorForForm(errors.errors.mediaFilesForDateTime);
      } else {
        if (this.checkIfPageSelected() == true) {
          this.emitCampaign();
        }
      }
    } else if (this.createButtonState == "Post Now") {
      this.campaignViewModel.scheduledAt = new Date();
      this.campaignViewModel.scheduledAt.setMinutes(
        this.campaignViewModel.scheduledAt.getMinutes() + 1
      );
      if (this.checkIfPageSelected() == true) {
        this.emitCampaign();
      }
    } else if (this.createButtonState == "Add To Queue") {
      if (this.checkIfPageSelected() == true) {
        this.emitCampaign();
      }
    } else {
      this.emitCampaign();
    }
  }

  emitCampaign() {
    (this.campaignViewModel.state =
      this.createButtonState == "Save as draft"
        ? CampaignStatusEnum.draft
        : this.createButtonState == "Schedule"
        ? CampaignStatusEnum.scheduled
        : this.createButtonState == "Add To Queue"
        ? CampaignStatusEnum.addToQueue
        : this.createButtonState == "Post Now"
        ? CampaignStatusEnum.postNow
        : CampaignStatusEnum.draft),
      (this.campaignViewModel.createdAt = new Date()),
      this.onCampaignSave.emit(this.campaignViewModel);
  }
  createCampaignValidation() {
    this.campaignViewModel.title = this.campaignViewModel.title.trim();
    this.campaignViewModel.description = this.campaignViewModel.description.trim();
    if (
      this.campaignViewModel.title == "" ||
      this.campaignViewModel.description == ""
    ) {
      if (this.campaignViewModel.title == "") {
        this.validationModel.isTitle = true;
      } else {
        this.validationModel.isDescription = true;
      }
    } else if (
      this.createButtonState == "Schedule" ||
      "Post Now" ||
      "Add To Queue"
    ) {
      this.checkScheduleValidation();
    } else {
      this.emitCampaign();
    }
  }
  imageTaggingPopup(img, index) {
    const dialogRef = this.dialog.open(ImageTaggingComponent, {
      width: "500px",
      data: {
        img: img,
        files: this.campaignViewModel.mediaFiles[index],
        imgIndex: index
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("image tags", result);
      if (this.campaignViewModel.mediaFiles.length >= 1 && result) {
        this.campaignViewModel.mediaFiles[index].tags = result.tags;
      }
      if (result) {
        this.campaignViewModel.mediaFiles[index].base64File.tags = result.tags;
        // if (this.campaignViewModel.mediaFiles[index].file) {
        //   this.campaignViewModel.mediaFiles[index].file.tags = result.tags;
        // }
        this.mediaFilesToShow$.next(this.campaignViewModel.mediaFiles);
      }
      if (this.campaign$ && result) {
        this.processImageTags(this.campaignViewModel.mediaFiles[index]);
      }
      console.log("image after tags", this.campaignViewModel.mediaFiles[index]);
    });
  }

  processImageTags(imageWithEditedTags) {
    this.onAddOrRemoveTags.emit(imageWithEditedTags);
  }

  // changeCropBox(value) {
  //   console.log(value)
  //   if (value === false) {
  //     this.isChecked = true;

  //     console.log("check box value", this.isChecked)
  //   }
  //   else {
  //     this.isChecked = false;
  //     console.log("check box value", this.isChecked)
  //   }

  // }
  // playSelectedFile = (files) => {
  //   let file = files[0]
  //   let type = file.type

  //   let fileURL = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
  //   let obj = {
  //     "src": fileURL,
  //     "videoType": type
  //   }
  //   return obj;
  //   // videoNode.src = fileURL
  // }

  // base64toImage(b64Data) {

  //   // if (b64Data.type != 'All') {
  //   const base64Data = b64Data.src;
  //   let cFile: File;
  //   fetch(base64Data)
  //     .then(res => res.blob())
  //     .then(blob => {

  //       let convertedFile = new File([blob], b64Data.name, { type: 'image/png' });

  //       // let croppedImageObj: FileToUploadModel = {
  //       //   networkType: b64Data.type,
  //       //   file: convertedFile
  //       // }
  //       // this.croppedImagesToUpload.push(croppedImageObj);
  //       // this.emitCroppedImages.emit(this.croppedImagesToUpload);

  //     })

  //   // }
  // }

  // openDailogBox(i) {
  //   // this.cropImageIndex = i;
  //   this.croppedImages["index"] = i;
  //   if (this.croppedImages.length) {
  //     const dialogRef = this.dialog.open(CroppedImagePopupComponent, {
  //       maxWidth: "500px",
  //       maxHeight: "500px",
  //       data: this.croppedImages
  //     });
  //     dialogRef.afterClosed().subscribe(result => {
  //       // this.onForget.emit(result);

  //       console.log(result);
  //     });
  //   }

  // }

  // getCroppedImage(event) {
  //   // for(let i =0; i < this.campaignViewModel.base64FilesToShow.length;i++){
  //   //   if(this.cropImageIndex === i){
  //   //     this.campaignViewModel.base64FilesToShow[i].src = event[0].src;
  //   //   }
  //   // }
  // }

  // deleteLocalFiles(file) {

  // let index = this.base64FilesToShow.findIndex(x => x.name == file.name);

  // this.base64FilesToShow.splice(index, 1);
  // this.base64FilesToShow$.next(this.base64FilesToShow);

  // var thumbnailNameToDelete = file.name.substr(0, file.name.lastIndexOf('.'));

  // let deleteThumbnailIndex = this.thumbnailArray.findIndex(x => x.name.substr(0, x.name.lastIndexOf('.')) == thumbnailNameToDelete);
  // this.thumbnailArray.splice(deleteThumbnailIndex, 1);
  // console.log(this.thumbnailArray);
  // // remove from file to upload array
  // let fileToUploadIndex = this.campaignViewModel.filesToUpload.findIndex(x => x.name == file.name);
  // if (fileToUploadIndex > -1) {
  //   this.campaignViewModel.filesToUpload.splice(fileToUploadIndex, 1);
  // }

  // }

  // openImageCropperPopup(img, i) {
  //   if (this.selectedSocialNetwork$._value.length > 0) {
  //     this.cropOption = {
  //       name: img.name,
  //       image: img.src,
  //       minWidth: 200,
  //       minHeight: 300,
  //       width: 500,
  //       height: 500,
  //       x: 100,
  //       y: 500,
  //       aspectRatio: 1 / 1,
  //       isChecked: this.isChecked,
  //       bounds: {
  //         width: '100%',
  //         height: '50%'
  //       },
  //       platform: this.selectedSocialNetwork$._value
  //     }
  //     this.openDialog();
  //   }

  // }

  // openDialog = () => {
  //   console.log(this.cropOption);
  //   const dialogRef = this.dialog.open(PopUpComponent, {
  //     width: '600',
  //     height: '600',
  //     panelClass: 'custom-dialog-container',
  //     data: this.cropOption
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     let self = this;
  //     for (let i = 0; i < result.length; i++) {
  //       if (result[i].type) {
  //         self.getbase64CroppedImage(result[i]);
  //         // if (self.croppedImages.length > 0) {
  //         //   result["imageIndex"] = self.cropImageIndex;
  //         //   let array = [];
  //         //   array = self.croppedImages;
  //         //   self.croppedImages = [];
  //         //   self.croppedImages$.next(self.croppedImages);
  //         //   let data = [{
  //         //     "imageIndex": self.cropImageIndex,
  //         //     "images": result[i]
  //         //   }]
  //         //   self.croppedImages = array.concat(data);
  //         //   self.croppedImages$.next(self.croppedImages);
  //         // } else {
  //         //   let data = [{
  //         //     "imageIndex": self.cropImageIndex,
  //         //     "images": result[i]
  //         //   }]
  //         //   // result["imageIndex"] = self.cropImageIndex;
  //         //   self.croppedImages = data;
  //         //   self.croppedImages$.next(self.croppedImages);
  //         // }
  //         // let isPlatformExist = _.map(result, function (p, i) {
  //         //   // if(result[i].type){

  //         //   console.log("cropped images", self.croppedImages)
  //         //   let isCroppedImage = _.map(self.campaignViewModel.mediaFiles, function (i, index) {
  //         //     console.log("cropped image index", index)
  //         //     if (index === self.cropImageIndex) {
  //         //       self.campaignViewModel.mediaFiles[index].base64File.isImageCropped = true;
  //         //       // self.base64FilesToShow$.next(self.base64FilesToShow);
  //         //       self.mediaFilesToShow$.next(self.campaignViewModel.mediaFiles);

  //         //     }
  //         //   })
  //         //   // }
  //         // })
  //       }
  //     }

  //     // if (this.campaignViewModel.base64FilesToShow.length > 0) {
  //     //   let array = [];
  //     //   array = this.campaignViewModel.base64FilesToShow;
  //     //   this.campaignViewModel.base64FilesToShow = [];
  //     //   this.campaignViewModel.base64FilesToShow = array.concat(result);
  //     // } else {

  //     //   this.campaignViewModel.base64FilesToShow = result;
  //     // }
  //     // console.log("crop image result", result);
  //   });

  // }
}
