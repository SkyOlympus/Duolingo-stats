const statsUrl = 'http://philipps.blog/duo-bot/index.json';

// Turn off cors restrictions for local testing
// see https://stackoverflow.com/a/38228168

fetch(statsUrl)
    .then(response => response.json())
    .then(data => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const todayString = today.toISOString();
        console.log(todayString);
        const recordsToday = data.records
            .filter(row => row.language === 'total')
            .filter(row => row.date === todayString);
        console.log(recordsToday);
        // Task 1: Log today's total xp by user like so:
        // Username: 999999XP today, 100000000XP in total
        recordsToday.forEach(record => {
        const user = record.user
        const relative = record.relative; //Today's xp = xp_today
        const absolute = record.absolute; //Total xp = total_xp

        console.log(`${user}: ${relative}XP today, ${absolute}XP in total`);
    });
})
       
        // Hint: Read the console log to check every row's attributes
       // I've assigned a const for username, today's xp and total xp
       
var parent = document.createElement("table");
parent.setAttribute("border", "1");
document.body.appendChild(parent);

var child=document.createElement("tr");
parent.appendChild(child);

var headers = ["Username", "RelativeXp", "TotalXp"];
headers.forEach(function(headerText) {
    var thElement = document.createElement("th");
    thElement.innerText = headerText;
    child.appendChild(thElement);
});
var data = [
    { Username: "Gabriel", RelativeXp: 100, TotalXp: 24100 },
    { Username: "Giancarlo", RelativeXp: 120, TotalXp: 30900 },
    { Username: "Philipp", RelativeXp: 200, TotalXp: 50300 },
    { Username: "Anna", RelativeXp: 170, TotalXp: 28900 }
];
data.forEach(function(rowData) {
    var row = document.createElement("tr");

    Object.values(rowData).forEach(function(cellData) {
        var tdElement = document.createElement("td");
        tdElement.innerText = cellData;
        row.appendChild(tdElement);
    });

    parent.appendChild(row);
});