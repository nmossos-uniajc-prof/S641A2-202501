import { useEffect, useState } from "react";

function Post() {
    const [datos, setDatos] = useState([]);

    useEffect(() => {
      fetch("https://jsonplaceholder.typicode.com/posts")
        .then((res) => res.json())
        .then((data) => setDatos(data.slice(0, 5)));
    }, []);
  
    return (
      <ul>
        {datos.map((post) => (
          <li key={post.id}><b>Titulo: {post.title}</b>
          <p>{post.body}</p>
          </li>
        ))}
      </ul>
    );
}

export default Post