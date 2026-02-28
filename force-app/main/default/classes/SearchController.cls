public with sharing class SearchController {
  @AuraEnabled
  public static List<Knowledge__kav> fetchDefaultSearchResult(
    Map<String, Object> searchParams
  ) {
    try {
      ObjectDataUtils objUtils = new ObjectDataUtils();
      String searchPhrase = objUtils.getDefaultSearchPhrase(searchParams);

      Map<String, Object> paramList = new Map<String, Object>();
      List<String> fldList = new List<String>{
        'Id',
        'Title',
        'CreatedById',
        'LastPublishedDate',
        'Question__c',
        'Heilight_Text__c'
      };
      paramList.put('fldList', fldList);
      paramList.put('objName', 'Knowledge__kav');
      if (
        searchParams.containsKey('community') &&
        String.valueOf(searchParams.get('community')).length() > 0
      ) {
        paramList.put(
          'conditionExp',
          'PublishStatus=\'Online\' AND Title LIKE \'%' +
            searchPhrase +
            '%\' AND Knowledge_Community__c = \'' +
            searchParams.get('community') +
            '\''
        );
      } else {
        paramList.put(
          'conditionExp',
          'PublishStatus=\'Online\' AND Title LIKE \'%' + searchPhrase + '%\''
        );
      }

      List<sObject> knowledgeSet = objUtils.getObjectData(paramList);
      return knowledgeSet;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled
  public static List<Knowledge__kav> searchContent(
    String searchPhrase,
    Object community
  ) {
    try {
      Map<String, Object> paramList = new Map<String, Object>();
      List<String> fldList = new List<String>{
        'Id',
        'Title',
        'CreatedById',
        'LastPublishedDate',
        'Question__c',
        'Heilight_Text__c'
      };
      paramList.put('fldList', fldList);
      paramList.put('objName', 'Knowledge__kav');
      if (String.valueOf(community).length() > 0) {
        paramList.put(
          'conditionExp',
          'PublishStatus=\'Online\' AND Title LIKE \'%' +
            searchPhrase +
            '%\' AND Knowledge_Community__c = \'' +
            community +
            '\''
        );
      } else {
        paramList.put(
          'conditionExp',
          'PublishStatus=\'Online\' AND Title LIKE \'%' + searchPhrase + '%\''
        );
      }

      ObjectDataUtils objUtils = new ObjectDataUtils();
      List<sObject> knowledgeSet = objUtils.getObjectData(paramList);
      return knowledgeSet;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled
  public static string getAuthorById(String userId) {
    try {
      Map<String, Object> paramList = new Map<String, Object>();
      List<String> fldList = new List<String>{ 'Id', 'Name' };
      paramList.put('fldList', fldList);
      paramList.put('objName', 'User');
      paramList.put('conditionExp', 'Id=\'' + userId + '\'');
      ObjectDataUtils objUtils = new ObjectDataUtils();
      List<sObject> authorDetails = objUtils.getObjectData(paramList);
      return (String) authorDetails[0].get('Name');
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
