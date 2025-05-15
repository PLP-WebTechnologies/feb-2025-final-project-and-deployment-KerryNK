// --- Toast Notification ---
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// --- Dark Mode ---
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}
if (localStorage.getItem('darkMode') === "true") {
  document.body.classList.add('dark-mode');
}

// --- Playlist Rendering ---
function renderPlaylists(filter = "") {
  const container = document.getElementById('playlistContainer');
  if (!container) return;
  container.innerHTML = "";
  let playlists = JSON.parse(localStorage.getItem('playlists')) || [];

  // Filter by tag if needed
  if (filter) {
    playlists = playlists.filter(pl =>
      (pl.tags || []).some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    );
  }

  if (playlists.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>No playlists found.</p>";
    return;
  }

  playlists.forEach((pl, idx) => {
    const card = document.createElement('div');
    card.className = "playlist-card";
    card.innerHTML = `
      <h3>${pl.title || "Untitled"}</h3>
      <p>${pl.description || ""}</p>
      <p>Tags: ${(pl.tags || []).join(', ')}</p>
      <a href="${pl.link}" target="_blank">Listen 🎧</a>
      <div style="margin-top:10px;">
        <span>❤️ ${pl.likes || 0}</span>
        <button class="like-btn" style="margin-left:10px;">Like</button>
      </div>
    `;

    // Like button logic
    card.querySelector('.like-btn').addEventListener('click', () => {
      let playlists = JSON.parse(localStorage.getItem('playlists')) || [];
      playlists[idx].likes = (playlists[idx].likes || 0) + 1;
      localStorage.setItem('playlists', JSON.stringify(playlists));
      renderPlaylists(filter);
    });

    container.appendChild(card);
  });
}

// --- Save Playlist ---
function savePlaylist() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(Boolean);
  const link = document.getElementById('link').value.trim();

  if (!title || !link) {
    showToast("❗ Title and Link are required.");
    return;
  }

  const playlist = { title, description, tags, link, likes: 0 };
  let playlists = JSON.parse(localStorage.getItem('playlists')) || [];
  playlists.push(playlist);
  localStorage.setItem('playlists', JSON.stringify(playlists));

  showToast("✅ Playlist saved successfully!");
  document.getElementById('playlistForm').reset?.();
  document.getElementById('playlistForm').style.display = 'none';
  renderPlaylists();
}

// --- Cancel Playlist Form ---
function cancelPlaylist() {
  document.getElementById('playlistForm').reset?.();
  document.getElementById('playlistForm').style.display = 'none';
}

// --- Toggle Playlist Form ---
function toggleForm() {
  const form = document.getElementById('playlistForm');
  if (!form) return;
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// --- Filter Input ---
document.addEventListener('DOMContentLoaded', () => {
  renderPlaylists();

  const filterInput = document.getElementById('filterInput');
  if (filterInput) {
    filterInput.addEventListener('input', function() {
      renderPlaylists(this.value);
    });
  }

  // If using a form element for playlist input
  const form = document.getElementById('playlistForm');
  if (form && form.tagName === "FORM") {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      savePlaylist();
    });
  }
});