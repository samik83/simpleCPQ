import { api, track, wire } from "lwc";
import LightningModal from "lightning/modal";
import userAvatar from "@salesforce/resourceUrl/useravatar";
import getAuthorById from "@salesforce/apex/SearchController.getAuthorById";
import addComment from "@salesforce/apex/CommentServices.addComment";
import getAllComments from "@salesforce/apex/CommentServices.getAllComments";
import { refreshApex } from "@salesforce/apex";

export default class ContentViewer extends LightningModal {
  @api contentId;
  @api content;
  @api objectApiName;
  @api recordId;
  @track userAvatar = userAvatar;
  @api createdBy;
  @api publishdate;
  @track addComment;
  authorName;
  wiredComments;
  comments;
  commentLength;
  @api title;

  @wire(getAllComments, { contentId: "$contentId" }) comments(result) {
    this.wiredComments = result;
    if (result.data) {
      this.comments = result.data;
      this.commentLength = result.data.length;
    } else if (result.error) {
      console.log(result.error);
    }
  }
  handleClose() {
    this.close("cancel");
  }
  getUserDetails(userId) {
    getAuthorById({ userId: userId }).then((data) => {
      this.authorName = data;
    });
  }
  connectedCallback() {
    console.log("contentId => ", this.contentId);
    console.log("objectApiName => ", this.objectApiName);
    console.log("recordId => ", this.recordId);
    this.getUserDetails(this.createdBy);
  }
  handleAddCommentBox() {
    const commentBox = this.template.querySelector(".commentBox");
    if (commentBox && commentBox.style.display == "none") {
      commentBox.style.display = "block";
      this.template.querySelector(".commentText").focus();
    } else {
      commentBox.style.display = "none";
    }
  }
  storeComment(event) {
    this.addComment = event.target.value;
  }
  postComment() {
    let contentParams = {
      body: this.addComment,
      contentId: this.contentId,
      replyTo: ""
    };
    addComment({
      params: contentParams
    })
      .then(() => {
        refreshApex(this.wiredComments);
        this.handleAddCommentBox();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        const comments = this.template.querySelector(".commentContainer");
        const latestComment = comments ? comments.lastElementChild : null;
        if (latestComment) {
          latestComment.focus();
        }
      });
  }
}
