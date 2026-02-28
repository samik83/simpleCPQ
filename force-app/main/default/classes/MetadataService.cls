public with sharing class MetadataService {
  public List<Default_Search_Settings__mdt> getDefaultSearchSettings(
    String objectName
  ) {
    return [
      SELECT
        Search_Query__c,
        Knowledge_Fields_To_Retrieve__c,
        Condition_Expression__c,
        Community_Condition_Expression__c
      FROM Default_Search_Settings__mdt
      WHERE Object__c = :objectName
    ];
  }

  public List<InsightBase_User_Actions__mdt> getUserActions() {
    return [
      SELECT
        DeveloperName,
        MasterLabel,
        Action_Order__c,
        Action_Type__c,
        Method_Name__c,
        Service_Class__c
      FROM InsightBase_User_Actions__mdt
      LIMIT 100
    ];
  }
}
