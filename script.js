// Animate hero content on page load
anime({
  targets: '.hero-content',
  opacity: [0, 1],
  translateY: [30, 0],
  duration: 800,
  easing: 'easeOutExpo'
});

// Count up stats when they scroll into view
const statsObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      document.querySelectorAll('.count').forEach(function(el) {
        anime({
          targets: el,
          innerHTML: [0, parseInt(el.dataset.target)],
          duration: 1500,
          easing: 'easeOutExpo',
          round: 1
        });
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

statsObserver.observe(document.querySelector('.stats'));

// Animate how-it-works steps on scroll
const stepsObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      anime({
        targets: '.step',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(150),
        duration: 600,
        easing: 'easeOutExpo'
      });
      stepsObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

stepsObserver.observe(document.querySelector('.how-it-works'));

// Set up Leaflet map centered on LA
const map = L.map('map').setView([34.0522, -118.2437], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  maxZoom: 19
}).addTo(map);

// Custom marker for user location
const userIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;background:#3b82f6;border:3px solid white;border-radius:50%;"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Custom marker for tow trucks
const truckIcon = L.divIcon({
  className: '',
  html: '<div style="font-size:1.4rem;">🚛</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const operatorNames = [
  'LA Quick Tow', 'Westside Recovery', 'SoCal Towing',
  'Sunset Roadside', 'Pacific Tow Co.', 'Valley Tow Pros'
];

let userMarker = null;
let truckMarkers = [];

// When user clicks map, show nearby operators
map.on('click', function(e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  // Remove old markers
  if (userMarker) map.removeLayer(userMarker);
  truckMarkers.forEach(function(m) { map.removeLayer(m); });
  truckMarkers = [];

  // Place user marker
  userMarker = L.marker([lat, lng], { icon: userIcon })
    .addTo(map)
    .bindPopup('<b>Your Location</b>')
    .openPopup();

  // Generate fake nearby operators
  const operators = [];
  const count = Math.floor(Math.random() * 3) + 3;

  for (let i = 0; i < count; i++) {
    const offsetLat = (Math.random() - 0.5) * 0.06;
    const offsetLng = (Math.random() - 0.5) * 0.06;
    const miles = parseFloat((Math.sqrt(offsetLat * offsetLat + offsetLng * offsetLng) * 69).toFixed(1));
    const eta = Math.round(miles / 0.5 + 3);
    const name = operatorNames[Math.floor(Math.random() * operatorNames.length)];

    operators.push({ name, lat: lat + offsetLat, lng: lng + offsetLng, miles, eta });
  }

  operators.sort(function(a, b) { return a.miles - b.miles; });

  // Add truck markers to map
  operators.forEach(function(op) {
    const marker = L.marker([op.lat, op.lng], { icon: truckIcon })
      .addTo(map)
      .bindPopup('<b>' + op.name + '</b><br>' + op.miles + ' mi · ETA ~' + op.eta + ' min');
    truckMarkers.push(marker);
  });

  // Animate markers appearing
  anime({
    targets: '.leaflet-marker-icon',
    scale: [0, 1],
    opacity: [0, 1],
    delay: anime.stagger(100),
    duration: 400,
    easing: 'easeOutBack'
  });

  // Show operator cards in sidebar
  const list = document.getElementById('operator-list');
  list.innerHTML = '';

  operators.forEach(function(op) {
    const card = document.createElement('div');
    card.className = 'operator-card';
    card.innerHTML =
      '<h4>🚛 ' + op.name + '</h4>' +
      '<p class="distance">' + op.miles + ' miles away</p>' +
      '<p class="eta">ETA: ~' + op.eta + ' minutes</p>';
    list.appendChild(card);
  });

  // Animate cards sliding in
  anime({
    targets: '.operator-card',
    opacity: [0, 1],
    translateX: [15, 0],
    delay: anime.stagger(100),
    duration: 400,
    easing: 'easeOutExpo'
  });

  // Show request button
  const btn = document.getElementById('request-btn');
  btn.style.display = 'block';
  anime({
    targets: '#request-btn',
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 400,
    easing: 'easeOutExpo',
    delay: 400
  });
});

// Request button click
document.getElementById('request-btn').addEventListener('click', function() {
  this.textContent = '✅ Request Sent!';
  this.style.background = '#16a34a';

  setTimeout(() => {
    this.textContent = '🚛 Request a Tow';
    this.style.background = '';
  }, 3000);
});

// Contact form submission
function handleSubmit(e) {
  e.preventDefault();
  const msg = document.getElementById('success-msg');
  msg.style.display = 'block';

  anime({
    targets: '#success-msg',
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 400,
    easing: 'easeOutExpo'
  });

  e.target.reset();
}