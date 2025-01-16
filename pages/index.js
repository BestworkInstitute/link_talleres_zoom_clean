import { useState } from "react";

export default function Home() {
  const [rut, setRut] = useState("");
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const buscarDatos = async (e) => {
    e.preventDefault();
    setError("");
    setResultados([]);
    setLoading(true);

    try {
      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rut }),
      });

      if (!response.ok) {
        throw new Error(await response.json().then((res) => res.error));
      }

      const data = await response.json();
      setResultados(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      {/* Logo */}
      <div>
        <img
          src="https://bestwork.cl/wp-content/uploads/2023/05/Logo.png"
          alt="BestWork Logo"
          style={{ maxWidth: "200px", marginBottom: "1rem" }}
        />
      </div>

      {/* Título */}
      <h1 style={{ color: "#ff9900", fontSize: "1.8rem", marginBottom: "1rem" }}>
        Revisa aquí el link del día
      </h1>
      <p style={{ color: "#666", fontSize: "1.2rem", marginBottom: "2rem" }}>
        Si no encuentras tu link, ¡contáctanos!
      </p>

      {/* Formulario */}
      <form onSubmit={buscarDatos} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Ingresa tu RUT (Ej: 12345678-9)"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginRight: "1rem",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {/* Mensaje de error */}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {/* Tabla de Resultados */}
      {resultados.length > 0 && (
        <table
          style={{
            width: "80%",
            margin: "0 auto",
            borderCollapse: "collapse",
            backgroundColor: "#f9f9f9",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
              <th style={{ padding: "0.5rem" }}>Nombre</th>
              <th style={{ padding: "0.5rem" }}>RUT</th>
              <th style={{ padding: "0.5rem" }}>Fecha</th>
              <th style={{ padding: "0.5rem" }}>Hora</th>
              <th style={{ padding: "0.5rem" }}>Link Taller</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((fila, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "0.5rem", textAlign: "center" }}>{fila[0]}</td>
                <td style={{ padding: "0.5rem", textAlign: "center" }}>{fila[1]}</td>
                <td style={{ padding: "0.5rem", textAlign: "center" }}>{fila[2]}</td>
                <td style={{ padding: "0.5rem", textAlign: "center" }}>{fila[3]}</td>
                <td style={{ padding: "0.5rem", textAlign: "center" }}>
                  <a href={fila[4]} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
                    Ver Taller
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}