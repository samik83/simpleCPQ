import { LightningElement, track, api, wire } from "lwc";
import userAvatar from "@salesforce/resourceUrl/useravatar";
import fetchDefaultSearchResult from "@salesforce/apex/SearchController.fetchDefaultSearchResult";
import searchContent from "@salesforce/apex/SearchController.searchContent";
import getAuthorById from "@salesforce/apex/SearchController.getAuthorById";
import ContentViewer from "c/contentViewer";
import { RefreshEvent } from "lightning/refresh";
import { getRecord } from "lightning/uiRecordApi";
import getUserCommunities from "@salesforce/apex/KnowledgeController.getUserCommunities";
const FIELDS = ["Id"];

export default class Knowledgebase extends LightningElement {
  isLoading = false;
  searchPhrase;
  searchResultHeader;
  @track userAvatar = userAvatar;
  @track contentList = [];
  @track createdBy;
  @api objectApiName;
  @api recordId;
  @track userCommunities = [];
  @track communityMap = [];
  selectedCommunity = " (Showing Results from All Communities)";
  selectedCommunityId = "";
  shouldProcessWire = false;
  logourl = "/resource/community";
  @wire(getRecord, { fields: FIELDS, recordId: "$recordId" })
  wiredCaseRecord(result) {
    if (result.data && this.shouldProcessWire) {
      this.contentList = [];
      this.autoSearch();
    }
  }
  handleCommunityChange(event) {
    console.log(event.detail.value);
    const commMap = this.communityMap.find(
      (comm) => comm.id === event.detail.value
    );
    this.logourl = `/resource/${commMap.logo}`;
    this.selectedCommunity = ` (Showing Results from ${commMap.name})`;
    this.selectedCommunityId = commMap.id;
    this.manualSearch();
  }
  getCommunities() {
    this.isLoading = true;
    getUserCommunities()
      .then((data) => {
        this.userCommunities = Object.entries(data).map(([key, val]) => ({
          label: val.name,
          value: key
        }));
        this.communityMap = Object.entries(data).map(([key, val]) => ({
          id: val.Id,
          name: val.name,
          logo: val.logo
        }));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.isLoading = false;
        console.log("communities", JSON.stringify(this.communityMap));
      });
  }
  autoSearch() {
    this.searchResultHeader = "Suggested Contents";
    const defaultSearchParams = {
      objectApiName: this.objectApiName,
      recordId: this.recordId,
      community: this.selectedCommunityId
    };
    this.isLoading = true;
    fetchDefaultSearchResult({ searchParams: defaultSearchParams })
      .then((data) => {
        data.forEach((element) => {
          this.getUserDetails(element.CreatedById);

          this.contentList.push({
            Id: element.Id,
            Title: element.Title,
            LastPublishedDate: element.LastPublishedDate,
            Question__c: element.Question__c,
            CreatedById: element.CreatedById,
            hilightText: element.Heilight_Text__c,
            label: ""
          });
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
  connectedCallback() {
    this.shouldProcessWire = true;
    this.getCommunities();
  }
  handleSearchPhrase(event) {
    this.searchPhrase = event.target.value;
  }
  manualSearch() {
    this.searchResultHeader = "Search Results";
    this.isLoading = true;
    if (this.searchPhrase && this.searchPhrase.length > 0) {
      searchContent({
        searchPhrase: this.searchPhrase,
        community: this.selectedCommunityId
      })
        .then((data) => {
          this.contentList = [];
          if (data.length > 0) {
            data.forEach((element) => {
              this.getUserDetails(element.CreatedById);
              this.contentList.push({
                Id: element.Id,
                Title: element.Title,
                LastPublishedDate: element.LastPublishedDate,
                Question__c: element.Question__c,
                CreatedById: element.CreatedById,
                hilightText: element.Heilight_Text__c,
                label: ""
              });
            });
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.contentList = [];
      this.autoSearch();
    }
  }
  prfrmManualSearch(event) {
    const pressedKey = event.key;
    if (pressedKey === "Enter") {
      this.manualSearch();
    }
  }

  getUserDetails(userId) {
    getAuthorById({ userId: userId }).then((data) => {
      this.createdBy = data;
    });
  }

  async handleTitleClick(event) {
    result = await ContentViewer.open({
      contentId: event.target.dataset.contentid,
      content: event.target.dataset.content,
      recordId: this.recordId,
      objectApiName: this.objectApiName,
      size: "small", // Options: 'small', 'medium', 'large'
      description: "This is a description for accessibility.",
      createdBy: event.target.dataset.createdby,
      publishdate: event.target.dataset.publishdate,
      title: event.target.dataset.title
    });
  }
}
