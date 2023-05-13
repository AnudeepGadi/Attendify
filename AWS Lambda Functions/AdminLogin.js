import db_methods from '/opt/nodejs/db.mjs';

export const handler = async (event, context) => {
  const db = db_methods() 
  try {
    let isAdmin = event['requestContext']['authorizer']['claims']['cognito:groups'] === "AttendifyAdmin"
    
    if (!isAdmin)
      return {statusCode:403,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS"
        }
      }
    
    const username = event['requestContext']['authorizer']['claims']['cognito:username'];
    
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        body: JSON.stringify({
          name : event['requestContext']['authorizer']['claims']['name'] || ""
        })
    };
    return response;
  } finally {
    
  }
};