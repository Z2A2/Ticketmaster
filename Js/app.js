const app = document.getElementById("app");

const event = events[0];

app.innerHTML = `

<header class="top-header">

<h1>My Events</h1>

<div class="flag">🇺🇸</div>

<button>Help</button>

</header>

<div class="tabs">

<div class="active">
UPCOMING (1)
</div>

<div>
PAST (0)
</div>

</div>

<div class="event-card">

<img src="${event.image}">

<div class="event-info">

<div class="date">
${event.date} • ${event.time}
</div>

<h2>
${event.title}
</h2>

<p>
${event.venue} - ${event.location}
</p>

<button class="view-btn">
View Tickets
</button>

</div>

</div>

<nav class="bottom-nav">

<button>Discover</button>

<button>For You</button>

<button class="active">
My Tickets
</button>

<button>Sell</button>

<button>Account</button>

</nav>

`;
