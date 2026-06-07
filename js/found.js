const firebaseConfig = {
    apiKey: "AIzaSyCxoAqmgByFpMKG2vU0vDnI3GsN6O778PI",
    authDomain: "campus-lost-and-found-21faa.firebaseapp.com",
    projectId: "campus-lost-and-found-21faa",
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();


























async function getGeminiSummary(text) {
  const API_KEY = "";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${AIzaSyBKu3XGgOYrKc8Y4_IgdQb53JwbrU8kHzc}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{
  text: `
You are helping a campus lost-and-found system.
Create ONE short, clear sentence summarizing the item.
Mention item, color/type, and location if available.

Text:
${text}
`
}]

            
          }
        ]
      })
    }
  );

  const data = await response.json();
  console.log("Full Gemini response:", data);

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
   
  }




    const foundForm = document.getElementById("foundForm");


  let userId = localStorage.getItem("userId");

if (!userId) {
  userId = "user_" + Date.now();
  localStorage.setItem("userId", userId);
}
//
  foundForm.addEventListener("submit", async (e) => {
    e.preventDefault();
     const descriptionText = document.getElementById("description").value;
    // Gemini AI summary
let aiSummary = "";

try {
  aiSummary = await getGeminiSummary(descriptionText);
} catch (err) {
  console.warn("Gemini API blocked in frontend. Using fallback summary.");
}

if (!aiSummary) {
  aiSummary = descriptionText.slice(0, 80) + "...";
}

console.log("AI Summary:", aiSummary);


  //
    try {
      await db.collection("items").add({
  itemName: document.getElementById("itemName").value,
  description: document.getElementById("description").value,
  location: document.getElementById("location").value,
  imageUrl: document.getElementById("imageUrl").value,
  date: document.getElementById("foundDate").value,
  contact: document.getElementById("contact").value,
  status: "found",
  ownerId: userId,
  resolved: false,
  aiSummary: aiSummary,
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});

      

      alert("Found item reported successfully!");
      foundForm.reset();
      window.location.href = "index.html";

    } catch (error) {
      alert("Error submitting report");
      console.error(error);
    }
  });
