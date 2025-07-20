/* === Scan automatique du dossier images/ ===
   Fonctionne partout où un serveur HTTP sert les fichiers (localhost, GitHub Pages, Netlify…)
   Ne fonctionne pas via file:// (CORS). Lancez npx serve . ou python -m http.server 8000
*/

const gallery = document.getElementById('gallery');
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
document.body.appendChild(lightbox);

/* Liste des extensions acceptées */
const imgExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'];

/* Récupération via fetch sur un serveur HTTP */
fetch('images/')
  .then(r => r.text())               // on récupère le listing HTML généré par le serveur
  .then(html => {
    const parser = new DOMParser();
    const doc   = parser.parseFromString(html, 'text/html');
    const links = [...doc.querySelectorAll('a[href]')];

    const imageFiles = links
      .map(a => a.getAttribute('href'))
      .filter(name => {
        const ext = name.split('.').pop().toLowerCase();
        return imgExts.includes(ext);
      });

    if (imageFiles.length === 0) {
      gallery.innerHTML = '<p style="padding:2rem;text-align:center;color:#888;">Aucune image trouvée dans <strong>images/</strong></p>';
      return;
    }

    imageFiles.forEach(name => {
      const img = document.createElement('img');
      img.src = `images/${name}`;
      img.alt = name;
      img.loading = 'lazy';
      gallery.appendChild(img);

      /* Lightbox au clic */
      img.addEventListener('click', () => {
        const big = new Image();
        big.src = img.src;
        big.alt = img.alt;
        lightbox.innerHTML = '';
        lightbox.appendChild(big);
        lightbox.classList.add('show');
      });
    });
  })
  .catch(err => {
    gallery.innerHTML = '<p style="padding:2rem;text-align:center;color:#c00;">Erreur : impossible de lister le dossier <strong>images/</strong><br>⚠️ Utilisez un serveur local (npx serve . ou python -m http.server 8000)</p>';
  });

/* Fermeture de la lightbox */
lightbox.addEventListener('click', () => lightbox.classList.remove('show'));