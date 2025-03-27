import {useEffect, useState} from 'react'

function ListaPeliculas() {
  const [hora, setHora] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
    <h1>listaPeliculas {hora}</h1>
    <p>Lorem dolor sit amet consectetur adipisicing elit. Est doloribus deleniti voluptatem ipsum! A, incidunt repellat Odio vitae eum eligendi labore, rem dolorum itaque ducimus</p>
    </>
  )
}

export default ListaPeliculas