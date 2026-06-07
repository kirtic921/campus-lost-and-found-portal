const firebaseConfig = {
    apiKey: "AIzaSyCxoAqmgByFpMKG2vU0vDnI3GsN6O778PI",
    authDomain: "campus-lost-and-found-21faa.firebaseapp.com",
    projectId: "campus-lost-and-found-21faa",
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();



  const currentUserId = localStorage.getItem("userId");

  const itemsGrid = document.getElementById("itemsGrid");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");

  let allItems = [];

  // 1️ Fetch all items from Firestore
  db.collection("items")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      allItems = [];

      snapshot.forEach((doc) => {
        allItems.push({
          id: doc.id,
          ...doc.data()
        });
      });

      renderItems();
    });

  // 2 Render items based on search + filter
  function renderItems() {
    const searchText = searchInput.value.toLowerCase();
    const status = statusFilter.value;

    itemsGrid.innerHTML = "";

    allItems
      .filter((item) => {
        
        const matchesSearch =
          item.itemName.toLowerCase().includes(searchText);

        const matchesStatus =
          status === "all" || item.status === status;

        return matchesSearch && matchesStatus;
      })
      .forEach((item) => {
        const card = document.createElement("div");
        card.className = `item-card ${item.resolved ? 'resolved-card' : ''}`;


        card.innerHTML = `
          <img src="${item.imageUrl || 'placeholder.png'}">
          <h3>${item.itemName}</h3>
          <p>${item.description}</p>
          <p><strong>Location:</strong> ${item.location}</p>
          
           
          ${item.aiSummary ? `
  <div class="ai-box">
    <strong>Gemini AI Summary:</strong>
    <p class="ai-summary">${item.aiSummary}</p>
  </div>
` : ""}

          <span class="status ${item.status}">
            ${item.status.toUpperCase()}
          </span>
          ${item.resolved ? `<span class="resolved-tag">RESOLVED</span>` : ''}
          
          <button class="contact-btn">View Contact</button>
  <p class="contact-info" style="display:none;">
    <strong>Contact:</strong> ${item.contact}
  </p>
  
          ${item.ownerId === currentUserId ? `
<button class="resolve-btn ${item.resolved ? 'undo' : ''}">
  ${item.resolved ? 'Undo Resolve' : 'Mark as Resolved'}
</button>
` : ''}

        `;
       
        const resolveBtn = card.querySelector(".resolve-btn");

        const contactBtn = card.querySelector(".contact-btn");
const contactInfo = card.querySelector(".contact-info");

const modal = document.getElementById("contactModal");
const modalContact = document.getElementById("modalContact");
const closeBtn = document.querySelector(".close");

contactBtn.addEventListener("click", () => {
  modal.style.display = "block";
  modalContact.innerHTML = `<strong>Contact No.:</strong> ${item.contact}`;
});

closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

        if (resolveBtn && item.ownerId === currentUserId) {
  resolveBtn.addEventListener("click", async () => {
    await db.collection("items").doc(item.id).update({
      resolved: !item.resolved
    });
  });
}

      


if (resolveBtn) {
  resolveBtn.addEventListener("click", async () => {
  await db.collection("items").doc(item.id).update({
    resolved: !item.resolved
  });
});
}

        itemsGrid.appendChild(card);
      });
  }

  // 3️ Listen to user actions
  searchInput.addEventListener("input", renderItems);
  statusFilter.addEventListener("change", renderItems);

















  