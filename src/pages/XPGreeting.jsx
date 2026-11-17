import { useEffect, useRef } from "react";

export default function XPGreeting() {
  const titleRef = useRef(null);
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main className="xp-entry xp-greeting" aria-labelledby="xp-greeting-title">
      <div className="xp-entry-top" aria-hidden="true" />
      <section className="xp-entry-center xp-greeting-center">
        <h1 id="xp-greeting-title" ref={titleRef} tabIndex={-1}>
          Bem-vindo
        </h1>
      </section>
      <footer className="xp-entry-bottom" aria-hidden="true" />
    </main>
  );
}
