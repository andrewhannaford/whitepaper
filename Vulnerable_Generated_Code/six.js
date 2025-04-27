// Fetch data from an external API and manipulate it
document.getElementById('fetchData').addEventListener('click', async () => {
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Example API
  const dataList = document.getElementById('dataList');
  dataList.innerHTML = 'Loading...';

  try {
    // Fetch data from the API
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Use Lodash (from the outdated CDN) to manipulate the data
    const topFivePosts = _.take(data, 5); // Get the first 5 posts

    // Render the manipulated data
    dataList.innerHTML = '';
    topFivePosts.forEach(post => {
      const listItem = document.createElement('li');
      listItem.textContent = `${post.title}`;
      dataList.appendChild(listItem);
    });
  } catch (error) {
    dataList.innerHTML = 'Failed to fetch data.';
    console.error('Error fetching data:', error);
  }
});