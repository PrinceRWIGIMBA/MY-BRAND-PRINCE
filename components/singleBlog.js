function SingleBlog() {
  const { useState, useEffect } = React;
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [editorContents, setEditorContents] = useState("");
  const [contentError, setContentError] = useState("");
  const [contentSuccess, setContentSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const toggleComments = () => {
    let commentsContainer = document.querySelector(".comments");
    let seeAllLink = document.querySelector(".see-all a");

    if (
      commentsContainer.style.maxHeight === "150px" ||
      commentsContainer.style.maxHeight === ""
    ) {
      commentsContainer.style.maxHeight = "none";
      seeAllLink.textContent = "Collapse";
    } else {
      commentsContainer.style.maxHeight = "150px";
      seeAllLink.textContent = "See all";
    }
  };

  const toggleForm = () => {
    var editorContainer = document.getElementById("editor-container");
    editorContainer.style.display =
      editorContainer.style.display === "none" ? "block" : "none";
  };

  const fetchBlog = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get("index");

    try {
      const response = await fetch(
        `https://mybrand-prince-be.onrender.com/api/blogs/${blogId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const viewedBlog = await response.json();
      setBlog(viewedBlog);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setContentError("Error fetching blog. Please try again later.");
    }
  };

  const fetchComments = async () => {
    if (!blog) return;

    const { comments } = blog;
    if (!comments || comments.length === 0) return;

    try {
      const commentPromises = comments.map((commentId) => {
        return fetch(
          `https://mybrand-prince-be.onrender.com/api/comments/${commentId}`
        )
          .then((response) => response.json())
          .then((comment) => {
            return fetch(
              `https://mybrand-prince-be.onrender.com/api/auth/Users/${comment.data.user}`
            )
              .then((userResponse) => userResponse.json())
              .then((user) => ({
                ...comment,
                user: user.data,
              }));
          });
      });

      const resolvedComments = await Promise.all(commentPromises);
      setComments(resolvedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setContentError("Error fetching comments. Please try again later.");
    }
  };

  const likeBlog = () => {
    if (!blog) return;
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      console.error("Authentication token not found.");
      setContentError("Please login to like the blog.");
      return;
    }

    setLoading(true);
    fetch(`https://mybrand-prince-be.onrender.com/api/blogs/like/${blog._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        setLoading(false);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Blog liked successfully:", result);
        setContentSuccess("Blog liked successfully.");
        setTimeout(() => {
          setContentSuccess("");
        }, 3000);
        fetchBlog();
      })
      .catch((error) => {
        console.error("Error liking blog:", error);
        setContentError("Error liking blog. Please try again later.");
        setTimeout(() => {
          setContentError("");
        }, 3000);
      });
  };

  const dislikeBlog = () => {
    if (!blog) return;
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      console.error("Authentication token not found.");
      setContentError("Please login to dislike the blog.");
      setTimeout(() => {
        setContentError("");
      }, 3000);
      return;
    }

    setLoading(true);
    fetch(
      `https://mybrand-prince-be.onrender.com/api/blogs/dislike/${blog._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
      .then((response) => {
        setLoading(false);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Blog disliked successfully:", result);
        setContentSuccess("Blog disliked successfully.");
        setTimeout(() => {
          setContentSuccess("");
        }, 3000);
        fetchBlog();
      })
      .catch((error) => {
        console.error("Error disliking blog:", error);
        setContentError("Error disliking blog. Please try again later.");
        setTimeout(() => {
          setContentError("");
        }, 3000);
      });
  };

  const handleEditorChange = (event) => {
    setEditorContents(event.target.value);
  };

  const validateForm = (event) => {
    event.preventDefault();

    setContentError("");
    setContentSuccess("");
    setLoading(true);

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      setContentError("Please login before to add comment.");
      setLoading(false);
      return;
    }

    const description = editorContents.trim();
    if (description === "") {
      setContentError("Content is required.");
      setLoading(false);
      return;
    }

    fetch(`https://mybrand-prince-be.onrender.com/api/comments/${blog._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        description: description,
      }),
    })
      .then((response) => {
        setLoading(false);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Comment submitted successfully:", result);
        setContentSuccess("Comment submitted successfully.");
        setTimeout(() => {
          setContentSuccess("");
          window.location.reload();
        }, 3000);

        fetchComments(); // Update comments after submitting
      })
      .catch((error) => {
        console.error("Error submitting comment:", error);
        setContentError("Error submitting comment. Please try again later.");
        setTimeout(() => {
          setContentError("");
          window.location.reload();
        }, 3000);
      });
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [blog]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post">
      <h1 className="comment-title">{blog.title}</h1>
      <div className="blog">
        <div className="image-container">
          <img id="blogImage" src={blog.image} alt={blog.title} />
        </div>
        <h5 style={{ fontSize: "16px", color: "gray" }}>{`Date: ${formatDate(
          blog.createdAt
        )}`}</h5>
        <p
          dangerouslySetInnerHTML={{
            __html: blog.contents,
          }}
          id="blogContent"
        ></p>

        <div className="blog-post-actions">
          <a href="#" onClick={likeBlog}>
            <i className="far fa-thumbs-up" style={{ color: "#ffd43b" }}></i>
            <h4>{`${blog.likes.length} Likes`}</h4>
          </a>
          <a href="#" onClick={dislikeBlog}>
            <i className="far fa-thumbs-down" style={{ color: "#ffd43b" }}></i>
            <h4>{`${blog.disLikes.length} Dislikes`}</h4>
          </a>
          <span className="add" onClick={toggleForm}>
            <i className="far fa-comments" style={{ color: "#ffd43b" }}></i>
          </span>
        </div>
        <div id="errorMessage" className="error-message">
          {contentError}
        </div>
        <div
          id="successMessage"
          style={{ color: "green" }}
          className="success-message"
        >
          {contentSuccess}
        </div>
      </div>

      <div id="editor-container" style={{ display: "none" }}>
        <form id="postForm" onSubmit={validateForm}>
          <span id="contentError" className="error">
            {contentError}
          </span>
          <span id="contentSuccess" className="success">
            {contentSuccess}
          </span>
          <label htmlFor="content" style={{ fontSize: "24px" }}>
            Comment:
          </label>
          <textarea
            id="editor"
            className="textarea-editor"
            value={editorContents}
            onChange={handleEditorChange}
          ></textarea>

          <button type="submit" id="comment-btn" disabled={loading}>
            {loading ? "Submitting..." : "Comment"}
          </button>
          <span className="loader"></span>
        </form>
      </div>

      <h1 className="comment-title">Comments</h1>
      <div className="comments" id="commentsContainer">
        {comments.map((comment, index) => (
          <div className="comment" key={index}>
            <div className="profile-p">
              <img src="images/icons/PersonCircle.png" alt="" />
            </div>
            <div className="comment-contents">
              <h1 id="username">{`${comment.user.firstname} ${comment.user.lastname}`}</h1>
              <span id="createdAt">{formatDate(comment.data.createdAt)}</span>
              <p
                dangerouslySetInnerHTML={{
                  __html: comment.data.description,
                }}
                id="description"
              ></p>
            </div>
          </div>
        ))}
        {comments.length === 0 && <p>No comments available.</p>}
      </div>

      <div className="see-all">
        <a href="#" onClick={toggleComments}>
          See all
        </a>
      </div>
    </div>
  );
}

ReactDOM.render(<SingleBlog />, document.getElementById("singleBlog"));
