import AWS from "aws-sdk";
interface IExpression {
    UpdateExpression: String;
    ExpressionAttributeNames: Object;
    ExpressionAttributeValues: Object;
}
export const getDynamoExpression = (obj: any, key: String = ""): IExpression => {

    const keys: string[] = Object.keys(obj);

    let UpdateExpression = '';
    let ExpressionAttributeValues = {};
    let ExpressionAttributeNames = {};
    let UpdateExpressions = []
    let expressions: IExpression;
    for (let i = 0; i < keys.length; i++) {
        const k: string = keys[i]!;
        if (k === "$selfExpression")
            continue;

        if (((!!obj) && (obj.constructor === Object)) && k !== "$value") {
            expressions = getDynamoExpression(obj[k!], k);
            if (i === 0 || !key) {
                UpdateExpression = '#' + k.toString().replace(/-/g, "") + "." + expressions.UpdateExpression.substring(4).replace(/\b-\b/g, "");
            } else
                UpdateExpression = "#" + key.toString().replace(/-/g, "") + '.#' + k.toString().replace(/-/g, "") + '.' + expressions.UpdateExpression.substring(4).replace(/\b-\b/g, "");

            ExpressionAttributeNames = { ...ExpressionAttributeNames, ['#' + k.toString().replace(/-/g, "")]: k.toString(), ...expressions.ExpressionAttributeNames };
            ExpressionAttributeValues = {
                ...ExpressionAttributeValues,
                ...expressions.ExpressionAttributeValues
            };

        } else if (keys[0] == "$value") {
            let updateObject = obj["$value"];
            if (obj["$value"].constructor === Object) {
                updateObject = {

                    "M": AWS.DynamoDB.Converter.marshall(updateObject)

                };
            }
            else if (obj["$value"].constructor === Array) {
                const dynamodbArry = (updateObject as Array<any>).map(d =>
                ({
                    "M": AWS.DynamoDB.Converter.marshall(d)
                }));
                updateObject = {
                    "L": dynamodbArry
                };
            } else {
                updateObject = AWS.DynamoDB.Converter.input(updateObject);
            }
            let t: string = `:${key.toString()}`;
            if (keys.length > 1 && keys[1] == "$selfExpression") {
                t = `${obj["$selfExpression"]} :${key}`;
            }
            UpdateExpression = ` = ${t}`;
            ExpressionAttributeValues = {
                [':' + key.toString().replace(/-/g, "")]: updateObject
            }
        }

        if (UpdateExpression.indexOf(". ")) {
            UpdateExpression = UpdateExpression.replace(". ", "");
        }
        UpdateExpressions.push(UpdateExpression)
    }
    UpdateExpression = `SET ${UpdateExpressions.join(",").replace(". ", "")}`;

    return { UpdateExpression, ExpressionAttributeValues, ExpressionAttributeNames };
}