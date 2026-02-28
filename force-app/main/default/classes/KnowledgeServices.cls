public with sharing class KnowledgeServices {
  public Map<String, Object> getUserCommunities() {
    try {
      Map<String, Object> communities = new Map<String, Object>();
      KnowledgeUtils KUtils = new KnowledgeUtils();
      List<Knowledge_Community__c> response = KUtils.getAllCommunities();
      for (Knowledge_Community__c comm : response) {
        Map<String, String> commDetails = new Map<String, String>();
        commDetails.put('Id', comm.Id);
        commDetails.put('name', comm.name);
        commDetails.put('logo', comm.Logo__c);
        communities.put(comm.Id, commDetails);
      }
      return communities;
    } catch (AuraHandledException e) {
      throw e;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
