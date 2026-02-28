public with sharing class KnowledgeController {
  @AuraEnabled
  public static Map<String, Object> getUserCommunities() {
    KnowledgeServices kService = new KnowledgeServices();
    return kService.getUserCommunities();
  }
}
