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
      throw new Error("Failed to fetch messages");
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
      
         <div class="actions">
         <button class="reply-button" onclick="window.location.href='mailto:${
           message.email
         }?subject=Subject%20Here&body=Body%20Here'">Reply</button>
       
        ${
          authToken
            ? `<button class="delete-button" id="delete-button" data-id="${message.id}">Delete</button>`
            : ""
        } <span class="loader"></span>
      </div>`;

        cardContainer.appendChild(messageCard);
      });

      // Add event listener for delete buttons
      const deleteButtons = document.querySelectorAll(".delete-button");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
          const messageId = event.target.getAttribute("data-id");
          const confirmed = confirm(
            "Are you sure you want to delete this message?"
          );
          if (confirmed) {
            try {
              document.querySelector(".loader").style.display = "block";
              document.querySelector("#delete-button").style.display = "none";
              const deleteResponse = await fetch(
                `https://mybrand-prince-be.onrender.com/api/messages/${messageId}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );
              if (!deleteResponse.ok) {
                throw new Error("Failed to delete message");
              }
              // If successful, remove the message card from UI
              event.target.parentNode.remove();
              document.querySelector(".loader").style.display = "block";
              document.querySelector("#delete-button").style.display = "none";
              setTimeout(() => {
                window.location.reload();
              }, 500);
            } catch (error) {
              console.error("Error deleting message:", error.message);
            }
          }
        });
      });
    };

    displayMessages();
  } catch (error) {
    console.error("Error fetching messages:", error.message);
  }
};

fetchMessageInfo();
