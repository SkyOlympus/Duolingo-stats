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
        const username = record.username
        const xpToday = record.xp_today; //Today's xp = xp_today
        const totalXp = record.total_xp; //Total xp = total_xp

        console.log(`${username}: ${xpToday}XP today, ${totalXp}XP in total`);
    });
})
       
        // Hint: Read the console log to check every row's attributes
       // I've assigned a const for username, today's xp and total xp

       