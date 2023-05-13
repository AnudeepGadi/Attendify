
export const handler =  function(event, context, callback) {
    
    let statusCode = event['requestContext']['authorizer']['claims']['cognito:groups'] === "AttendifyAdmin"
    let principalId = event['requestContext']['authorizer']['claims']['sub']
    
    if (statusCode)
        callback(null, generatePolicy(principalId, 'Allow', event.methodArn));
    else
        callback(null, generatePolicy(principalId, 'Deny', event.methodArn));
    
    //callback("Unauthorized");   // Return a 401 Unauthorized response
    
};

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource) {
    var authResponse = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    return authResponse;
}