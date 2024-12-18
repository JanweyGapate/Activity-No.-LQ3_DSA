// Sample data (replace with database or persistent storage in a real application)
const sellers = {
    "admin": "password123" // Example seller credentials
};

let menu = {
    "Pasta": [
        {name: "Turkey Bolognese", price: 12.99},
        {name: "Steakhouse Pasta", price: 15.99},
        {name: "Fettuccine Alfredo", price: 14.99}
    ],
    "Desserts": [
        {name: "Vanila Cake", price: 7.99},
        {name: "Lemon Bars", price: 6.99},
        {name: "Tiramisu", price: 4.99}
    ],
    "Drinks": [
        {name: "Milkshake", price: 2.99},
        {name: "Iced-tea", price: 3.99},
        {name: "Smoothie", price: 1.99}
    ]
};

//Helper function to get input (replace with your preferred input method)
function getInput(message) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => readline.question(message, answer => {
        readline.close();
        resolve(answer);
    }));
}


//Seller functions (using getInput)

async function sellerLogin() {
    const username = await getInput("Username:");
    const password = await getInput("Password:");
    return sellers[username] === password;
}

async function addItem() {
    const category = await getInput("Enter category:");
    const name = await getInput("Enter item name:");
    const price = parseFloat(await getInput("Enter price:"));
    menu[category] = menu[category] || [];
    menu[category].push({name, price});
    console.log("Item added successfully!");
}

async function removeItem() {
    const category = await getInput("Enter category:");
    const name = await getInput("Enter item name:");
    menu[category] = menu[category].filter(item => item.name !== name);
    console.log("Item removed successfully!");
}


//Customer functions (using getInput)

async function displayMenu() {
    let menuString = "";
    for (const category in menu) {
        menuString += \n${category}:\n;
        menu[category].forEach((item, index) => {
            menuString += ${index + 1}. ${item.name} - $${item.price.toFixed(2)}\n;
        });
    }
    return menuString;
}

async function customerOrder(cart) {
    while (true) {
        console.log(Current Cart: ${JSON.stringify(cart)});
        const action = (await getInput("Choose action (ORDER, CART, CANCEL):")).toUpperCase();
        if (action === "ORDER") {
            const category = await getInput(await displayMenu() + "\nEnter category:");
            const itemIndex = parseInt(await getInput(Enter item number from ${category}:)) - 1;
            const quantity = parseInt(await getInput("Enter quantity:"));
            if (menu[category] && menu[category][itemIndex]) {
                cart.push({...menu[category][itemIndex], quantity});
                console.log("Item added to cart!");
            } else {
                console.log("Invalid item or category.");
            }
        } else if (action === "CART") {
            await manageCart(cart);
        } else if (action === "CANCEL") {
            break;
        } else {
            console.log("Invalid action.");
        }
    }
}


async function manageCart(cart) {
    while (true) {
        console.log(Your Cart: ${JSON.stringify(cart)});
        const action = (await getInput("Choose action (PRINT, ADD, REMOVE, CANCEL):")).toUpperCase();
        if (action === "PRINT") {
            printCart(cart);
            break;
        } else if (action === "ADD") {
            break; //Go back to main customer menu
        } else if (action === "REMOVE") {
            const itemName = await getInput("Enter item name to remove:");
            cart = cart.filter(item => item.name !== itemName);
            console.log("Item removed from cart.");
        } else if (action === "CANCEL") {
            break; //Go back to main customer menu
        } else {
            console.log("Invalid action.");
        }
    }
}

function printCart(cart) {
    if (cart.length === 0) {
        console.log("Your cart is empty.");
        return;
    }

    //Simple sort by name (you could implement more sophisticated sorting)
    cart.sort((a, b) => a.name.localeCompare(b.name));

    let output = "Order Summary:\n";
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        output += ${item.name} x ${item.quantity} = $${itemTotal.toFixed(2)}\n;
        total += itemTotal;
    });
    output += \nTotal: $${total.toFixed(2)};
    console.log(output);
}

//Main program loop
async function main() {
    let cart = [];
    while (true) {
        const role = (await getInput("Are you a SELLER or CUSTOMER?")).toUpperCase();
        if (role === "SELLER") {
            if (await sellerLogin()) {
                while (true) {
                    const action = (await getInput("Choose action (LOGOUT, ADD, REMOVE):")).toUpperCase();
                    if (action === "LOGOUT") break;
                    else if (action === "ADD") await addItem();
                    else if (action === "REMOVE") await removeItem();
                    else console.log("Invalid action.");
                }
            } else {
                console.log("Invalid username or password.");
            }
        } else if (role === "CUSTOMER") {
            await customerOrder(cart);
            cart = []; //Clear cart after order
        } else {
            console.log("Invalid role.");
        }
    }
}

main();
