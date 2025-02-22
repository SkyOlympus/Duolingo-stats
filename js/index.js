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
    const japaneseXpByUser = data.records
    .filter(row => row.language === 'ja') // Filter for Japanese language
    .filter(row => row.date === todayString)
    .reduce((acc, row) => {
        // Group by user and sum the 'absolute' values
        acc[row.user] = (acc[row.user] || 0) + row.absolute;
        return acc;
    }, {});

    const tableBody = document.getElementById('data-table').querySelector('tbody');
   

    // Only show records where language is "total"

   recordsToday
      .forEach(record => {
        const row = document.createElement('tr');
  
        const bundleDateCell = document.createElement('td');
        const recordDateCell = document.createElement('td');
        const userCell = document.createElement('td');
        const absoluteCell = document.createElement('td');
        const relativeCell = document.createElement('td');
        const japaneseXpCell = document.createElement('td'); // New column for Japanese XP

  
        // Fill the cells with data
       
        recordDateCell.textContent = new Date(record.date).toLocaleString();
        userCell.textContent = record.user;
        absoluteCell.textContent = record.absolute;
        relativeCell.textContent = record.relative;
        japaneseXpCell.textContent = japaneseXpByUser[record.user] || 0; // Display total Japanese XP for the user

  
        // Append cells to the row
        row.appendChild(bundleDateCell);
        row.appendChild(recordDateCell);
        row.appendChild(userCell);
        row.appendChild(absoluteCell);
        row.appendChild(relativeCell);
        row.appendChild(japaneseXpCell); // Append the new column                 
  
        // Append row to the table body
        tableBody.appendChild(row);
      });
//Relative xp chart
})
fetch(statsUrl)
  .then(response => response.json())
  .then(data => {
    // Get today's date and calculate the past 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setUTCHours(0, 0, 0, 0);
      return date.toISOString();
    }).reverse(); // Reverse to make oldest first

    // Map data for the past 7 days
    const xpDataByUser = {};
    dates.forEach(date => {
      const records = data.records
        .filter(row => row.language === 'total')
        .filter(row => row.date === date);

      records.forEach(record => {
        const user = record.user;
        const relativeXp = record.relative;

        // Initialize user data
        if (!xpDataByUser[user]) {
          xpDataByUser[user] = Array(7).fill(0); //Check if this ever happens
        }

        // Add relative XP to the correct day index
        const dayIndex = dates.indexOf(date);
        xpDataByUser[user][dayIndex] = relativeXp;
      });
    });

    // Prepare data for Chart.js
    const datasets = Object.keys(xpDataByUser).map(user => ({
      label: user,
      data: xpDataByUser[user],
      borderWidth: 2,
      fill: false,
    }));

    // Create the line chart
    const ctx = document.getElementById('xpChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates.map(date => new Date(date).toLocaleDateString()), // Y-axis: dates
        datasets: datasets, // X-axis: relative XP data
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: { title: { display: true, text: 'Relative XP' } },
          y: { title: { display: true, text: 'Date' } },
        },
      },
    });
  });
//Absolute xp chart 2
  fetch(statsUrl)
  .then(response => response.json())
  .then(data => {
    // Get all unique dates from the data
    const uniqueDates = Array.from(new Set(data.records.map(record => record.date))).sort();

    // Map data for all dates
    const xpDataByUser = {};
    uniqueDates.forEach(date => {
      const records = data.records
        .filter(row => row.language === 'total')
        .filter(row => row.date === date);

      records.forEach(record => {
        const user = record.user;
        const absoluteXp = record.absolute;

        // Initialize user data
        if (!xpDataByUser[user]) {
          xpDataByUser[user] = Array(uniqueDates.length).fill(0);
        }

        // Add absolute XP to the correct day index
        const dayIndex = uniqueDates.indexOf(date);
        xpDataByUser[user][dayIndex] = absoluteXp;
      });
    });

    // Prepare data for Chart.js
    const datasets = Object.keys(xpDataByUser).map(user => ({
      label: user,
      data: xpDataByUser[user],
      borderColor: getRandomColor(),
      borderWidth: 2,
      fill: false,
    }));

    // Create the line chart for absolute XP data
    const ctxAbsolute = document.getElementById('absoluteXpChart2').getContext('2d');
    new Chart(ctxAbsolute, {
      type: 'line',
      data: {
        labels: uniqueDates.map(date => new Date(date).toLocaleDateString()), // X-axis: dates
        datasets: datasets, // Y-axis: absolute XP data
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Absolute XP' } },
        },
      },
    });

    // Generate random color for each user
    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  });
       

  //Days were users most use Duolingo
  fetch(statsUrl)
    .then(response => response.json())
    .then(data => {
        // Create an object to count occurrences of each weekday
        const weekdayCount = { "Sunday": 0, "Monday": 0, "Tuesday": 0, "Wednesday": 0, "Thursday": 0, "Friday": 0, "Saturday": 0 };

        // Iterate through records and count occurrences by day of the week
        data.records.forEach(record => {
            const date = new Date(record.date);
            const dayName = date.toLocaleString('en-US', { weekday: 'long' });
            weekdayCount[dayName] += 1; //Fix later, add different count
        });

        console.log("Weekday Usage Frequency:", weekdayCount);

        // Prepare data for Chart.js
        const labels = Object.keys(weekdayCount);
        const values = Object.values(weekdayCount);

        // Create the chart
        const ctx = document.getElementById('usageChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Duolingo Usage Frequency',
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(100, 200, 100, 0.6)'
                    ],
                    borderColor: 'rgba(0, 0, 0, 0.3)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => console.error('Fetch error:', error));

  

        // Hint: Read the console log to check every row's attributes
       // I've assigned a const for username, today's xp and total xp
//Example of a table using DOM manipulation
 /*      
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

    parent.appendChild(row) */