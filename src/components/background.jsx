const Background = () => {
  return (
    <div className="scene">
      <div className="sky-master-container">
        <div className="sky-master-gradient"></div>
      </div>

      <div className="stars-layer">
        <div className="stars stars-1"></div>
        <div className="stars stars-2"></div>
        <div className="stars stars-3"></div>
        <div className="meteor m1"></div>
        <div className="meteor m2"></div>
        <div className="meteor m3"></div>
      </div>

      <div className="moon-wrapper">
        <div className="moon"></div>
      </div>

      <div className="sun-wrapper">
        <div className="sun"></div>
      </div>

      <div className="clouds-container">
        <div className="cloud cloud-1"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div><div className="puff p4"></div></div>
        <div className="cloud cloud-2"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div><div className="puff p4"></div></div>
        <div className="cloud cloud-3"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div><div className="puff p4"></div></div>
        <div className="cloud cloud-4"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div><div className="puff p4"></div></div>
        <div className="cloud cloud-5"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div><div className="puff p4"></div></div>
        <div className="cloud cloud-6"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div><div className="puff p4"></div></div>
        <div className="cloud cloud-h1"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div></div>
        <div className="cloud cloud-h2"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div></div>
        <div className="cloud cloud-h3"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div></div>
        <div className="cloud cloud-h4"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div></div>
      </div>
    </div>
  );
};

export default Background;