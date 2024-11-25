document.getElementById('getRecommendations').addEventListener('click', function () {
    const genre = document.getElementById('genre').value.trim();
    if (genre) {
        getRecommendationsByGenre(genre);
    } else {
        alert('Please enter a genre.');
    }
});

// Function to fetch book recommendations using Google Books API
async function getRecommendationsByGenre(genre) {
    const apiKey = 'AIzaSyCVVy1XBw7P-3p-mD6W7iO2S4CFTnV331o';
    const query = `subject:${encodeURIComponent(genre)}`;
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const recommendedBooks = data.items.map(item => ({
                title: item.volumeInfo.title || 'Unknown Title',
                authors: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
                link: item.volumeInfo.infoLink || '#',
                description: item.volumeInfo.description || 'No description available.',
            }));
            displayRecommendations(recommendedBooks);
        } else {
            displayRecommendations([]);
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        const recommendationsContainer = document.getElementById('recommendedBooks');
        recommendationsContainer.innerHTML = `<p>Error fetching books: ${error.message}</p>`;
    }
}

// Function to display book recommendations
function displayRecommendations(recommendedBooks) {
    const recommendationsContainer = document.getElementById('recommendedBooks');
    recommendationsContainer.innerHTML = ''; // Clear previous results

    if (recommendedBooks.length === 0) {
        recommendationsContainer.innerHTML = '<p>No books found for this genre.</p>';
        return;
    }

    const ul = document.createElement('ul');
    recommendedBooks.forEach(book => {
        const li = document.createElement('li');

        // Create book title link
        const titleLink = document.createElement('a');
        titleLink.textContent = book.title;
        titleLink.href = 'javascript:void(0)';
        titleLink.style.cursor = 'pointer';
        titleLink.style.color = '#6d4c41';
        titleLink.style.textDecoration = 'none';
        titleLink.onclick = () => {
            const details = document.createElement('div');
            details.innerHTML = `
                <p><strong>Author(s):</strong> ${book.authors}</p>
                <p><strong>Description:</strong> ${book.description}</p>
                <p><strong>Google Books Link:</strong> <a href="${book.link}" target="_blank" style="color: #4e342e; text-decoration: underline;">View on Google Books</a></p>
                <p><strong>Amazon Link:</strong> <a href="https://www.amazon.com/s?k=${encodeURIComponent(book.title)}" target="_blank" style="color: #4e342e; text-decoration: underline;">Search on Amazon</a></p>
            `;
            li.appendChild(details);
            titleLink.onclick = null; // Prevent duplicate details display
        };

        li.appendChild(titleLink);
        ul.appendChild(li);
    });
    recommendationsContainer.appendChild(ul);
}