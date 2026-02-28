public with sharing class KnowledgeUtils {
  public List<Knowledge_Community__c> getAllCommunities() {
    List<Knowledge_Community__c> comm = [
      SELECT id, name, Logo__c
      FROM Knowledge_Community__c
      WITH USER_MODE
    ];

    system.debug(comm);
    return comm;
  }
}
