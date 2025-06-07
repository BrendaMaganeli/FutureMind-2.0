import { useState, useEffect } from "react";

function AnimationTemplate() {

    const [mostrarLogo, setMostrarLogo] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setMostrarLogo(false), 2500);
        return () => clearTimeout(timer);
      }, []);

  return (
    <>
    {mostrarLogo ? (
        <div className="logo-container">
          <img src="logo oficial.svg" alt="Logo" className="logo-animada" />
        </div>
    )
    :
    <div>AnimationTemplate</div>
    }
    </>
  );
};

export default AnimationTemplate;