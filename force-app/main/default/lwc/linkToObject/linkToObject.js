import { LightningElement, api, wire } from "lwc";
import linkToObject from "@salesforce/apex/UserAction.linkToObject";
import unlinkContent from "@salesforce/apex/UserAction.unlinkContent";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import link_success from "@salesforce/label/c.IB_En_LinkedToObject_Success";
import link_error from "@salesforce/label/c.IB_En_LinkedToObject_Error";
import unlink_success from "@salesforce/label/c.IB_En_UnLinkedToObject_Success";
import unlink_error from "@salesforce/label/c.IB_En_UnLinkedToObject_Error";
import checkAlreadyLinked from "@salesforce/apex/UserAction.checkLinked";
import insightbase from "@salesforce/messageChannel/insightbase__c";
import {
  subscribe,
  unsubscribe,
  publish,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";

export default class LinkToObject extends LightningElement {
  @api recordId;
  @api contentId;
  @api objectName;
  paramMap;
  isLinked = false;
  isLoading = false;
  subscription;
  label = {
    link_success,
    link_error,
    unlink_success,
    unlink_error
  };
  @wire(MessageContext)
  messageContext;

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        insightbase,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }
  handleMessage(message) {
    const recordId = message.recordId;
    const objName = message.objName;
    const contentId = message.contentId;
    const action = message.action;
    console.log("message => ", message);
    if (
      recordId == this.recordId &&
      objName == this.objectName &&
      contentId == this.contentId
    ) {
      if (action == "content_linked_success") {
        this.isLinked = true;
      } else if (action == "content_unlinked_success") {
        this.isLinked = false;
      }
    }
  }
  connectedCallback() {
    this.checkLinked();
    this.subscribeToMessageChannel();
  }
  disconnectedCallback() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
  checkLinked() {
    this.isLoading = true;
    this.paramMap = {
      recordId: this.recordId,
      contentId: this.contentId,
      objectName: this.objectName
    };

    checkAlreadyLinked({ paramMap: this.paramMap })
      .then((data) => {
        this.isLinked = data;
      })
      .catch((error) => {
        this.showToast("Error", "Error loading linked content", "error");
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
  handleLinkToObject() {
    this.isLoading = true;
    this.paramMap = {
      recordId: this.recordId,
      contentId: this.contentId,
      objectName: this.objectName
    };
    linkToObject({ paramMap: this.paramMap })
      .then((data) => {
        if (data == "content_linked_success") {
          this.isLinked = true;
          const payload = {
            recordId: this.recordId,
            objName: this.objectName,
            contentId: this.contentId,
            action: data
          };
          publish(this.messageContext, insightbase, payload);
          this.showToast(
            "Success",
            `${this.label.link_success} Message: ${data}`,
            "success"
          );
        }
      })
      .catch((error) => {
        this.showToast(
          "Error",
          `${this.label.link_error} Error Message: ${error.body.message}`,
          "error"
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
  handleUnlink() {
    this.isLoading = true;
    this.paramMap = {
      recordId: this.recordId,
      contentId: this.contentId,
      objectName: this.objectName
    };
    unlinkContent({ paramMap: this.paramMap })
      .then((data) => {
        this.isLinked = false;
        const payload = {
          recordId: this.recordId,
          objName: this.objectName,
          contentId: this.contentId,
          action: data
        };
        publish(this.messageContext, insightbase, payload);
        this.showToast(
          "Success",
          `${this.label.unlink_success} Message: ${data}`,
          "success"
        );
      })
      .catch((error) => {
        this.showToast(
          "Error",
          `${this.label.unlink_error} Error Message: ${error.body.message}`,
          "error"
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  showToast(sub, msg, varnt) {
    const event = new ShowToastEvent({
      title: sub,
      message: msg,
      variant: varnt
    });
    this.dispatchEvent(event);
  }
}
