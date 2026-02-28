public with sharing class UserAction {
  @AuraEnabled
  public static String linkToObject(Map<String, String> paramMap) {
    String recordId = paramMap.get('recordId');
    String contentId = paramMap.get('contentId');
    String objectName = paramMap.get('objectName');

    Linked_Content__c linkedContent = new Linked_Content__c(
      Content_ID__c = contentId,
      Object_ID__c = recordId,
      Object_Name__c = objectName
    );
    List<Linked_Content__c> linkedContentList = new List<Linked_Content__c>();
    linkedContentList.add(linkedContent);
    try {
      insert linkedContentList;
      return 'content_linked_success';
    } catch (DmlException e) {
      throw new AuraHandledException(e.getMessage());
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static string unlinkContent(Map<String, String> paramMap) {
    String recordId = paramMap.get('recordId');
    String objectName = paramMap.get('objectName');
    String contentId = paramMap.get('contentId');
    List<Linked_Content__c> lc = [
      SELECT id
      FROM Linked_Content__c
      WHERE
        Object_ID__c = :recordId
        AND Object_Name__c = :objectName
        AND Content_ID__c = :contentId
    ];
    try {
      delete lc;
      return 'content_unlinked_success';
    } catch (DmlException e) {
      throw new AuraHandledException(e.getMessage());
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Boolean checkLinked(Map<String, String> paramMap) {
    String recordId = paramMap.get('recordId');
    String objectName = paramMap.get('objectName');
    String contentId = paramMap.get('contentId');
    try {
      List<Linked_Content__c> lc = [
        SELECT id
        FROM Linked_Content__c
        WHERE
          Object_ID__c = :recordId
          AND Object_Name__c = :objectName
          AND Content_ID__c = :contentId
      ];
      if (lc.size() > 0) {
        return true;
      } else {
        return false;
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
