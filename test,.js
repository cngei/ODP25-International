
        // Get content data from JSON file
        let contentData = [];
        let currentContent = null;

        // Function to get URL parameters
        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            const results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        // Function to display content based on ID
        function displayContent(id) {
            const content = contentData.find(item => item.Id === parseInt(id));

            if (content) {
                currentContent = content;
                document.getElementById('logo').src = content.ImageSrc || '/api/placeholder/200/100';
                document.getElementById('title').textContent = content.Title;
                document.getElementById('text').textContent = content.Text;
                document.getElementById('content').style.display = 'block';
                document.getElementById('notFound').style.display = 'none';
                if (content.ShowButton === false) {
                    document.getElementById('logBtn').style.display = 'none';
                }
            } else {
                document.getElementById('content').style.display = 'none';
                document.getElementById('notFound').style.display = 'block';
                document.getElementById('logBtn').style.display = 'none';
            }
        }

        // Function to log completed content to local storage
        function logCompletedContent() {
            if (!currentContent) return;

            let completed = JSON.parse(localStorage.getItem('completedContent')) || [];

            // Check if already completed
            if (!completed.some(item => item.Id === currentContent.Id)) {
                completed.push(currentContent);
                localStorage.setItem('completedContent', JSON.stringify(completed));
                alert('Progress logged successfully!');
                updateProgressList();
            } else {
                alert('You have already completed this content!');
            }
        }

        // Function to update progress list in modal
        function updateProgressList() {
            const progressList = document.getElementById('progressList');
            progressList.innerHTML = '';

            const completed = JSON.parse(localStorage.getItem('completedContent')) || [];

            if (completed.length === 0) {
                progressList.innerHTML = '<p>Non hai completato ancora alcuna tappa!</p>';
                return;
            }

            completed.forEach(item => {
                const div = document.createElement('div');
                div.className = 'progress-item';
                div.innerHTML = `<strong>${item.Title}</strong><br>${item.Text.substring(0, 100)}...`;
                progressList.appendChild(div);
            });
        }

        // Event listeners
        document.getElementById('logBtn').addEventListener('click', logCompletedContent);

        // Modal functionality
        const modal = document.getElementById('progressModal');
        const btn = document.getElementById('progressBtn');
        const span = document.getElementsByClassName('close')[0];

        // Fetch the JSON data
        fetch('data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                contentData = data;
                const id = getUrlParameter('id');
                if (id) {
                    displayContent(id);
                } else {
                    updateProgressList();
                    document.getElementById('content').style.display = 'none';
                    modal.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                document.getElementById('content').style.display = 'none';
                document.getElementById('notFound').style.display = 'block';
                document.getElementById('notFound').innerHTML = '<h2>Error Loading Data</h2><p>There was a problem loading the content data. Please try again later.</p>';
            });


        btn.onclick = function () {
            updateProgressList();
            modal.style.display = 'block';
        }

        span.onclick = function () {
            modal.style.display = 'none';
        }

        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }
    