public with sharing class CommentServices {
  @AuraEnabled
  public static void addComment(Map<String, String> params) {
    try {
      List<Knowledge_Comment__c> commentList = new List<Knowledge_Comment__c>();
      Knowledge_Comment__c commentToAdd = new Knowledge_Comment__c();
      commentToAdd.Comment__c = params.get('body');
      commentToAdd.Knowledge__c = params.get('contentId');
      commentToAdd.date_created__c = Datetime.now();
      if (!String.isBlank(params.get('replyTo'))) {
        commentToAdd.Knowledge_Comment__c = params.get('replyTo');
      }
      commentList.add(commentToAdd);
      insert commentList;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<Knowledge_Comment__c> getAllComments(String contentId) {
    try {
      List<Knowledge_Comment__c> comments = [
        SELECT
          Id,
          Name,
          Comment__c,
          CreatedById,
          Knowledge__c,
          Knowledge_Comment__c,
          date_created__c
        FROM Knowledge_Comment__c
        WHERE Knowledge__c = :contentId
        LIMIT 50
      ];
      return comments;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
