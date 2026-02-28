public with sharing class ObjectDataUtils {
  public List<sObject> getObjectData(Map<String, Object> paramList) {
    List<sObject> recordDetails = new List<sObject>();
    Map<String, String> concatedFields = concatListToString(
      (List<String>) paramList.get('fldList')
    );
    if (concatedFields.get('status') == 'success') {
      String queryString =
        'SELECT ' +
        concatedFields.get('data') +
        ' FROM ' +
        (String) paramList.get('objName') +
        ' WHERE ' +
        (String) paramList.get('conditionExp');
      system.debug('Query String => ' + queryString);
      recordDetails = Database.query(queryString);
    }
    return recordDetails;
  }

  public Map<String, String> concatListToString(List<String> fldList) {
    Map<String, String> retVar = new Map<String, String>();
    if (fldList.size() > 0) {
      retVar.put('status', 'success');
      retVar.put('data', String.join(fldList, ','));
    } else {
      retVar.put('status', 'error');
      retVar.put('data', '');
    }
    return retVar;
  }

  public String getDefaultSearchPhrase(Map<String, Object> searchParams) {
    String objName = String.valueOf(searchParams.get('objectApiName'));
    String recId = String.valueOf(searchParams.get('recordId'));
    MetadataService mData = new MetadataService();
    List<Default_Search_Settings__mdt> mDataDetails = mData.getDefaultSearchSettings(
      objName
    );
    String searchField = mDataDetails[0].Search_Query__c;
    string query =
      'select ' +
      searchField +
      ' from ' +
      objName +
      ' where id=:recId';
    List<sObject> result = Database.query(query);
    return (String) result[0].get(searchField);
  }
}
