/*==========TODAY IN SPACE (APOD)=========*/
const API_KEY = "rKAGgYBLAL7ONmj9PTMlK31cMXbtNgdJv4oD60jR";
const APOD_PLACEHOLDER = "images/space-placeholder.jpg";

async function loadAPOD(date) {
  if (date === undefined) {
    date = "";
  }

  var loading = document.getElementById("apod-loading");
  var img = document.getElementById("apodImage");

  loading.classList.remove("hidden");
  img.classList.add("hidden");

  try {
    var url = "https://api.nasa.gov/planetary/apod?api_key=" + API_KEY;

    if (date !== "") {
      url = url + "&date=" + date;
    }

    var response = await fetch(url);
    var data = await response.json();

    if (data.media_type === "image") {
      img.src = data.url;
    } else {
      img.src = APOD_PLACEHOLDER;
    }

    img.alt = data.title || "Astronomy Picture";

    document.getElementById("apod-title").innerText =
      data.title || "No Title";

    document.getElementById("apod-explanation").innerText =
      data.explanation || "No description available.";

    document.getElementById("apodDate").innerText =
      "Astronomy Picture of the Day - " + data.date;

    document.getElementById("apod-date-detail").innerHTML =
      '<i class="far fa-calendar mr-2"></i>' + data.date;

    document.getElementById("apod-date-info").innerText = data.date;

    document.getElementById("apod-media-type").innerText =
      data.media_type.toUpperCase();

    document.getElementById("apod-copyright").innerText =
      data.copyright ? "© " + data.copyright : "© NASA";

    img.onload = function () {
      loading.classList.add("hidden");
      img.classList.remove("hidden");
    };

    img.onerror = function () {
      img.src = APOD_PLACEHOLDER;
      loading.classList.add("hidden");
      img.classList.remove("hidden");
    };

  } catch (error) {
    console.log("APOD error:", error);
    img.src = APOD_PLACEHOLDER;
    loading.classList.add("hidden");
    img.classList.remove("hidden");
  }
}

loadAPOD();
/*==============NAVIGATION SECTIONS - FIXED!===============*/
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".app-section");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();

    let targetSection = link.dataset.section;
    const camelCaseSection = targetSection.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    
    sections.forEach(section => section.classList.add("hidden"));
    
    let targetElement = document.getElementById(targetSection) || 
                       document.getElementById(camelCaseSection) ||
                       document.querySelector(`[data-section="${targetSection}"]`);
    
    if (targetElement) {
      targetElement.classList.remove("hidden");
    }

    navLinks.forEach(l => {
      l.classList.remove("bg-blue-500/10", "text-blue-400");
      l.classList.add("text-slate-300");
    });

    link.classList.add("bg-blue-500/10", "text-blue-400");
    link.classList.remove("text-slate-300");
  });
});

/*==============FEATURED LAUNCH==================*/
async function loadFeaturedLaunch() {
  const container = document.getElementById("featuredLaunch");
  if (!container) return;

  try {
    const res = await fetch("https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1");
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const launch = data.results[0];
      const date = new Date(launch.net);
      const today = new Date();
      const daysUntil = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

      container.innerHTML = `
        <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
            <div class="flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3 mb-4">
                  <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                    <i class="fas fa-star"></i> Featured Launch
                  </span>
                  <span class="px-4 py-1.5 ${launch.status.name === "Go" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"} rounded-full text-sm font-semibold">
                    ${launch.status.name}
                  </span>
                </div>
                <h3 class="text-3xl font-bold mb-3 leading-tight">${launch.name}</h3>
                <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-building"></i>
                    <span>${launch.launch_service_provider.name}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="fas fa-rocket"></i>
                    <span>${launch.rocket.configuration.name}</span>
                  </div>
                </div>
                ${daysUntil >= 0 ? `
                <div class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
                  <i class="fas fa-clock text-2xl text-blue-400"></i>
                  <div>
                    <p class="text-2xl font-bold text-blue-400">${daysUntil}</p>
                    <p class="text-xs text-slate-400">Days Until Launch</p>
                  </div>
                </div>
                ` : ''}
                <div class="grid xl:grid-cols-2 gap-4 mb-6">
                  <div class="bg-slate-900/50 rounded-xl p-4">
                    <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                      <i class="fas fa-calendar"></i> Launch Date
                    </p>
                    <p class="font-semibold">${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div class="bg-slate-900/50 rounded-xl p-4">
                    <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                      <i class="fas fa-clock"></i> Launch Time
                    </p>
                    <p class="font-semibold">${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} UTC</p>
                  </div>
                  <div class="bg-slate-900/50 rounded-xl p-4">
                    <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                      <i class="fas fa-map-marker-alt"></i> Location
                    </p>
                    <p class="font-semibold text-sm">${launch.pad.location.name}</p>
                  </div>
                  <div class="bg-slate-900/50 rounded-xl p-4">
                    <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                      <i class="fas fa-globe"></i> Country
                    </p>
                    <p class="font-semibold">${launch.pad.location.country_code}</p>
                  </div>
                </div>
                <p class="text-slate-300 leading-relaxed mb-6">
                  ${launch.mission?.description || 'Details TBD.'}
                </p>
              </div>
              <div class="flex flex-col md:flex-row gap-3">
                <button class="flex-1 px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
                  <i class="fas fa-info-circle"></i> View Full Details
                </button>
                <div class="flex gap-2">
                  <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                    <i class="far fa-heart"></i>
                  </button>
                  <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                    <i class="fas fa-bell"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="relative">
              <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
                ${launch.image ? `
                  <img 
                    src="${launch.image}" 
                    alt="${launch.name}"
                    class="w-full h-full object-cover"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                  />
                  <div class="hidden items-center justify-center h-full min-h-[400px] bg-slate-800" style="display:none;">
                    <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
                  </div>
                ` : `
                  <div class="flex items-center justify-center h-full min-h-[400px] bg-slate-800">
                    <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
                  </div>
                `}
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  } catch (err) {
    console.error("Featured launch error:", err);
  }
}

/*============ALL LAUNCHES GRID===========*/
async function loadLaunches() {
  const grid = document.getElementById("launches-grid");
  if (!grid) return;
  
  grid.innerHTML = '<div class="col-span-full text-center py-8"><i class="fas fa-spinner fa-spin text-3xl text-blue-400"></i><p class="text-slate-400 mt-3">Loading launches...</p></div>';

  try {
    const res = await fetch("https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=12");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const data = await res.json();
    if (!data.results || data.results.length === 0) throw new Error("No launches found");

    grid.innerHTML = "";

    data.results.forEach(launch => {
      const date = new Date(launch.net);

      const card = document.createElement("div");
      card.className = "bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer";

      card.innerHTML = `
        <div class="relative h-48 overflow-hidden bg-slate-900/50">
          ${launch.image ? `
            <img
              src="${launch.image}"
              alt="${launch.name}"
              class="w-full h-full object-cover transition-transform group-hover:scale-105"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div class="hidden items-center justify-center h-full bg-slate-800" style="display:none;">
              <i class="fas fa-rocket text-5xl text-slate-700"></i>
            </div>
          ` : `
            <div class="flex items-center justify-center h-full bg-slate-800">
              <i class="fas fa-rocket text-5xl text-slate-700"></i>
            </div>
          `}
          <div class="absolute top-3 right-3">
            <span class="px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
              launch.status.name === "Go" ? "bg-green-500/90 text-white" : 
              launch.status.name === "TBC" ? "bg-yellow-500/90 text-white" : 
              "bg-blue-500/90 text-white"
            }">
              ${launch.status.name}
            </span>
          </div>
        </div>

        <div class="p-5">
          <div class="mb-3">
            <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
              ${launch.name}
            </h4>
            <p class="text-sm text-slate-400 flex items-center gap-2">
              <i class="fas fa-building text-xs"></i>
              ${launch.launch_service_provider.name}
            </p>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-calendar text-slate-500 w-4"></i>
              <span class="text-slate-300">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-clock text-slate-500 w-4"></i>
              <span class="text-slate-300">${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} UTC</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-rocket text-slate-500 w-4"></i>
              <span class="text-slate-300">${launch.rocket.configuration.name}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
              <span class="text-slate-300 line-clamp-1">${launch.pad.name}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
            <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
              Details
            </button>
            <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              <i class="far fa-heart"></i>
            </button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Launches error:", err);
    grid.innerHTML = `
      <div class="col-span-full text-center py-8">
        <i class="fas fa-exclamation-circle text-4xl text-red-400 mb-3"></i>
        <p class="text-slate-400 mb-3">Failed to load launches</p>
        <button onclick="loadLaunches()" class="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
          <i class="fas fa-redo mr-2"></i>Try Again
        </button>
      </div>
    `;
  }
}

// Load both featured and all launches
loadFeaturedLaunch();
loadLaunches();

/*============FULL IMAGE VIEWER================*/
const openFullImageBtn = document.getElementById("openFullImage");
if (openFullImageBtn) {
  openFullImageBtn.addEventListener("click", () => {
    const img = document.getElementById("apodImage");
    if (img && img.src) {
      window.open(img.src, "_blank");
    }
  });
}