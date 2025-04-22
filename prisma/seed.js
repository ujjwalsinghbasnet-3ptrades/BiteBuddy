"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var menuItems, _i, menuItems_1, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Delete existing data
                return [4 /*yield*/, prisma.menuItem.deleteMany()];
                case 1:
                    // Delete existing data
                    _a.sent();
                    menuItems = [
                        {
                            name: "Classic Cheeseburger",
                            description: "Juicy beef patty with melted cheese, lettuce, tomato, and our special sauce on a toasted bun.",
                            price: 9.99,
                            image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            category: "Burgers",
                            popularity: 95,
                        },
                        {
                            name: "Margherita Pizza",
                            description: "Traditional pizza with tomato sauce, fresh mozzarella, basil, and olive oil on our house-made crust.",
                            price: 12.99,
                            image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            category: "Pizza",
                            popularity: 90,
                        },
                        {
                            name: "Spicy Buffalo Wings",
                            description: "Crispy chicken wings tossed in our signature buffalo sauce, served with celery and blue cheese dip.",
                            price: 10.99,
                            image: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            category: "Appetizers",
                            popularity: 85,
                        },
                        {
                            name: "Caesar Salad",
                            description: "Crisp romaine lettuce with parmesan cheese, croutons, and our creamy Caesar dressing.",
                            price: 8.99,
                            image: "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            category: "Salads",
                            popularity: 75,
                        },
                        {
                            name: "Grilled Salmon",
                            description: "Fresh Atlantic salmon fillet grilled to perfection, served with seasonal vegetables and lemon herb sauce.",
                            price: 16.99,
                            image: "https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            category: "Mains",
                            popularity: 80,
                        },
                        {
                            name: "Chocolate Lava Cake",
                            description: "Warm chocolate cake with a molten center, served with vanilla ice cream and fresh berries.",
                            price: 7.99,
                            image: "https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            category: "Desserts",
                            popularity: 88,
                        },
                        {
                            name: "Veggie Wrap",
                            description: "Grilled vegetables, hummus, and mixed greens wrapped in a whole wheat tortilla.",
                            price: 8.99,
                            image: "https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            category: "Sandwiches",
                            popularity: 70,
                        },
                        {
                            name: "Chicken Alfredo Pasta",
                            description: "Fettuccine pasta in a creamy Alfredo sauce with grilled chicken and parmesan cheese.",
                            price: 14.99,
                            image: "https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            category: "Pasta",
                            popularity: 82,
                        },
                        {
                            name: "Loaded Nachos",
                            description: "Crispy tortilla chips topped with melted cheese, jalapeños, black beans, sour cream, and guacamole.",
                            price: 11.99,
                            image: "https://images.pexels.com/photos/1108775/pexels-photo-1108775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            category: "Appetizers",
                            popularity: 78,
                        },
                        {
                            name: "Fresh Fruit Smoothie",
                            description: "Blend of seasonal fruits with yogurt and honey.",
                            price: 5.99,
                            image: "https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            category: "Drinks",
                            popularity: 65,
                        },
                    ];
                    _i = 0, menuItems_1 = menuItems;
                    _a.label = 2;
                case 2:
                    if (!(_i < menuItems_1.length)) return [3 /*break*/, 5];
                    item = menuItems_1[_i];
                    return [4 /*yield*/, prisma.menuItem.create({
                            data: item,
                        })];
                case 3:
                    _a.sent();
                    console.log({ seeding: item.name });
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log("Database has been seeded!");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
