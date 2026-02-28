public with sharing class SearchService {
  public String searchFields { get; set; }
  public String ObjName { get; set; }
  public SearchService(Map<String, String> inputParams) {
    this.searchFields = inputParams.get('sf');
    this.ObjName = inputParams.get('ObjName');
  }
  public void run() {
    system.debug(searchFields);
  }

  public List<Default_Search_Settings__mdt> getDefaultSearchMeta() {
  }
}
