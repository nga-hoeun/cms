"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDynamoExpression = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const getDynamoExpression = (obj, key = "") => {
    const keys = Object.keys(obj);
    let UpdateExpression = '';
    let ExpressionAttributeValues = {};
    let ExpressionAttributeNames = {};
    let UpdateExpressions = [];
    let expressions;
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (k === "$selfExpression")
            continue;
        if (((!!obj) && (obj.constructor === Object)) && k !== "$value") {
            expressions = (0, exports.getDynamoExpression)(obj[k], k);
            if (i === 0 || !key) {
                UpdateExpression = '#' + k.toString().replace(/-/g, "") + "." + expressions.UpdateExpression.substring(4).replace(/\b-\b/g, "");
            }
            else
                UpdateExpression = "#" + key.toString().replace(/-/g, "") + '.#' + k.toString().replace(/-/g, "") + '.' + expressions.UpdateExpression.substring(4).replace(/\b-\b/g, "");
            ExpressionAttributeNames = Object.assign(Object.assign(Object.assign({}, ExpressionAttributeNames), { ['#' + k.toString().replace(/-/g, "")]: k.toString() }), expressions.ExpressionAttributeNames);
            ExpressionAttributeValues = Object.assign(Object.assign({}, ExpressionAttributeValues), expressions.ExpressionAttributeValues);
        }
        else if (keys[0] == "$value") {
            let updateObject = obj["$value"];
            if (obj["$value"].constructor === Object) {
                updateObject = {
                    "M": aws_sdk_1.default.DynamoDB.Converter.marshall(updateObject)
                };
            }
            else if (obj["$value"].constructor === Array) {
                const dynamodbArry = updateObject.map(d => ({
                    "M": aws_sdk_1.default.DynamoDB.Converter.marshall(d)
                }));
                updateObject = {
                    "L": dynamodbArry
                };
            }
            else {
                updateObject = aws_sdk_1.default.DynamoDB.Converter.input(updateObject);
            }
            let t = `:${key.toString()}`;
            if (keys.length > 1 && keys[1] == "$selfExpression") {
                t = `${obj["$selfExpression"]} :${key}`;
            }
            UpdateExpression = ` = ${t}`;
            ExpressionAttributeValues = {
                [':' + key.toString().replace(/-/g, "")]: updateObject
            };
        }
        if (UpdateExpression.indexOf(". ")) {
            UpdateExpression = UpdateExpression.replace(". ", "");
        }
        UpdateExpressions.push(UpdateExpression);
    }
    UpdateExpression = `SET ${UpdateExpressions.join(",").replace(". ", "")}`;
    return { UpdateExpression, ExpressionAttributeValues, ExpressionAttributeNames };
};
exports.getDynamoExpression = getDynamoExpression;
//# sourceMappingURL=dynamoose.util.js.map