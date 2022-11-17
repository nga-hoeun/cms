"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = void 0;
const isEmpty = (user) => {
    if (user.email == null
        || user.gender == null
        || user.username == null
        || user.age == null) {
        return true;
    }
    else {
        return false;
    }
};
exports.isEmpty = isEmpty;
//# sourceMappingURL=create.util.js.map