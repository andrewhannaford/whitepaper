// Fetch data from an external API
fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(data => {
        // Use Lodash (from outdated CDN) to manipulate the data
        const sortedUsers = _.sortBy(data, ['name']); // Sort users by name
        const userList = document.getElementById('user-list');

        // Render the sorted user list
        sortedUsers.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user';
            userDiv.textContent = `${user.name} (${user.email})`;
            userList.appendChild(userDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });