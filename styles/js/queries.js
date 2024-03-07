const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

const fetchMessageInfo = async () => {
  const authToken = localStorage.getItem("token");

  try {
    const response = await fetch(
      "https://mybrand-prince-be.onrender.com/api/messages",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch message");
    }

    const data = await response.json();
    const messages = data.data;
    const cardContainer = document.getElementById("cardContainer");

    const displayMessages = () => {
      cardContainer.innerHTML = "";

      messages.forEach((message, index) => {
        const messageCard = document.createElement("div");
        messageCard.classList.add("message-card");

        messageCard.innerHTML = `
              <div class="address">
                <!-- Profile picture -->
                <img
                  src="images/icons/PersonCircle.png"
                  alt="Profile Picture"
                  class="profile-pic"
                />
                <!-- Sender's email -->
                <div class="sender-email">${message.username} (${
          message.email
        })</div>
                <span style="color:#D9D9D9;">.${formatDate(
                  message.createdAt
                )}</span>
              </div>
              <!-- Email content -->
              <div class="email-content">${message.querie}</div>
              <!-- Reply button -->
              <button class="reply-button">Reply</button>
            `;

        cardContainer.appendChild(messageCard);
      });
    };

    displayMessages();
  } catch (error) {
    console.error("Error fetching messages:", error.message);
  }
};

fetchMessageInfo();
