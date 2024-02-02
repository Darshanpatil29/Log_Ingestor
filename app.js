const searchTextElement = document.getElementById('searchText');
searchTextElement.addEventListener('input', debounce(performSearch, 300));
function debounce(func, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

function performSearch() {
    const searchText = searchTextElement.value;
    const filterType = document.getElementById('filterType').value;
    fetch(`http://localhost:3000/search?field=${filterType}&query=${searchText}`)
      .then(response => response.json())
      .then(data => displaySearchResults(data))
      .catch(error => console.error('Error fetching search results:', error));
  }
  
  function displaySearchResults(results) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
  
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p>No results found.</p>';
      return;
    }
  
    results.forEach((result) => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('result-item');
  
      // displaying based on log data structure
      resultItem.innerHTML = `
        <p><strong>Level:</strong> ${result.level}</p>
        <p><strong>Message:</strong> ${result.message}</p>
        <p><strong>ReourceID:</strong> ${result.resourceId}</p>
        <p><strong>Timestamp:</strong> ${result.timestamp}</p>
        <hr>
      `;
      
      resultsContainer.appendChild(resultItem);
    });
  }
  